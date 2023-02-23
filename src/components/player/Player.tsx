import { useToast } from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "../../store";
import { useCallback, useEffect, useContext } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { PlayerBar } from "./PlayerBar";
import { usePlayer, getID, usePlayerStats } from "./YoutubePlayer";
import { useTrackSong } from "../../modules/services/songs.service";
import { PlayerContext } from "../layout/Frame";
import { useKeyboardEvents } from "./PlayerKeyboardControls";

const retryCounts: Record<string, number> = {};
const trackedSongs: Set<string> = new Set();

export function Player() {
  const [player] = useContext(PlayerContext);
  const toast = useToast();

  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song,
  );
  const repeat = useStoreState(
    (state) => state.playback.currentlyPlaying.repeat,
  );
  const setIsPlaying = useStoreActions(
    (actions) => actions.playback.setIsPlaying,
  );
  const next = useStoreActions((actions) => actions.playback.next);

  const { progress } = usePlayerStats();

  const { mutate: trackSong } = useTrackSong();

  const { state, setError, hasError } = usePlayer();

  // Keyboard controls
  useKeyboardEvents();

  const loadVideoAtTime = useCallback(
    async (video_id: string, time: number) => {
      if (!player || !currentSong) return;

      if (getID(await player.getVideoUrl()) !== video_id) {
        await player.loadVideoById({
          videoId: video_id,
          startSeconds: time,
        });
      } else {
        await player.seekTo(currentSong.start, true);
      }
      // Comment the line below cuz `seekTo` resets progress
      // NOTE: Bad YouTube cookies let the player ignores startSeconds so here is explicit `seekTo`
      // player.seekTo(time, true);
    },
    [player, currentSong],
  );

  // keep the song that the page loaded on paused
  useEffect(() => {
    if (currentSong) {
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CurrentSong/repeat update event
  useEffect(() => {
    if (currentSong) {
      loadVideoAtTime(currentSong?.video_id, currentSong?.start);
      state === PlayerStates.PLAYING && setIsPlaying(true);
    } else {
      player?.stopVideo();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, currentSong, repeat]);

  // Player State Event
  useEffect(() => {
    setIsPlaying(
      state === PlayerStates.BUFFERING || state === PlayerStates.PLAYING,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Progress Event
  useEffect(() => {
    // Prevent time from playing before start time
    if (currentSong && progress < 0) {
      player?.seekTo(currentSong.start, true);
      player?.playVideo();
      return;
    }

    // Track song to history if the song has listened > 80%
    if (
      currentSong &&
      progress > 80 &&
      progress < 105 &&
      !trackedSongs.has(currentSong.id)
    ) {
      console.log("[Player] Track song play: ", currentSong.name);
      trackedSongs.add(currentSong.id);
      trackSong({ song_id: currentSong.id });
    }

    // Something caused it to skip far ahead (e.g. user scrubbed, song time changed on the same video)
    if (currentSong && progress > 105) {
      loadVideoAtTime(currentSong.video_id, currentSong.start);
      player?.playVideo();
      return;
    }

    // Progress will never reach 100 because player ended. Video length != song start/end
    // Example id: KiUvL-rp1zg
    const earlyEnd = state === PlayerStates.ENDED && progress < 100;
    if ((progress >= 100 && state === PlayerStates.PLAYING) || earlyEnd) {
      console.log(
        `[Player] Auto advancing due to ${
          progress >= 100 ? "Song progress >= 100" : "Player status === ENDED"
        }`,
      );
      next({ count: 1, userSkipped: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, state]);

  // Error handling: try to reload
  useEffect(() => {
    const MAX_RETRIES = 3;
    if (!(player && hasError && currentSong)) return;

    if (!retryCounts[currentSong.video_id])
      retryCounts[currentSong.video_id] = 0;

    if (retryCounts[currentSong.video_id] < MAX_RETRIES) {
      // NOTE: async function breaks the flow, so commented it out
      // if (getID(player.getVideoUrl()) !== currentSong.video_id) return;
      setTimeout(() => {
        console.log(
          `[Player] Retrying ${currentSong.name} - attempt #${
            retryCounts[currentSong.video_id]
          }/${MAX_RETRIES}`,
        );
        player.loadVideoById(currentSong.video_id, currentSong.start);
        setError(false);
      }, 2000);
      retryCounts[currentSong.video_id] += 1;
      return;
    }
    console.log(
      "[PLAYER] SKIPPING DUE TO VIDEO PLAYBACK FAILURE (maybe the video is blocked in your country)",
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

  return <PlayerBar />;
}
