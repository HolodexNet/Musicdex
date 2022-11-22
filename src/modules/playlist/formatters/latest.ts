import { PlaylistFormatter } from "../useFormatPlaylist";

export const latestFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `https://holodex.net/statics/channelImg/${playlist.content[0].channel_id}.png`;
    } else {
      return undefined;
    }
  },
  title: (playlist, { org }, data, { t }) => {
    return t("Catch up on {{org}}", { org });
  },
  description: (playlist, { org }, data, { t }) => {
    return t("Latest tagged songs in {{org}}", { org });
  },
};
