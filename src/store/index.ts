import { createTypedHooks } from "easy-peasy";
import authModel, { AuthModel } from "./auth";

export interface StoreModel {
  auth: AuthModel;
}

const storeModel: StoreModel = {
  auth: authModel,
};

export default storeModel;

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
