import { t } from "i18next";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const dailyRandomFormatter: PlaylistFormatter<
  { ch: string },
  { channel: Channel } | undefined
> = {
  bannerImage: (playlist, { ch }, data) => {
    return `https://holodex.net/statics/channelImg/${
      ch || data?.channel?.id
    }/banner/3.jpeg`;
  },
  channelImage: (playlist, { ch }, data) => {
    return `https://holodex.net/statics/channelImg/${
      ch || data?.channel.id
    }.png`;
  },
  title: (playlist, { ch }, data, { tn, t }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t(`Daily Mix: {{name}}`, { name });
  },
  description: (playlist, { ch }, data, { tn }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t(`Your daily dose of {{name}}`, { name });
  },
  // link: (p, { id }, d: any) => {}
};
