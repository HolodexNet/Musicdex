import { ButtonProps, chakra, ChakraProps } from "@chakra-ui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode, useCallback } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import { useStoreActions, useStoreState } from "../../store";
import { useGoogleLogin } from "react-google-login";
import open from "oauth-open";
import { useNavigate } from "react-router-dom";

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

  async function refreshUser(): Promise<"OK" | null> {
    if (user) {
      const resp = await AxiosInstance("/user/check");
      if (resp.status === 200 && resp.data) setUser(resp.data as User);
      else throw new Error("Strange bug occured with user checking...");
      return "OK";
    }
    return null;
  }

  // function login() {
  //   if (isLoggedIn) return;
  // }

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
  };
}

const StyledOAuth2 = chakra(OAuth2Login);

export function useClientLogin() {
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const currentToken = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const navigate = useNavigate();

  function onFailure(err: any) {
    console.log("Error", err);
  }

  const { signIn, loaded } = useGoogleLogin({
    clientId:
      "275540829388-87s7f9v2ht3ih51ah0tjkqng8pd8bqo2.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/userinfo.email",
    prompt: "select_account",
    redirectUri: "http://localhost:3000",
    responseType: "code",
    uxMode: "redirect",

    fetchBasicProfile: false,
    async onSuccess(res) {
      if (!res.code) return;
      const token = await getToken({
        authToken: res.code,
        service: "google",
        jwt: currentToken || undefined,
      });
      const { jwt, user } = token;
      setToken(jwt);
      setUser(user);
      navigate("/settings");
      console.log(res);
    },
    onFailure: onFailure,
  });

  async function onDiscordSuccess(res: OAuth2SuccessResponse) {
    const token = await getToken({
      authToken: res.access_token,
      service: "discord",
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
      : ({
          children,
          ...props
        }: { children: ReactNode } & ChakraProps & ButtonProps) => (
          <StyledOAuth2
            authorizationUrl="https://discord.com/api/oauth2/authorize"
            responseType="token"
            clientId="793619250115379262"
            redirectUri={`${window.location.protocol}//${window.location.host}/discord`}
            scope="identify"
            onSuccess={onDiscordSuccess}
            onFailure={onFailure}
            {...props}
          >
            {children}
          </StyledOAuth2>
        ),
    TwitterAuth: user?.twitter_id
      ? undefined
      : () => {
          open(
            `/api/v2/user/login/twitter`,
            async (err: any, out: { jwt: string }) => {
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
          );
        },
    GoogleAuthFn: user?.google_id ? undefined : signIn,
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
  return res.json();
}
