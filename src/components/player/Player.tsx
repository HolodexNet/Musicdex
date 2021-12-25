import { Fragment } from "react";
import { PlayerBar } from "./PlayerBar";
import { PlayerOverlay } from "./PlayerOverlay";

export function Player() {
  return (
    <Fragment>
      <PlayerBar />
      <PlayerOverlay />
    </Fragment>
  );
}
