import { PlaylistFormatter } from "../useFormatPlaylist";

export const mvFormatter: PlaylistFormatter<
  { org: string; sort: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `https://holodex.net/api/statics/channelImg/${playlist.content[0].channel_id}.png`;
    } else {
      return undefined;
    }
  },
  title: (playlist, { org, sort }, _, { t }) => {
    switch (sort) {
      case "random":
        return t("Best of {{org}}", { org });
      case "latest":
        return t("Recent {{org}} covers & originals", { org });
    }
  },
  description: (playlist, { org, sort }, data, { t }) => {
    switch (sort) {
      case "random":
        return t(`Relive the top hits from {{org}}`, { org });
      case "latest":
        return t(`Recent {{org}} covers & originals`, { org });
    }
  },
};
