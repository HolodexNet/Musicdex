import { action, Action, computed, Computed } from "easy-peasy";

export interface PlayerModel {
  target: string | null;

  isAvailable: Computed<PlayerModel, boolean>;

  setTarget: Action<PlayerModel, string | null>;
}

const playerModel: PlayerModel = {
  target: null,

  isAvailable: computed((state) => state.target != null),

  setTarget: action((state, target) => {
    state.target = target;
  }),
};

export default playerModel;
