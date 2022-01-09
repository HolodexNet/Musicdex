import { createStore, createTypedHooks, persist } from "easy-peasy";
import addPlaylistModel, { AddPlaylistModel } from "./addPlaylist";
import authModel, { AuthModel } from "./auth";
import { contextMenusAtom, ContextMenuStore } from "./contextMenu";
import orgModel, { OrgModel } from "./org";
import playbackModel, { PlaybackModel } from "./playback";
import playerModel, { PlayerModel } from "./player";

interface StoreModel {
  auth: AuthModel;
  player: PlayerModel;
  playback: PlaybackModel;
  org: OrgModel;
  contextMenu: ContextMenuStore;
  addPlaylist: AddPlaylistModel;
}

const storeModel: StoreModel = {
  auth: authModel,
  player: playerModel,
  playback: playbackModel,
  org: orgModel,
  contextMenu: contextMenusAtom,
  addPlaylist: addPlaylistModel,
};

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

const storeM = createStore(
  persist(storeModel, { storage: "localStorage", deny: ["contextMenu"] })
);

if (process.env.NODE_ENV === "development") {
  if ((module as any).hot) {
    (module as any).hot.accept("./index", () => {
      storeM.reconfigure(storeModel); // 👈 Here is the magic
    });
  }
}

export const store = storeM;
