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
  title: (playlist, { org, sort }, _) => {
    switch (sort) {
      case "random":
        return `Best of ${org}`;
      case "latest":
        return `Recent ${org} covers & originals`;
    }
  },
  description: (playlist, { org, sort }, data, { tn }) => {
    switch (sort) {
      case "random":
        return `Relive the top hits from ${org}`;
      case "latest":
        return `Recent ${org} covers & originals`;
    }
  },
};
