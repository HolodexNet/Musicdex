import "setimmediate";
import { AxiosError } from "axios";
import zipObject from "lodash-es/zipObject";
import Dataloader, { BatchLoadFn } from "dataloader";

import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import { useStoreState } from "../../store";

export const LIKE_QUERY_CONFIG = {
  ...DEFAULT_FETCH_CONFIG,
  refetchOnMount: false,
  keepPreviousData: true,
  staleTime: 1000 * 60 * 30, // 30 minute staleness.
};

type SongLikeUpdaterParams = UseMutationOptions<
  "OK",
  AxiosError,
  { song_id: string; action: "add" | "delete" }
>;

export const useSongLikeUpdater = (callbacks: SongLikeUpdaterParams = {}) => {
  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();
  const user = useStoreState((state) => state.auth.user);

  return useMutation(
    async (payload) =>
      (
        await AxiosInstance<"OK">("/musicdex/like", {
          method: payload.action === "delete" ? "DELETE" : "POST",
          data: { song_id: payload.song_id },
        })
      ).data,
    {
      ...callbacks,
      onMutate: (payload, ...rest) => {
        const queryKey = [LIKED_QUERY_KEY, payload.song_id, user?.id ?? "na"];
        const previousValue = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (old) => !old);

        return callbacks.onMutate?.(payload, ...rest) ?? previousValue;
      },
      onError: (error, payload, previousValue, ...rest) => {
        queryClient.setQueryData(["todos"], previousValue);
        callbacks.onError?.(error, payload, previousValue, ...rest);
      },
      onSettled: (data, error, payload, ...rest) => {
        queryClient.cancelQueries(["likedSongList"]);
        queryClient.invalidateQueries(["likedSongList"]);
        queryClient.invalidateQueries([LIKED_QUERY_KEY, payload.song_id]);
        callbacks.onSettled?.(data, error, payload, ...rest);
      },
    },
  );
};

type useLikedSongsConfig = UseQueryOptions<
  PaginatedSongs,
  unknown,
  PaginatedSongs,
  string[]
>;

export const useLikedSongs = (
  page?: number,
  config: useLikedSongsConfig = {},
) => {
  const { AxiosInstance, uid } = useClient();

  const result = useQuery(
    ["likedSongList", uid, String(page || 1)],
    async (q): Promise<PaginatedSongs> => {
      const songs = (
        await AxiosInstance<PaginatedSongs>(
          `/musicdex/like?page=${Number.parseInt(q.queryKey[2]) ?? 1}`,
        )
      ).data;
      songs?.content?.forEach((x) => (x.liked = true));
      return songs;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...config,
    },
  );

  return result;
};

export const LIKED_QUERY_KEY = "BLK:";
let dataloader: Dataloader<string, boolean, unknown> | undefined = undefined;
let dataLoaderToken: string | null = null;

export function useSongLikeCheck_Loader():
  | Dataloader<string, boolean, unknown>
  | undefined {
  const { AxiosInstance, isLoggedIn, token } = useClient();
  if (!isLoggedIn) {
    dataloader = undefined;
    dataLoaderToken = null;
    return;
  }

  if (token !== dataLoaderToken || !dataloader) {
    const fetchDataPromise: BatchLoadFn<string, boolean> = async (
      ids: readonly string[],
    ) => {
      const out = Array.from(new Set(ids));
      const resp = await AxiosInstance<boolean[]>(
        `/musicdex/like/check?song_id=${out.join(",")}`,
      );
      const obj = zipObject(out, resp.data);
      return ids.map((x) => obj[x]);
    };

    dataloader = new Dataloader<string, boolean>(fetchDataPromise, {
      batchScheduleFn: (callback) => setTimeout(callback, 500),
      cache: false, // <-- IMPORTANT, dataloader doesn't have the same cache management as react-query
    });

    // Bind to this token, in case it gets refreshed or logged out
    dataLoaderToken = token;
  }

  return dataloader;
}

export function useSongLikeBulkCheck(songId: string) {
  const loader = useSongLikeCheck_Loader();
  const user = useStoreState((state) => state.auth.user);
  const result = useQuery(
    [LIKED_QUERY_KEY, songId, user?.id ?? "na"],
    () => (loader ? loader.load(songId) : false),
    LIKE_QUERY_CONFIG,
  );
  return result;
}
