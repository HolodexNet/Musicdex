import { Action, action } from "easy-peasy";

export interface DnDStore {
  //leveraging context menu for drag drop
  dragging: boolean;
  setDragging: Action<DnDStore, boolean>;
}

// DND State Management
export const dndAtom: DnDStore = {
  dragging: false,
  setDragging: action((state, y) => {
    state.dragging = y;
  }),
};
