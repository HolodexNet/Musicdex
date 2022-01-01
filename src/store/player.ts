import { action, Action, computed, Computed } from "easy-peasy";

export interface PlayerModel {
  position: "hover-left" | "hover-right" | "background" | "sidebar";
  setPosition: Action<PlayerModel, typeof playerModel.position>;

  // target: string | null;

  // isAvailable: Computed<PlayerModel, boolean>;

  // setTarget: Action<PlayerModel, string | null>;
  // toggledExpanded: Action<PlayerModel>;
  // isExpanded: boolean;
}

const playerModel: PlayerModel = {
  position: "hover-right",
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
