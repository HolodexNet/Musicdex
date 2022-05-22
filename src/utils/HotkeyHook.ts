import { useHotkeys } from "react-hotkeys-hook";
import { useStoreState, useStoreActions } from "../store";
import { useSongQueuer } from "./SongQueuerHook";

type ActionProps = "playPlaylist" | "copyLink";

export function useKeyControl(
  {
    actions,
    playlist,
  }: {
    actions: ActionProps[];
    playlist?: PlaylistFull;
  },
  deps?: any[]
) {
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );
  const currentPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );

  return useHotkeys(
    "space",
    (e, handler) => {
      e.preventDefault();
      console.log(currentPlaying);
      switch (handler.key) {
        case "space":
          if (
            actions.includes("playPlaylist") &&
            playlist &&
            !currentPlaying.song
          ) {
            setPlaylist({ playlist: playlist });
          }
          break;

        default:
          break;
      }
    },
    [...(deps ? deps : []), currentPlaying]
  );
}
