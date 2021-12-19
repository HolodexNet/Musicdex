import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";

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
    { ...config }
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
    { ...config }
  );

  return { ...result };
};
