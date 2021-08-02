import cFetch from "cross-fetch";
import { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../store";

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

export function useAuth() {
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);
  const user = useStoreState((state) => state.auth.user);
  const token = useStoreState((state) => state.auth.token);

  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);

  const fetch = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const newInit = {
        ...init,
        headers: {
          ...init?.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };
      const res = await cFetch(input, newInit);
      return res.json();
    },
    [token]
  );

  function login() {
    if (isLoggedIn) return;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return {
    isLoggedIn,
    user,
    fetch,
    login,
    logout,
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
