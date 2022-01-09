import { Action, action } from "easy-peasy";

export interface ContextMenuStore {
  //leveraging context menu for drag drop
  dragging: boolean;
  setDragging: Action<ContextMenuStore, boolean>;
}

// Context Menus
export const contextMenusAtom: ContextMenuStore = {
  dragging: false,
  setDragging: action((state, y) => {
    state.dragging = y;
  }),
};

// const typedHooks = createTypedHooks<ContextMenuStore>();
// export const useContextMenuStoreActions = typedHooks.useStoreActions;
// export const useContextMenuStoreState = typedHooks.useStoreState;

// export const ContextMenuStore = createContextStore(contextMenusAtom);
