import axios from "axios";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
} from "react-query";

/**
 *
 * @param org which org (name) to lookup
 * @param page page number, start with 0
 * @returns
 */
export function useChannelListForOrg(
  org: string,
  options?: UseInfiniteQueryOptions<Channel[]>,
) {
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
        lastPage.length === 100 ? pages.length : null,
      keepPreviousData: true,
      retry: 1,
      cacheTime: 1000 * 60 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      refetchOnReconnect: false,
      ...options,
    },
  );
}
// export function useChannelSearch(partial: string) {
//   return useQuery<Pick<Channel, 'id' | 'name' | 'english_name'>[]>(
//     ["chPartial", partial],
//     async () => {
//       return (await axios.post("/api/v2/search/channelSearch", {
//         params: {
//           type: "vtuber",
//           queryText: partial,
//         },
//       })).data;
//     },
//     {
//       cacheTime: 1000 * 60 * 60 * 5,
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//       staleTime: 1000 * 60 * 60 * 5,
//       refetchOnReconnect: false,
//     }
//   );
// }
// export function useChannel(id?: string) {
//   return useQuery<Channel | undefined>(
//     ["channel", id],
//     async () => {
//       if (id)
//         return (await axios.get("/api/v2/channels/" + id)).data;
//       else return undefined;
//     },
//     {
//       cacheTime: 1000 * 60 * 60 * 5,
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//       staleTime: 1000 * 60 * 60 * 5,
//       refetchOnReconnect: false,
//     }
//   );
// }
