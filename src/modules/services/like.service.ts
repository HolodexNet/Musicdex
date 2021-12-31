import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export const useSongLikeUpdater = (
  callbacks: UseMutationOptions<
    any,
    unknown,
    { song_id: string; action: "add" | "delete" }
  > = {}
) => {
  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (payload) =>
      (
        await AxiosInstance("/musicdex/like", {
          method: payload.action === "delete" ? "DELETE" : "POST",
          data: { song_id: payload.song_id },
        })
      ).data,
    {
      ...callbacks,
      onSuccess: (data, payload, ...rest) => {
        queryClient.cancelQueries(["likedSongList"]);
        queryClient.invalidateQueries(["likedSongList"]);
        queryClient.invalidateQueries([`likeSongStatus-${payload.song_id}`]);
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};

export const useLikeSongChecker = (songId: string[], enabled: boolean) => {
  // const queryClient = useQueryClient();
  const { AxiosInstance } = useClient();
  const result = useQuery(
    [`likeSongStatus-${songId}`],
    async (q): Promise<boolean[]> => {
      // queryClient.getQueryData([`likeSongStatus-${songId}`]);
      const req = await AxiosInstance<boolean[]>(
        `/musicdex/like/check?song_id=${songId}`
      );
      return req.data;
    },
    {
      cacheTime: 24000,
      staleTime: 24000,
      enabled,
    }
  );
  return result;
};

export const useLikedSongs = (
  offset?: number,
  config: UseQueryOptions<Song[], unknown, Song[], string[]> = {}
) => {
  // const queryClient = useQueryClient();
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["likedSongList"],
    async (q): Promise<Song[]> => {
      // fetch cached
      // const cached: Song[] | undefined = queryClient.getQueryData(["likedSongList"]);
      // if (cached) {
      //   try {
      //     const newdata = await AxiosInstance<PlaylistFull>(
      //       `/musicdex/playlist/${q.queryKey[1]}`,
      //       {
      //         headers: {
      //           "If-Modified-Since":
      //             cached.updated_at?.toString() ?? cached.updated_at,
      //         },
      //       }
      //     ); // try fetching with If-Modified-Since, Server returns 304 if not modified.
      //     if (!newdata.data?.id) return cached;
      //     else return newdata.data;
      //   } catch (e) {
      //     return cached;
      //   }
      // }
      // cache miss:
      return (
        await AxiosInstance<Song[]>(`/musicdex/like?offset=${offset ?? 0}`)
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...config,
    }
  );

  return result;
};
