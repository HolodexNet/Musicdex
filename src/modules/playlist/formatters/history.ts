import { PlaylistFormatter } from "../useFormatPlaylist";

export const historyFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  bannerImage: () => undefined,
  channelImage: () => undefined,
  title: (_, __, ___, { t }) => t("Recently Played"),
  description: (_, __, ___, { t }) => t("Your recently played songs"),
};
