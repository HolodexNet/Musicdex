import { action, Action, computed, Computed } from "easy-peasy";
import { SelectedPosition } from "./settings";

type PlayerPosition = SelectedPosition | "full-player";
export interface PlayerModel {
  showUpcomingOverlay: boolean;
  setShowUpcomingOverlay: Action<PlayerModel, boolean>;
  overridePosition: PlayerPosition | undefined;
  setOverridePosition: Action<PlayerModel, PlayerPosition | undefined>;
}

const playerModel: PlayerModel = {
  showUpcomingOverlay: false,
  setShowUpcomingOverlay: action((state, val) => {
    state.showUpcomingOverlay = val;
  }),

  overridePosition: undefined,
  setOverridePosition: action((state, val) => {
    state.overridePosition = val;
  }),
};

export default playerModel;
