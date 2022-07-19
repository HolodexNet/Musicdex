import axios from "axios";
import { useInfiniteQuery, useQuery } from "react-query";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export function useDiscoveryOrg(org: string) {
  return useQuery(
    ["discoveryOrg", org],
    async (qk) => {
      return (
        await axios.get(
          "/api/v2/musicdex/discovery/org/" + qk.queryKey[1] + "/"
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    }
  );
}

export function useDiscoveryChannel(channelId: string) {
  return useQuery(
    ["discoveryChannel", channelId],
    async (qk) => {
      return (
        await axios.get(
          "/api/v2/musicdex/discovery/channel/" + qk.queryKey[1] + "/"
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    }
  );
}

/**
 *
 * @param org which org (name) to lookup
 * @param type sgp | ugp | radio
 * @returns
 */
export function useAllPlaylistDiscovery(org: string, type: string) {
  return useInfiniteQuery<PlaylistStub[]>(
    ["discoveryPlaylistsAll", org, type],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await axios.get(`/api/v2/musicdex/discovery/org/${org}/playlists`, {
          params: {
            type,
            offset: 100 * pageParam,
          },
        })
      ).data?.items;
      return list;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length + 1 : null,
      keepPreviousData: true,
      retry: 1,
      cacheTime: 1000 * 60 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      refetchOnReconnect: false,
    }
  );
}
