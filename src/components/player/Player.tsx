import { useStoreState } from "../../store";
import { PlayerBar } from "./PlayerBar";
import { PlayerOverlay } from "./PlayerOverlay";

export function Player() {
  const isExpanded = useStoreState((state) => state.player.isExpanded);
  return (
    <div>
      <PlayerBar />
      <PlayerOverlay visible={isExpanded}></PlayerOverlay>
    </div>
  );
}
