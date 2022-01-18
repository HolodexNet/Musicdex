import { useMemo } from "react";
import {
  UseQueryOptions,
  useQuery,
  UseMutationOptions,
  useQueryClient,
  useMutation,
} from "react-query";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import { useLikedCheckSongs } from "./like.service";

export const useSong = (
  songId: string,
  config: UseQueryOptions<Song, unknown, Song, string[]> = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["songs", songId],
    async (q): Promise<Song> => {
      return (await AxiosInstance<Song>(`/songs/${q.queryKey[1]}`)).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  const likestatus = useLikedCheckSongs(
    result?.data?.id ? [result.data.id] : [],
    true
  );

  const newSongResult = useMemo(() => {
    if (likestatus.data && result.data) {
      return { ...result.data, liked: likestatus.data[result.data.id] };
    } else {
      return result.data;
    }
  }, [result.data, likestatus.data]);
  return { ...result, data: newSongResult };
};

export const useTrendingSongs = (
  x: { org?: string; channel_id?: string },
  config: UseQueryOptions<
    Song[],
    unknown,
    Song[],
    [string, { org?: string; channel_id?: string }]
  > = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["hot", x],
    async (q): Promise<Song[]> => {
      return (
        await AxiosInstance<Song[]>(encodeUrl(`/songs/hot`, q.queryKey[1]))
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  // const likestatus = useLikedCheckSongs(result?.data ? result.data.map(x => x.id) : [], true);

  // const newSongResult = useMemo(() => {
  //   if (likestatus.data && result.data) {
  //     return result.data.map(x => ({ ...x, liked: likestatus.data[x.id] }))
  //   } else {
  //     return result.data
  //   }
  // }, [result.data, likestatus.data])

  // return { ...result, data: newSongResult };
  return result;
};

export interface SongAPILookupObject {
  org?: string;
  channel_id?: string;
  video_id?: string;
  // q: string; <q has been deprecated, use search API instead>
  offset?: number;
  limit?: number;
  paginated?: any;
}

export const useSongAPI = (
  target: SongAPILookupObject,
  config: UseQueryOptions<
    { total: number; items: Song[] },
    unknown,
    { total: number; items: Song[] },
    [string, SongAPILookupObject]
  > = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["songlist", target],
    async (q): Promise<{ total: number; items: Song[] }> => {
      return (
        await AxiosInstance<{ total: number; items: Song[] }>(`/songs/latest`, {
          method: "POST",
          data: q.queryKey[1],
        })
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  const likestatus = useLikedCheckSongs(
    result?.data?.items ? result.data.items.map((x) => x.id) : [],
    true
  );

  let newSongResult = useMemo(() => {
    console.log(
      "regenerating song list like state",
      likestatus.data,
      result.data?.items
    );
    if (likestatus.data && result.data?.items) {
      return {
        total: result.data.total,
        items: result.data.items.map((x) => ({
          ...x,
          liked: likestatus.data[x.id],
        })),
      };
    } else {
      return result.data;
    }
  }, [result, likestatus]);

  // console.log(newSongResult?.items[0]);

  return { ...result, data: newSongResult };
};

export const useTrackSong = (
  callbacks: UseMutationOptions<any, unknown, { song_id: string }> = {}
) => {
  const { AxiosInstance, user } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (payload) =>
      (
        await AxiosInstance(`/musicdex/history/${payload.song_id}`, {
          method: "GET",
        })
      ).data,
    {
      ...callbacks,
      onSuccess: (data, payload, ...rest) => {
        if (user?.id) {
          queryClient.cancelQueries([
            "playlist",
            `:history[user_id=${user?.id}]`,
          ]);
          queryClient.invalidateQueries([
            "playlist",
            `:history[user_id=${user?.id}]`,
          ]);
        }
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};
