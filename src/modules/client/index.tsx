import { chakra, useToast } from "@chakra-ui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";
import open from "oauth-open";
import { useNavigate } from "react-router-dom";
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

  const refreshUser = useCallback(async () => {
    if (token) {
      const resp = await AxiosInstance("/user/check");
      if (resp.status === 200 && resp.data) setUser(resp.data as User);
      else {
        logout();
        throw new Error("Strange bug occured with user checking...");
      }
      return "OK";
    }
    return null;
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
  }

  return {
    isLoggedIn,
    user,
    AxiosInstance,
    // login,
    refreshUser,
    logout,
    uid: user?.id ?? "na",
  };
}

export function useClientLogin() {
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const currentToken = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const navigate = useNavigate();
  const toast = useToast();

  function onFailure(err: any) {
    console.log("Error", err);
    toast({
      position: "top-right",
      title: "Error while logging in",
      status: "error",
    });
  }

  async function onGoogleSuccess({ credential }: GoogleCredentialResponse) {
    try {
      const token = await getToken({
        authToken: credential,
        service: "google",
        jwt: currentToken || undefined,
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
        jwt: currentToken || undefined,
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
      jwt: currentToken || undefined,
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
      : () => open(`/api/v2/user/login/twitter`, onTwitterSuccess),
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
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const token = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const { refreshUser } = useClient();
  useEffect(() => {
    const match = document.cookie.match(/HOLODEX_JWT=([^;]+)/);
    if ((!token || !user) && match?.[1]) {
      console.log("Falling back on token found in cookie");
      setToken(match[1]);
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUser, setToken]);
}
