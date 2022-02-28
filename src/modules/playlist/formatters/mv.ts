import { PlaylistFormatter } from "../useFormatPlaylist";

export const mvFormatter: PlaylistFormatter<
  { org: string; sort: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}.png`;
    } else {
      return undefined;
    }
  },
  title: (playlist, { org }, _) => {
    return `${org} New Arrivals`;
  },
  description: (playlist, { org, sort }, data, { tn }) => {
    switch (sort) {
      case "random":
        return `Some of the best from ${org}`;
      case "latest":
        return `Recent ${org} covers & originals`;
    }
  },
};
