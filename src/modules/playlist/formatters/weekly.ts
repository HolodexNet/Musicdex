import { PlaylistFormatter } from "../useFormatPlaylist";

export const weeklyFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  // bannerImage: (playlist, { ch }, data) => {
  //   return `/api/statics/channelImg/${ch || data?.channel?.id}/banner/3.jpeg`;
  // },
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}.png`;
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
