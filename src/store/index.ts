import { createTypedHooks } from "easy-peasy";
import authModel, { AuthModel } from "./auth";
import playbackModel, { PlaybackModel } from "./playback";
import playerModel, { PlayerModel } from "./player";

export interface StoreModel {
  auth: AuthModel;
  player: PlayerModel;
  playback: PlaybackModel;
}

const storeModel: StoreModel = {
  auth: authModel,
  player: playerModel,
  playback: playbackModel,
};

export default storeModel;

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
