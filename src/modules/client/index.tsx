import { useToast } from "@chakra-ui/react";
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
  role: "user";
  username: string;
  yt_channel_key: string | null;
}

const BASE_URL = `${window.location.protocol}//${window.location.host}/api/v2`;

export function useClient() {
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);
  const user = useStoreState((state) => state.auth.user);
  const token = useStoreState((state) => state.auth.token);

  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const toast = useToast();

  const AxiosInstance = useCallback(
    function <T>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const configWithUser: AxiosRequestConfig = {
        baseURL: BASE_URL,
        ...config,
        headers: {
          ...config?.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      return axios(url, configWithUser);
    },
    [token]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await AxiosInstance("/user/check");
      if (resp.status === 200 && resp.data) setUser(resp.data as User);
      else throw new Error("Strange bug occured with user checking...");
    } catch (e) {
      logout();
      toast({
        position: "top-right",
        title: "Error while logging in",
        status: "error",
      });
    }
    return "OK";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, setUser, toast]);

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

  function onFailure(err: any) {
    console.log("Error", err);
    toast({
      position: "top-right",
      title: "Error while logging in",
      status: "error",
    });
    setUser(null);
    setToken(null);
  }

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
    { access_token }: { access_token: string }
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

  async function onTwitterSuccess(err: any, out: { jwt: string }) {
    if (err) return onFailure(err);
    const twitterTempJWT = out.jwt;
    const token = await getToken({
      authToken: twitterTempJWT,
      service: "twitter",
      // jwt: currentToken || undefined,
    });
    const { jwt, user } = token;
    setToken(jwt);
    setUser(user);
    navigate("/settings");
  }

  return {
    DiscordOAuth: user?.discord_id
      ? undefined
      : () =>
          open(
            `https://discord.com/api/oauth2/authorize?client_id=793619250115379262&redirect_uri=${encodeURIComponent(
              `${window.location.protocol}//${window.location.host}/discord`
            )}&response_type=token&scope=identify`,
            onDiscordSuccess
          ),
    TwitterAuth: user?.twitter_id
      ? undefined
      : () => (window.location.href = `/api/v2/user/login/twitter/musicdex`),
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

export function useCookieTokenFallback() {
  const token = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const setLastCookieToken = useStoreActions(
    (actions) => actions.auth.setLastCookieToken
  );
  const lastCookieToken = useStoreState((state) => state.auth.lastCookieToken);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const navigate = useNavigate();
  useEffect(() => {
    const match = document.cookie.match(/HOLODEX_JWT=([^;]+)/);
    if ((!token || !user) && match?.[1] && match?.[1] !== lastCookieToken) {
      const token = match?.[1];
      console.log("Falling back on token found in cookie");
      // Only allow this token to be attempted once
      setLastCookieToken(token);
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
