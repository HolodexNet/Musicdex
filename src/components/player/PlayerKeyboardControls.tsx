import { useContext } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStoreActions, useStoreState } from "../../store";
import { PlayerContext } from "../layout/Frame";
import { usePlayer } from "./YoutubePlayer";

// Keyboard shortcuts
// Follows Spotify keyboard shortcuts
export function useKeyboardEvents() {
  const [player] = useContext(PlayerContext);
  const { muted } = usePlayer();
  const setFullPlayer = useStoreActions(
    (action) => action.player.setFullPlayer,
  );
  const setOverridePos = useStoreActions(
    (action) => action.player.setOverridePosition,
  );
  const isPlaying = useStoreState((state) => state.playback.isPlaying);
  const setIsPlaying = useStoreActions(
    (action) => action.playback.setIsPlaying,
  );

  const previous = useStoreActions((actions) => actions.playback.previous);
  const next = useStoreActions((actions) => actions.playback.next);

  const toggleShuffleMode = useStoreActions(
    (actions) => actions.playback.toggleShuffle,
  );
  const toggleRepeatMode = useStoreActions(
    (actions) => actions.playback.toggleRepeat,
  );

  // Open / Close full-screen player
  useHotkeys(
    "f, esc",
    (e, handler) => {
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
    },
    [setFullPlayer, setOverridePos],
  );

  // Toggle play/pause
  useHotkeys(
    "space",
    (e) => {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    },
    [setIsPlaying, isPlaying],
  );

  // Toggle repeat / shuffle mode
  useHotkeys(
    "ctrl+r, cmd+r, ctrl+s, cmd+s",
    (e, handler) => {
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
    },
    [toggleRepeatMode, toggleShuffleMode],
  );

  // Volume control
  useHotkeys(
    "ctrl+up, cmd+up, ctrl+down, cmd+down, ctrl+shift+up, cmd+shift+up, ctrl+shift+down, cmd+shift+down",
    (e, handler) => {
      e.preventDefault();
      const currentVol = player?.getVolume() as unknown as number;
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
    },
    [player, muted],
  );

  // Forward / Backtrack tracks
  useHotkeys(
    "ctrl+left, cmd+left, ctrl+right, cmd+right",
    (e, handler) => {
      e.preventDefault();

      switch (handler.key) {
        case "ctrl+left":
        case "cmd+left":
          if (player) {
            previous();
          }
          break;
        case "ctrl+right":
        case "cmd+right":
          next({ count: 1, userSkipped: true });
          break;
      }
    },
    [player],
  );
}
