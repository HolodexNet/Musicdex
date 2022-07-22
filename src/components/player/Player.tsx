import { useToast } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState, useStoreActions, store } from "../../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { formatSeconds } from "../../utils/SongHelper";
import { PlayerBar } from "./PlayerBar";
import { usePlayer, getID } from "./YoutubePlayer";
import { useTrackSong } from "../../modules/services/songs.service";

const retryCounts: Record<string, number> = {};
const trackedSongs: Set<string> = new Set();

export function Player({ player }: { player: YouTubePlayer | null }) {
  const toast = useToast();
  const position = useStoreState((store) => store.player.position);
  const setOverridePos = useStoreActions(
    (store) => store.player.setOverridePosition,
  );
  // Current song
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song,
  );
  const repeat = useStoreState(
    (state) => state.playback.currentlyPlaying.repeat,
  );
  const isPlaying = useStoreState((actions) => actions.playback.isPlaying);
  const setIsPlaying = useStoreActions(
    (actions) => actions.playback.setIsPlaying,
  );
  const previous = useStoreActions((actions) => actions.playback.previous);
  const next = useStoreActions((actions) => actions.playback.next);
  const toggleShuffleMode = useStoreActions(
    (actions) => actions.playback.toggleShuffle,
  );
  const toggleRepeatMode = useStoreActions(
    (actions) => actions.playback.toggleRepeat,
  );

  const setFullPlayer = useStoreActions(
    (actions) => actions.player.setFullPlayer,
  );

  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong],
  );

  const { mutate: trackSong } = useTrackSong();

  const {
    currentVideo,
    state,
    currentTime,
    setError,
    hasError,
    volume,
    muted,
  } = usePlayer(player);
  const [progress, setProgress] = useState(0);
  const [volumeSlider, setVolumeSlider] = useState(0);
  // Stop song from playing on initial page load
  const [firstLoadPauseId, setFirstLoadPauseId] = useState("");

  // Player volume change event
  useEffect(() => {
    setVolumeSlider(volume ?? 0);
  }, [volume]);

  const loadVideoAtTime = useCallback(
    async (video_id: string, time: number) => {
      if (!player) return;

      if (getID(await player.getVideoUrl()) !== video_id) {
        await player.loadVideoById({
          videoId: video_id,
          startSeconds: time,
        });
      }
      // NOTE: Bad YouTube cookies let the player ignores startSeconds so here is explicit `seekTo`
      player.seekTo(time, true);
    },
    [player],
  );

  // Jot down the song that the page loaded on, and keep this paused
  useEffect(() => {
    if (currentSong?.id) {
      setFirstLoadPauseId(`${currentSong?.id || ""}${repeat || ""}`);
    } else {
      setOverridePos("hidden");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Player State Event
  useEffect(() => {
    // A seek to caused player to unpause, pause on loaded
    if (firstLoadPauseId) {
      setIsPlaying(false);
      player?.pauseVideo();
      return;
    }
    setIsPlaying(
      state === PlayerStates.BUFFERING || state === PlayerStates.PLAYING,
    );
  }, [firstLoadPauseId, player, setIsPlaying, state]);

  // Sanity video id check event
  useEffect(() => {
    if (
      player &&
      currentSong?.video_id &&
      currentVideo !== currentSong?.video_id
    ) {
      loadVideoAtTime(currentSong.video_id, currentSong.start).then(() => {
        setError(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    player,
    currentVideo,
    currentSong?.video_id,
    currentSong?.start,
    setError,
  ]);

  // CurrentSong/repeat update event
  useEffect(() => {
    if (!player) return;

    // Song changed, and is no longer the pause locked song, allow autoplay
    if (
      firstLoadPauseId &&
      firstLoadPauseId !== `${currentSong?.id || ""}${repeat || ""}`
    ) {
      setFirstLoadPauseId("");
    }

    if (currentSong) {
      console.log("[Player] Playing Song:", currentSong.name);
      loadVideoAtTime(currentSong.video_id, currentSong.start).then(() => {
        player.playVideo();
        setProgress(0);
        setError(false);
        if (position === "hidden") setOverridePos(undefined);
      });
    } else {
      player?.pauseVideo();
      setProgress(0);
      setOverridePos("hidden");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, currentSong, repeat, setError]);

  // CurrentTime Event
  useEffect(() => {
    if (
      currentTime === undefined ||
      currentSong === undefined ||
      currentSong.video_id !== currentVideo
    ) {
      return setProgress(0);
    }
    const newProgress =
      ((currentTime - currentSong.start) * 100) /
      (currentSong.end - currentSong.start);

    // Something caused it to skip far ahead (e.g. user scrubbed, song time changed on the same video)
    if (newProgress > 105) {
      loadVideoAtTime(currentSong.video_id, currentSong.start);
      return;
    }

    // Prevent time from playing before start time
    if (newProgress < 0) {
      player?.seekTo(currentSong.start, true);
      setProgress(0);
      return;
    }

    if (
      newProgress > 80 &&
      newProgress < 105 &&
      !trackedSongs.has(currentSong.id)
    ) {
      console.log("[Player] Track song play: ", currentSong.name);
      trackedSongs.add(currentSong.id);
      trackSong({ song_id: currentSong.id });
    }

    setProgress(newProgress);
  }, [
    currentSong,
    currentTime,
    currentVideo,
    loadVideoAtTime,
    player,
    trackSong,
  ]);

  // End Progress Event
  useEffect(() => {
    if (!player || !currentSong || currentTime === undefined) return;
    if (currentSong.video_id !== currentVideo) return;

    // console.log("Current Progress:", progress, state);

    // Progress will never reach 100 because player ended. Video length != song start/end
    // Example id: KiUvL-rp1zg
    const earlyEnd = state === PlayerStates.ENDED && progress < 100;
    // Proceed to next song
    if ((progress >= 100 && state === PlayerStates.PLAYING) || earlyEnd) {
      console.log(
        `Auto advancing due to: ${
          progress >= 100 ? "prog>100" : "playerStatus=Ended"
        }`
      );
      setProgress(0);
      next({ count: 1, userSkipped: false });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, player, progress, state]);

  // Error handling: try to reload
  useEffect(() => {
    const MAX_RETRIES = 3;
    if (!(player && hasError && currentSong)) return;

    if (!retryCounts[currentSong.video_id])
      retryCounts[currentSong.video_id] = 0;

    if (retryCounts[currentSong.video_id] < MAX_RETRIES) {
      // if (getID(player.getVideoUrl()) !== currentSong.video_id) return;
      setTimeout(() => {
        console.log(
          `[Player] Retrying ${currentSong.name} - attempt #${
            retryCounts[currentSong.video_id]
          }/${MAX_RETRIES}`
        );
        player.loadVideoById(currentSong.video_id, currentSong.start);
        setError(false);
      }, 2000);
      retryCounts[currentSong.video_id] += 1;
      return;
    }
    console.log(
      "[PLAYER] SKIPPING DUE TO VIDEO PLAYBACK FAILURE (maybe the video is blocked in your country)"
    );
    toast({
      position: "top-right",
      status: "warning",
      title: `The Song: ${currentSong?.name} is not playable. Skipping it.`,
      isClosable: true,
    });
    next({ count: 1, userSkipped: false, hasError: true });
    setError(false);
  }, [hasError, currentSong, toast, next, setError, player]);

  const onProgressChange = useCallback(
    (e: number) => {
      if (!currentSong) return;
      setProgress(e);
      player?.seekTo(currentSong.start + (e / 100) * totalDuration, true);
    },
    [currentSong, player, totalDuration],
  );

  const onVolumeChange = useCallback(
    (e: number) => {
      player?.unMute();
      player?.setVolume(e);
      setVolumeSlider(e);
    },
    [player, setVolumeSlider],
  );

  const seconds = useMemo(() => {
    return formatSeconds((progress / 100) * totalDuration);
  }, [progress, totalDuration]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    // User action, unlock the first load pause
    if (firstLoadPauseId) setFirstLoadPauseId("");
    if (player) isPlaying ? player.pauseVideo() : player.playVideo();
    setIsPlaying(!isPlaying);
  }, [currentSong, firstLoadPauseId, isPlaying, player, setIsPlaying]);

  // Keyboard shortcuts
  // Follows Spotify keyboard shortcuts

  // Toggle play/pause
  useHotkeys(
    "space",
    (e) => {
      e.preventDefault();
      togglePlay();
    },
    []
  );

  // Toggle repeat / shuffle mode
  useHotkeys("ctrl+r, cmd+r, ctrl+s, cmd+s", (e, handler) => {
    e.preventDefault();

    switch (handler.key) {
      case "ctrl+r":
      case "cmd+r":
        toggleRepeatMode();
        break;

      case "ctrl+s":
      case "cmd+s":
        toggleShuffleMode();
        break;
    }
  });

  // Volume control
  useHotkeys(
    "ctrl+up, cmd+up, ctrl+down, cmd+down, ctrl+shift+up, cmd+shift+up, ctrl+shift+down, cmd+shift+down",
    (e, handler) => {
      e.preventDefault();
      player?.getVolume().then((currentVol = 100) => {
        switch (handler.key) {
          case "ctrl+up":
          case "cmd+up":
            player?.unMute();
            player?.setVolume(currentVol !== 100 ? currentVol + 5 : 100);
            break;
          case "ctrl+down":
          case "cmd+down":
            player?.unMute();
            player?.setVolume(currentVol !== 0 ? currentVol - 5 : 0);
            break;
          case "ctrl+shift+up":
          case "cmd+shift+up":
            // Unmute / Max volume (when unmuted)
            muted ? player?.unMute() : player?.setVolume(100);
            break;
          case "ctrl+shift+down":
          case "cmd+shift+down":
            player?.mute();
            break;
        }
      });
    },
    [volumeSlider, muted],
  );

  // Forward / Backtrack tracks
  useHotkeys(
    "ctrl+left, cmd+left, ctrl+right, cmd+right",
    (e, handler) => {
      e.preventDefault();

      switch (handler.key) {
        case "ctrl+left":
        case "cmd+left":
          if (player && currentSong) {
            if (progress <= 2) {
              previous();
            } else {
              player.seekTo(currentSong.start, true);
              setProgress(0);
            }
          }
          break;
        case "ctrl+right":
        case "cmd+right":
          next({ count: 1, userSkipped: true });
          break;
      }
    },
    [player, currentSong, progress],
  );

  // Open / Close full-screen player
  useHotkeys("f, esc", (e, handler) => {
    e.preventDefault();
    switch (handler.key) {
      case "f":
        setFullPlayer(true);
        setOverridePos("full-player");
        break;
      case "esc":
        setFullPlayer(false);
        setOverridePos(undefined);
        break;
    }
  });

  return (
    <PlayerBar
      progress={progress}
      onProgressChange={onProgressChange}
      currentSong={currentSong}
      togglePlay={togglePlay}
      seconds={seconds}
      totalDuration={totalDuration}
      volume={volumeSlider}
      muted={muted}
      onVolumeChange={onVolumeChange}
    />
  );
}
