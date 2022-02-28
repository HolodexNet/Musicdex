import { PlaylistFormatter } from "../useFormatPlaylist";

export const dailyRandomFormatter: PlaylistFormatter<
  { ch: string },
  { channel: Channel } | undefined
> = {
  bannerImage: (playlist, { ch }, data) => {
    return `/api/statics/channelImg/${ch || data?.channel?.id}/banner/3.jpeg`;
  },
  channelImage: (playlist, { ch }, data) => {
    return `/api/statics/channelImg/${ch || data?.channel.id}.png`;
  },
  title: (playlist, { ch }, data, { tn }) => {
    if (!data) return;
    const name = tn
      ? tn(data.channel.english_name, data.channel.name)
      : data.channel.name;
    return `Daily Mix: ${name}`;
  },
  description: (playlist, { ch }, data, { tn }) => {
    if (!data) return;
    const name = tn
      ? tn(data.channel.english_name, data.channel.name)
      : data.channel.name;
    return `Your daily dose of ${name}`;
  },
  // link: (p, { id }, d: any) => {}
};
