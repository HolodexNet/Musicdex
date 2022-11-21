import { PlaylistFormatter } from "../useFormatPlaylist";

export const weeklyFormatter: PlaylistFormatter<
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
    return t(`{{org}} Weekly Mix`, { org });
  },
  description: (playlist, { org }, data, { t }) => {
    return t(`Explore this week in {{org}}`, { org });
  },
  // link: (p, { id }, d: any) => {}
};
