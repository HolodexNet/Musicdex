import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export const usePlaylistWriter = (
  callbacks: UseMutationOptions<
    WriteablePlaylist,
    unknown,
    Partial<WriteablePlaylist>
  > = {}
) => {
  const { AxiosInstance } = useClient();

  return useMutation(
    async (payload) =>
      (
        await AxiosInstance<WriteablePlaylist>("/musicdex/playlist", {
          method: "POST",
          data: payload,
        })
      ).data,
    {
      ...callbacks,
    }
  );
};

export const usePlaylistUpdater = (
  config: UseMutationOptions<
    any,
    unknown,
    { playlist: string; song: string; action: "add" | "delete" }
  > = {}
) => {
  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ playlist, song, action }) =>
      await AxiosInstance(`/musicdex/playlist/${playlist}/${song}`, {
        method: action === "add" ? "GET" : "DELETE",
      }),
    {
      ...config,
      onSuccess: (data, payload, ...rest) => {
        queryClient.cancelQueries(["playlist", payload.playlist]);
        // apparently start-ui has some support for querying the cache and doing stuff to it?... seems interesting.
        // TODO (optional): modify the query cache for playlist if the song is a full Song object already.
        // it seems this code is part of the Optimistic Updating: https://react-query.tanstack.com/guides/optimistic-updates
        // queryClient
        //     .getQueryCache()
        //     .findAll('playlist')
        //     .forEach(({ queryKey }) => {
        //         queryClient.setQueryData(queryKey, (cachedData: UserList) => {
        //             if (!cachedData) return;
        //             return {
        //                 ...cachedData,
        //                 content: (cachedData.content || []).map((user) =>
        //                     user.id === data.id ? data : user
        //                 ),
        //             };
        //         });
        //     });
        queryClient.invalidateQueries(["playlist", payload.playlist]);
        if (config.onSuccess) {
          config.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};

export const usePlaylist = (
  playlistId: string,
  config: UseQueryOptions<PlaylistFull, unknown, PlaylistFull, string[]> = {}
) => {
  const queryClient = useQueryClient();
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["playlist", playlistId],
    async (q): Promise<PlaylistFull> => {
      // fetch cached
      const cached: PlaylistFull | undefined = queryClient.getQueryData([
        "playlist",
        playlistId,
      ]);
      if (cached) {
        const newdata = (
          await AxiosInstance<PlaylistFull>(
            `/musicdex/playlist/${q.queryKey[1]}`,
            {
              headers: {
                "If-Modified-Since": cached.updated_at.toISOString(),
              },
            }
          )
        ).data; // try fetching with If-Modified-Since, Server returns 304 if not modified.
        if (!newdata) return cached;
        else return newdata;
      }
      // cache miss:
      return (
        await AxiosInstance<PlaylistFull>(`/musicdex/playlist/${q.queryKey[1]}`)
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...config,
    }
  );

  return {
    playlist: result.data,
    ...result,
  };
};
