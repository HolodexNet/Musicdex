import { PlaylistFormatter } from "../useFormatPlaylist";

export const weeklyFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `https://holodex.net/api/statics/channelImg/${playlist.content[0].channel_id}.png`;
    } else {
      return undefined;
    }
  },
  title: (playlist, { org }, _) => {
    return `${org} Weekly Mix`;
  },
  description: (playlist, { org }, data, { tn }) => {
    return `Explore this week in ${org}`;
  },
  // link: (p, { id }, d: any) => {}
};
