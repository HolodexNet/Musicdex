import { UseQueryOptions, useQuery } from "react-query";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import { mergeSongsWithLikeCheck, useLikedCheckSongs } from "./like.service";

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

  return { ...result };
};

export const useTrendingSongs = (
  { org, channel_id }: { org?: string; channel_id?: string },
  config: UseQueryOptions<
    Song[],
    unknown,
    Song[],
    [string, { org?: string; channel_id?: string }]
  > = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["hot", { org, channel_id }],
    async (q): Promise<Song[]> => {
      return (
        await AxiosInstance<Song[]>(encodeUrl(`/songs/hot`, q.queryKey[1]))
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  const likeCheck = useLikedCheckSongs(result.data?.map((x) => x.id) || []);

  if (result.data?.length && likeCheck.data?.length) {
    mergeSongsWithLikeCheck(result.data, likeCheck.data);
  }

  return { ...result };
};

export interface SongAPILookupObject {
  org: string;
  channel_id: string;
  video_id: string;
  // q: string; <q has been deprecated, use search API instead>
  offset?: number;
  limit?: number;
  paginated?: any;
}

export const useSongAPI = (
  target: SongAPILookupObject,
  config: UseQueryOptions<
    Song[],
    unknown,
    Song[],
    [string, SongAPILookupObject]
  > = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["songlist", target],
    async (q): Promise<Song[]> => {
      return (
        await AxiosInstance<Song[]>(`/songs/latest`, {
          method: "POST",
          data: q.queryKey[1],
        })
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  return { ...result };
};
