import { UseQueryOptions, useQuery } from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export const useHistory = (
  config: UseQueryOptions<Song[], unknown, Song[], [string]> = {}
) => {
  const { AxiosInstance } = useClient();

  const result = useQuery(
    ["history"],
    async (q): Promise<Song[]> => {
      // TODO: maybe add if-modified caching?
      // TODO: maybe change to playlist resource?
      return (await AxiosInstance<Song[]>(`/musicdex/history`)).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config }
  );

  return { ...result };
};
