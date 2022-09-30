import { createStore, createTypedHooks, persist } from "easy-peasy";
import playlistModel, { PlaylistModel } from "./playlist";
import authModel, { AuthModel } from "./auth";
import { dndAtom, DnDStore } from "./dragAndDrop";
import orgModel, { OrgModel } from "./org";
import playbackModel, { PlaybackModel } from "./playback";
import playerModel, { PlayerModel } from "./player";
import { settingsStore, SettingsStore } from "./settings";

export interface StoreModel {
  auth: AuthModel;
  player: PlayerModel;
  playback: PlaybackModel;
  org: OrgModel;
  dnd: DnDStore;
  playlist: PlaylistModel;
  settings: SettingsStore;
}

const storeModel: StoreModel = {
  auth: authModel,
  player: playerModel,
  playback: playbackModel,
  org: orgModel,
  dnd: dndAtom,
  playlist: playlistModel,
  settings: settingsStore,
};

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

const storeM = createStore(
  persist(storeModel, { storage: "localStorage", deny: ["dnd", "player"] }),
  { devTools: import.meta.env.NODE_ENV === "development" },
);

if (import.meta.env.NODE_ENV === "development") {
  if (import.meta.hot) {
    import.meta.hot.accept("./index", () => {
      storeM.reconfigure(storeModel); // 👈 Here is the magic
    });
  }
}

export const store = storeM;
