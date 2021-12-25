import { useStoreState } from "../../store";
import { PlayerBar } from "./PlayerBar";
import { PlayerOverlay } from "./PlayerOverlay";

export function Player() {
  return (
    <div>
      <PlayerBar />
      <PlayerOverlay />
    </div>
  );
}
