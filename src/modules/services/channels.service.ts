import axios from "axios";
import { useInfiniteQuery } from "react-query";

/**
 *
 * @param org which org (name) to lookup
 * @param page page number, start with 0
 * @returns
 */
export function useChannelListForOrg(org: string) {
  return useInfiniteQuery<Channel[]>(
    ["channels", org],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await axios.get("/api/v2/channels", {
          params: {
            type: "vtuber",
            org,
            limit: 100,
            offset: 100 * pageParam,
            sort: "suborg",
          },
        })
      ).data;
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
