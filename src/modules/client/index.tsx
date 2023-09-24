import { useInterval, useToast } from "@chakra-ui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";
import open from "oauth-open";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleCredentialResponse } from "../../components/login/GoogleButton";

export interface OAuth2SuccessResponse {
  token_type: "Bearer";
  access_token: string;
  expires_in: string;
  scope: "identify";
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export interface User {
  api_key: string;
  contribution_count: string;
  created_at: string;
  discord_id: string | null;
  google_id: string | null;
  twitter_id: string | null;
  id: string;
  role: "admin" | "editor" | "user";
  username: string;
  yt_channel_key: string | null;
  jwt?: string;
}

const BASE_URL = `${window.location.protocol}//${window.location.host}/api/v2`;

const axiosInstance = axios.create();

export function useClient() {
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);
  const user = useStoreState((state) => state.auth.user);
  const authHeader = useStoreState((state) => state.auth.authHeader);
  const token = useStoreState((state) => state.auth.token);

  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const toast = useToast();

  const AxiosInstance = useCallback(
    function <T>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
      const configWithUser: AxiosRequestConfig = {
        baseURL: BASE_URL,
        ...config,
        headers: {
          ...config?.headers,
          ...authHeader,
        },
      };
      return axiosInstance(url, configWithUser);
    },
    [authHeader],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await AxiosInstance<{ user: User; jwt: string }>(
        "/user/refresh",
      );
      if (resp.status === 200 && resp.data) {
        setUser(resp.data.user);
        setToken(resp.data.jwt);
        console.log("[Auth] Token refreshed");
        return resp.data;
      } else {
        console.log("[Auth] Api error when refreshing token", resp);
        throw new Error("Strange bug occured with user checking...");
      }
    } catch (e) {
      console.error("[Auth] Failed to refresh token", e);
      logout();
      toast({
        position: "top-right",
        title: "Error while logging in",
        status: "error",
      });
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, setUser, toast, setToken]);

  return {
    isLoggedIn,
    user,
    AxiosInstance,
    // login,
    refreshUser,
    logout,
    uid: user?.id ?? "na",
    token,
  };
}

export function useClientLogin() {
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const user = useStoreState((state) => state.auth.user);
  const navigate = useNavigate();
  const toast = useToast();

  const location = useLocation();

  const onFailure = useCallback(
    (err: any) => {
      console.log("[Auth] Login error", err);
      toast({
        position: "top-right",
        title: "Error while logging in",
        status: "error",
      });
      setUser(null);
      setToken(null);
    },
    [setToken, setUser, toast],
  );

  async function onGoogleSuccess({ credential }: GoogleCredentialResponse) {
    try {
      const token = await getToken({
        authToken: credential,
        service: "google",
        // jwt: currentToken || undefined,
      });
      const { jwt, user } = token;
      setToken(jwt);
      setUser(user);
      navigate("/settings");
    } catch (e) {
      onFailure(e);
    }
  }

  async function onDiscordSuccess(
    err: any,
    { access_token }: { access_token: string },
  ) {
    if (err) return onFailure(err);
    try {
      const token = await getToken({
        authToken: access_token,
        service: "discord",
        // jwt: currentToken || undefined,
      });
      const { jwt, user } = token;
      setToken(jwt);
      setUser(user);
      navigate("/settings");
    } catch (e) {
      onFailure(e);
    }
  }

  const onTwitterSuccess = useCallback(
    async (err: any, out: { jwt: string }) => {
      if (err) return onFailure(err);
      try {
        const twitterTempJWT = out.jwt;
        const token = await getToken({
          authToken: twitterTempJWT,
          service: "twitter",
        });
        const { jwt, user } = token;
        setToken(jwt);
        setUser(user);
        navigate("/settings");
      } catch (e) {
        onFailure(e);
      }
    },
    [navigate, onFailure, setToken, setUser],
  );

  // User got bounced from twitter login callbar, parse token and try logging in
  useEffect(() => {
    if (location.pathname === "/login") {
      const params = new URL(window.location.href).searchParams;
      const service = params.get("service");
      const jwt = params.get("jwt");
      if (service === "twitter" && jwt) {
        onTwitterSuccess(null, { jwt });
      }
    }
  }, [location, onTwitterSuccess]);

  return {
    DiscordOAuth: user?.discord_id
      ? undefined
      : () =>
          open(
            `https://discord.com/api/oauth2/authorize?client_id=793619250115379262&redirect_uri=${encodeURIComponent(
              `${window.location.protocol}//${window.location.host}/discord`,
            )}&response_type=token&scope=identify`,
            onDiscordSuccess,
          ),
    TwitterAuth: user?.twitter_id
      ? undefined
      : () => {
          let locationX = "https://music-staging.holodex.net";

          switch (window.location.host) {
            case "music-staging.holodex.net":
              locationX = "https://staging.holodex.net";
              break;
            case "music.holodex.net":
              locationX = "https://holodex.net";
              break;
            default:
              locationX = "http://localhost:2434";
              break;
          }
          window.location.href =
            locationX + `/api/v2/user/login/twitter/musicdex`;
        },
    GoogleAuthFn: user?.google_id ? undefined : onGoogleSuccess,
  };
}

export async function getToken({
  authToken,
  service,
  jwt,
}: {
  authToken: string;
  service: string;
  jwt?: string;
}): Promise<LoginResponse> {
  const headers = {
    "content-type": "application/json",
    ...(jwt && { Authorization: `Bearer ${jwt}` }),
  };
  const body = {
    token: authToken,
    service,
  };
  const res = await fetch(`/api/v2/user/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw Error("Failed to acquire token");
  return res.json();
}

const getTokenExp = (token: string) =>
  JSON.parse(atob(token.split(".")[1])).exp * 1000;

export function useCookieTokenFallback() {
  const token = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const setLastCookieToken = useStoreActions(
    (actions) => actions.auth.setLastCookieToken,
  );
  const lastCookieToken = useStoreState((state) => state.auth.lastCookieToken);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);

  useEffect(() => {
    const match = document.cookie.match(/HOLODEX_JWT=([^;]+)/);
    if ((!token || !user) && match?.[1] && match?.[1] !== lastCookieToken) {
      const token = match?.[1];
      console.log("[Auth] Falling back on token found in cookie");
      // Only allow this token to be attempted once
      setLastCookieToken(token);

      if (Date.now() > getTokenExp(token)) {
        console.log("[Auth] Expired token found in cookie");
        return;
      }
      // immediately validate token
      (async () => {
        const resp = await axios("/user/check", {
          baseURL: BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.status === 200 && resp.data) {
          setUser(resp.data as User);
          setToken(token);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useTokenRefresh() {
  const { token, refreshUser } = useClient();

  // Refresh token when it is close to expiration on load
  useEffect(() => {
    if (token)
      console.log(
        `[Auth] Found token expiring in ${getTokenExp(token) / 1000}s`,
      );
    if (token && Date.now() - 10 * 60 * 1000 > getTokenExp(token)) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set timer to refresh token every 30 minutes
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(() => {
      // const exp = getTokenExp(token);
      refreshUser();
    }, 30 * 60 * 1000);
    return clearInterval(timer);
  }, [refreshUser, token]);
}
