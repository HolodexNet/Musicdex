import { action, Action, computed, Computed } from "easy-peasy";
import { User } from "../modules/client";

export interface AuthModel {
  token: string | null;
  // Store last cookie token to not reattempt
  lastCookieToken: string | null;
  user: User | null;

  isLoggedIn: Computed<AuthModel, boolean>;

  setToken: Action<AuthModel, string | null>;
  setLastCookieToken: Action<AuthModel, string | null>;
  setUser: Action<AuthModel, User | null>;
}

const authModel: AuthModel = {
  token: null,
  user: null,
  lastCookieToken: null,

  isLoggedIn: computed((state) => state.user != null),

  setToken: action((state, payload) => {
    state.token = payload;
  }),

  setLastCookieToken: action((state, payload) => {
    state.lastCookieToken = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
};

export default authModel;
