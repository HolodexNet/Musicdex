import axios from "axios";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export function useDiscoveryOrg(org: string) {
  return useQuery(
    ["discoveryOrg", org],
    async (qk) => {
      return (
        await axios.get<OrgDiscovery>(
          "/api/v2/musicdex/discovery/org/" + qk.queryKey[1] + "/",
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    },
  );
}

export function useDiscoveryFavorites() {
  const { AxiosInstance, uid } = useClient();

  return useQuery(
    ["discoveryFavorites", uid],
    async () =>
      (await AxiosInstance<OrgDiscovery>("/musicdex/discovery/favorites")).data,
  );
}

export function useDiscoveryChannel(channelId: string) {
  return useQuery(
    ["discoveryChannel", channelId],
    async (qk) => {
      return (
        await axios.get<ChannelDiscovery>(
          "/api/v2/musicdex/discovery/channel/" + qk.queryKey[1] + "/",
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    },
  );
}

/**
 *
 * @param org which org (name) to lookup
 * @param type sgp | ugp | radio
 * @returns
 */
export function useAllPlaylistDiscoveryForOrg(
  org: string,
  type: string,
  options: UseInfiniteQueryOptions<PlaylistStub[]> = {},
) {
  return useInfiniteQuery<PlaylistStub[]>(
    ["discoveryPlaylistsAll", org, type],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await axios.get<PlaylistList>(
          `/api/v2/musicdex/discovery/org/${org}/playlists`,
          {
            params: {
              type,
              offset: 100 * pageParam,
            },
          },
        )
      ).data.items;
      return list;
    },
    {
      ...options,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length + 1 : null,
      keepPreviousData: options.keepPreviousData ?? true,
      retry: options.retry ?? 1,
      cacheTime: options.cacheTime ?? 1000 * 60 * 60 * 5,
      refetchOnMount: options.retryOnMount ?? false,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      staleTime: options.staleTime ?? 1000 * 60 * 60 * 5,
      refetchOnReconnect: options.refetchOnReconnect ?? false,
    },
  );
}

/**
 *
 * @param org which org (name) to lookup
 * @param type sgp | ugp | radio
 * @returns
 */
export function useAllPlaylistDiscoveryForFavorites(
  type: string,
  options: UseInfiniteQueryOptions<PlaylistStub[]> = {},
) {
  const { AxiosInstance, isLoggedIn } = useClient();

  return useInfiniteQuery<PlaylistStub[]>(
    ["discoveryPlaylistsAll", "favorites", type],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await AxiosInstance<PlaylistList>(
          `/musicdex/discovery/favorites/playlists`,
          {
            params: {
              type,
              offset: 100 * pageParam,
            },
          },
        )
      ).data.items;
      return list;
    },
    {
      ...options,
      enabled: isLoggedIn && options.enabled,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length + 1 : null,
      keepPreviousData: options.keepPreviousData ?? true,
      retry: options.retry ?? 1,
      cacheTime: options.cacheTime ?? 1000 * 60 * 60 * 5,
      refetchOnMount: options.retryOnMount ?? false,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      staleTime: options.staleTime ?? 1000 * 60 * 60 * 5,
      refetchOnReconnect: options.refetchOnReconnect ?? false,
    },
  );
}
