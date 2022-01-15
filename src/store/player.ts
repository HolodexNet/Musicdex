import { action, Action, computed, Computed } from "easy-peasy";

export type PlayerPosition =
  | "hover-top"
  | "hover-bottom"
  | "background"
  | "sidebar"
  | "full-player"
  | "hidden";

export interface PlayerModel {
  position: PlayerPosition;
  setPosition: Action<PlayerModel, PlayerPosition>;

  // target: string | null;

  // isAvailable: Computed<PlayerModel, boolean>;

  // setTarget: Action<PlayerModel, string | null>;
  // toggledExpanded: Action<PlayerModel>;
  // isExpanded: boolean;
}

const playerModel: PlayerModel = {
  position: "hover-top",
  setPosition: action((state, newloc) => {
    state.position = newloc;
  }),

  // target: null,

  // isExpanded: false,

  // isAvailable: computed((state) => state.target != null),

  // setTarget: action((state, target) => {
  //   state.target = target;
  // }),

  // toggledExpanded: action((state) => {
  //   state.isExpanded = !state.isExpanded;
  // }),
};

export default playerModel;
