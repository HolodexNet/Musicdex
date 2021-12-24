import { createStore, createTypedHooks, persist } from "easy-peasy";
import authModel, { AuthModel } from "./auth";
import { contextMenusAtom, ContextMenuStore } from "./contextMenu";
import orgModel, { OrgModel } from "./org";
import playbackModel, { PlaybackModel } from "./playback";
import playerModel, { PlayerModel } from "./player";

export interface StoreModel {
  auth: AuthModel;
  player: PlayerModel;
  playback: PlaybackModel;
  org: OrgModel;
  contextMenu: ContextMenuStore;
}

const storeModel: StoreModel = {
  auth: authModel,
  player: playerModel,
  playback: playbackModel,
  org: orgModel,
  contextMenu: contextMenusAtom,
};

export default storeModel;

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const store = createStore(
  persist(storeModel, { storage: "localStorage", deny: ["contextMenu"] })
);
