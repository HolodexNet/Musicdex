import { PlaylistFormatter } from "../useFormatPlaylist";

export const videoFormatter: PlaylistFormatter<
  { id: string },
  { id: string; title: string } | undefined
> = {
  title: (playlist, { id }, data, ctx) => {
    return data?.title || "Video";
  },
  description: (p, { id }, video: any, { t, tn }) => {
    if (!t || !tn) return "";
    const date = t("NO_TL.relativeDate", {
      date: new Date(video.available_at),
    });
    const name = tn(video.channel.english_name, video.channel.name);
    return t(`Sang by {{name}} on {{date}}`, { name, date });
  },
  link: (p, { id }, d: any) => {
    return `/video/${id}`;
  },
};
