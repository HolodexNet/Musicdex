import { PlaylistFormatter } from "../useFormatPlaylist";

export const historyFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  bannerImage: () => undefined,
  channelImage: () => undefined,
  title: () => "Recently Played",
  description: () => "Your recently played songs",
};
