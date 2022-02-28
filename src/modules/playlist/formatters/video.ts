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
    console.log(video);
    return `Sang ${t("NO_TL.relativeDate", {
      date: new Date(video.available_at),
    })}
    by ${tn(video.channel.english_name, video.channel.name)} 
    `;
  },
  link: (p, { id }, d: any) => {
    return `/video/${id}`;
  },
};
