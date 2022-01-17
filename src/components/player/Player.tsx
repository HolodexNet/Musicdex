import { useToast } from "@chakra-ui/react";
import { useStoreState, useStoreActions, store } from "../../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { formatSeconds } from "../../utils/SongHelper";
import { PlayerBar } from "./PlayerBar";
import { usePlayer, getID } from "./YoutubePlayer";

const retryCounts: Record<string, number> = {};
export function Player({ player }: { player: any }) {
  const toast = useToast();
  const position = useStoreState((store) => store.player.position);
  const setOverridePos = useStoreActions(
    (store) => store.player.setOverridePosition
  );
  // Current song
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  const repeat = useStoreState(
    (state) => state.playback.currentlyPlaying.repeat
  );
  const next = useStoreActions((actions) => actions.playback.next);

  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong]
  );

  const { currentVideo, state, currentTime, setError, hasError, volume } =
    usePlayer(player);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeSlider, setVolumeSlider] = useState(0);
  // Stop music from playing immediately on load
  const [firstLoadPauseId, setFirstLoadPauseId] = useState("");
  // Player volume change event
  useEffect(() => {
    setVolumeSlider(volume ?? 0);
  }, [volume]);

  const loadVideoAtTime = useCallback(
    (video_id: string, time: number) => {
      if (player) {
        if (getID(player.getVideoUrl()) === video_id) {
          player.seekTo(time);
        } else {
          player.loadVideoById({
            videoId: video_id,
            startSeconds: time,
          });
        }
      }
    },
    [player]
  );

  useEffect(() => {
    if (currentSong) setFirstLoadPauseId(currentSong?.video_id);
  }, []);
  // Player State Event
  useEffect(() => {
    if (firstLoadPauseId) {
      setIsPlaying(false);
      player?.pauseVideo();
      return;
    }

    setIsPlaying(
      state === PlayerStates.BUFFERING || state === PlayerStates.PLAYING
    );
  }, [firstLoadPauseId, player, state]);

  // Sanity video id check event
  useEffect(() => {
    if (
      player &&
      currentSong?.video_id &&
      currentVideo !== currentSong?.video_id
    ) {
      loadVideoAtTime(currentSong.video_id, currentSong.start);
      setError(false);
    }
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

    if (firstLoadPauseId && firstLoadPauseId !== currentSong?.video_id) {
      setFirstLoadPauseId("");
    }

    if (currentSong) {
      loadVideoAtTime(currentSong.video_id, currentSong.start);
      setError(false);
      if (position === "hidden") setOverridePos(undefined);
    } else {
      player?.loadVideoById();
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

    if (newProgress > 100) {
      loadVideoAtTime(currentSong.video_id, currentSong.start);
      return;
    }
    // Prevent time from playing before start time
    if (newProgress < 0) {
      player.seekTo(currentSong.start, true);
      setProgress(0);
      return;
    }
    setProgress(newProgress);
  }, [currentSong, currentTime, currentVideo, loadVideoAtTime, player]);

  // End Progress Event
  useEffect(() => {
    if (!player || !currentSong || currentTime === undefined) return;
    if (currentSong.video_id !== currentVideo) {
      return;
    }

    // Proceeed to next song
    if (progress >= 100) {
      setProgress(0);
      next({ count: 1, userSkipped: false });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Error Event Effect
  useEffect(() => {
    if (player && hasError && currentSong) {
      // Initialize retry count
      if (!retryCounts[currentSong.video_id])
        retryCounts[currentSong.video_id] = 0;

      // Allow up to 3 retries
      if (retryCounts[currentSong.video_id] <= 3) {
        if (getID(player.getVideoUrl()) !== currentSong.video_id) return;
        setTimeout(() => {
          console.log(
            `Retrying ${currentSong.name} - attempt #${
              retryCounts[currentSong.video_id]
            }/4`
          );
          player.loadVideoById(currentSong.video_id, currentSong.start);
          setError(false);
        }, 2000);
        retryCounts[currentSong.video_id] += 1;
        return;
      }

      console.log(
        "SKIPPING____ DUE TO VIDEO PLAYBACK FAILURE (maybe the video is blocked in your country)"
      );
      toast({
        position: "top-right",
        status: "warning",
        title: `The Song: ${currentSong?.name} is not playable. Skipping it.`,
        duration: 10000,
      });
      next({ count: 1, userSkipped: false, hasError: true });
      setError(false);
    }
  }, [hasError, currentSong, toast, next, setError, player]);

  function onProgressChange(e: any) {
    if (!currentSong) return;
    setProgress(e);
    player?.seekTo(currentSong.start + (e / 100) * totalDuration, true);
  }

  const seconds = useMemo(() => {
    return formatSeconds((progress / 100) * totalDuration);
  }, [progress, totalDuration]);

  function togglePlay() {
    if (!currentSong) return;
    if (firstLoadPauseId) setFirstLoadPauseId("");
    if (player) isPlaying ? player.pauseVideo() : player.playVideo();
    setIsPlaying((prev) => !prev);
  }
  return (
    <PlayerBar
      {...{
        progress,
        onProgressChange,
        currentSong,
        isPlaying,
        togglePlay,
        next,
        player,
        seconds,
        totalDuration,
        volume: volumeSlider,
        onVolumeChange: (e) => {
          player?.setVolume(e);
          setVolumeSlider(e);
        },
      }}
    />
  );
}
