import { Action, action } from "easy-peasy";

type MousePosition = {
  x: number;
  y: number;
};

export interface IContextMenu {
  id: string;
  isOpen: boolean;
}

export type IContextMenus = {
  // where should the menu be shown
  position: MousePosition;
  // what menu should be shown?
  menus: IContextMenu[];
  // pass data from the trigger to the menu list
  passData?: any;
};

export interface ContextMenuStore {
  menu: IContextMenus;
  setMenu: Action<ContextMenuStore, IContextMenus>;

  //leveraging context menu for drag drop
  dragging: boolean;
  setDragging: Action<ContextMenuStore, boolean>;
}

// Context Menus
export const contextMenusAtom: ContextMenuStore = {
  menu: {
    position: {
      x: -10000,
      y: -10000,
    },
    menus: [],
    passData: undefined,
  },
  setMenu: action((state, menu) => {
    state.menu = menu;
  }),

  dragging: false,
  setDragging: action((state, y) => {
    state.dragging = y;
  }),
};

// const typedHooks = createTypedHooks<ContextMenuStore>();
// export const useContextMenuStoreActions = typedHooks.useStoreActions;
// export const useContextMenuStoreState = typedHooks.useStoreState;

// export const ContextMenuStore = createContextStore(contextMenusAtom);
