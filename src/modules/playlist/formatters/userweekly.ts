import { PlaylistFormatter } from "../useFormatPlaylist";

export const userweeklyFormatter: PlaylistFormatter<
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
    return t(`Your Weekly Mix`, { org });
  },
  description: (playlist, { org }, data, { t }) => {
    return t(`Crafted for you based on your listening habits`, { org });
  },
  // link: (p, { id }, d: any) => {}
};
