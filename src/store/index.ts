import { createTypedHooks } from "easy-peasy";
import authModel, { AuthModel } from "./auth";
import playerModel, { PlayerModel } from "./player";

export interface StoreModel {
  auth: AuthModel;
  player: PlayerModel;
}

const storeModel: StoreModel = {
  auth: authModel,
  player: playerModel,
};

export default storeModel;

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
