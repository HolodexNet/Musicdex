import "setimmediate";
import { Dictionary } from "lodash";
import uniq from "lodash-es/uniq";
import zipObject from "lodash-es/zipObject";
import { useMemo } from "react";
import Dataloader, { BatchLoadFn } from "dataloader";

import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useQueries,
  QueryFunctionContext,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import { useStoreState } from "../../store";

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
        // queryClient.cancelQueries(["likedSongs"]);
        // queryClient.invalidateQueries(["likedSongs"]);
        queryClient.invalidateQueries([BULKLIKE_, payload.song_id]);
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
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
  const { AxiosInstance, uid } = useClient();

  const result = useQuery(
    ["likedSongList", uid, String(page || 1)],
    async (q): Promise<PaginatedSongs> => {
      const songs = (
        await AxiosInstance<PaginatedSongs>(
          `/musicdex/like?page=${Number.parseInt(q.queryKey[2]) ?? 1}`
        )
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

const BULKLIKE_ = "BLK:";
let dataloader: Dataloader<string, boolean, unknown> | undefined = undefined;
export function useSongLikeCheck_Loader():
  | Dataloader<string, boolean, unknown>
  | undefined {
  const { AxiosInstance, isLoggedIn } = useClient();

  if (!dataloader && isLoggedIn) {
    const fetchDataPromise: BatchLoadFn<string, boolean> = async (
      ids: readonly string[]
    ) => {
      const out = Array.from(new Set(ids));
      const resp = await AxiosInstance<boolean[]>(
        `/musicdex/like/check?song_id=${out.join(",")}`
      );
      const obj = zipObject(out, resp.data);
      return ids.map((x) => obj[x]);
    };
    dataloader = new Dataloader<string, boolean>(fetchDataPromise, {
      cache: false, // <-- IMPORTANT, dataloader doesn't have the same cache management as react-query
    });
  }

  return dataloader;
}

export function useSongLikeBulkCheck(songId: string) {
  const loader = useSongLikeCheck_Loader();
  const user = useStoreState((state) => state.auth.user);
  const result = useQuery(
    [BULKLIKE_, songId, user?.id ?? "na"],
    () => {
      if (loader) return loader.load(songId);
      else throw new Error("not logged in");
    },
    { ...DEFAULT_FETCH_CONFIG }
  );
  return result;
}
