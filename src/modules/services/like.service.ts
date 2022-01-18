import { Dictionary } from "lodash";
import uniq from "lodash-es/uniq";
import zipObject from "lodash-es/zipObject";
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
        queryClient.invalidateQueries(["playlist-like"]);
        queryClient.cancelQueries(["likedSongs"]);
        queryClient.invalidateQueries(["likedSongs"]);
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};

export const useLikedCheckSongs = (songIds: string[], enabled?: boolean) => {
  // const queryClient = useQueryClient();
  const { AxiosInstance, isLoggedIn } = useClient();
  const uSongIds = uniq(songIds);
  const result = useQuery(
    ["likedSongs", uSongIds],
    async (q): Promise<Dictionary<boolean>> => {
      // console.log("fetching like status");
      if (!isLoggedIn || !uSongIds.length) {
        return {};
      }
      const req = await AxiosInstance<boolean[]>(
        `/musicdex/like/check?song_id=${uSongIds.join(",")}`
      );
      return zipObject(uSongIds, req.data);
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 60 * 1000 * 60,
      staleTime: 60 * 1000 * 60,
      enabled,
    }
  );
  return result;
};

export const useLikedCheckPlaylist = (playlistId: string) => {
  const { AxiosInstance, isLoggedIn } = useClient();
  const results = useQuery<boolean[], unknown, boolean[], string[]>(
    ["playlist-like", playlistId],
    async (q): Promise<boolean[]> => {
      if (!isLoggedIn) {
        return [];
      }
      // fetch cached
      // const cached: boolean[] | undefined = queryClient.getQueryData([
      //   "playlist-like",
      //   playlistId,
      // ]);

      // if (cached) {
      //   return cached;
      // }
      // cache miss:
      return (
        await AxiosInstance<boolean[]>(
          `/musicdex/playlist/${q.queryKey[1]}/likeCheck`
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
    }
  );
  return results;
};

export const useLikedSongs = (
  page?: number,
  config: UseQueryOptions<
    PaginatedSongs,
    unknown,
    PaginatedSongs,
    string[]
  > = {}
) => {
  // const queryClient = useQueryClient();
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["likedSongList"],
    async (q): Promise<PaginatedSongs> => {
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
      const songs = (
        await AxiosInstance<PaginatedSongs>(`/musicdex/like?page=${page ?? 1}`)
      ).data;
      songs?.content?.forEach((x) => (x.liked = true));
      return songs;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...config,
    }
  );

  return result;
};

// This might not trigger a hook update, since editing nested object :akisweat:
export function mergeSongsWithLikeCheck(songs: Song[], likeStatus: boolean[]) {
  if (songs.length !== likeStatus.length) {
    console.warn("Like status and songs did not match");
    return;
  }
  songs.forEach((x, index) => (x.liked = likeStatus[index]));
}
