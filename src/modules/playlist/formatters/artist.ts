import { t } from "i18next";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const artistFormatter: PlaylistFormatter<
  { ch: string },
  { channel: Channel } | undefined
> = {
  bannerImage: (playlist, { ch }, data) => {
    return `https://holodex.net/api/statics/channelImg/${
      ch || data?.channel?.id
    }/banner/3.jpeg`;
  },
  channelImage: (playlist, { ch }, data) => {
    return `https://holodex.net/api/statics/channelImg/${
      ch || data?.channel.id
    }.png`;
  },
  title: (playlist, { ch }, data, { tn, t }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t(`{{name}}`, { name });
  },
  description: (playlist, { ch }, data, { tn }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t("Musicdex Radio featuring {{name}}", { name });
    // return t(``);
  },
  // link: (p, { id }, d: any) => {}
  link: (playlist) => {
    return `/radio/${playlist.id}/`;
  },
};
