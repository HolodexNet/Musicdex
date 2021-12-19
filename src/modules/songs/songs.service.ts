import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../client";

export const useSong = (
  songId: string,
  config: UseQueryOptions<Song, unknown, Song, string[]> = {}
) => {
  const queryClient = useQueryClient();
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["song", songId],
    async (q): Promise<Song> => {
      return (await AxiosInstance<Song>("/song/")).data;
    },
    { ...config }
  );

  return { ...result };
};
