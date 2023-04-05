import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { useClient } from "../client";

export function useFavorites(
  options?: UseQueryOptions<Channel[], AxiosError, Channel[], string[]>,
) {
  const { AxiosInstance, uid, isLoggedIn } = useClient();

  return useQuery(
    ["favorites", uid],
    async (): Promise<Channel[]> =>
      (await AxiosInstance<Channel[]>("/users/favorites")).data,
    {
      ...options,
      enabled: isLoggedIn && options?.enabled,
    },
  );
}

export function useFavoritesUpdater(
  config: UseMutationOptions<
    Channel[],
    AxiosError,
    { channelId: string; action: "add" | "remove" }
  > = {},
) {
  const { AxiosInstance, uid } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ channelId, action }) =>
      (
        await AxiosInstance<Channel[]>("/users/favorites", {
          method: "PATCH",
          data: [{ op: action, channel_id: channelId }],
        })
      ).data,
    {
      ...config,
      onSuccess: (data, payload, ...rest) => {
        console.log("refreshing queries:", ["favorites", uid]);
        queryClient.setQueryData(["favorites", uid], data);
        if (config.onSuccess) {
          config.onSuccess(data, payload, ...rest);
        }
      },
    },
  );
}
