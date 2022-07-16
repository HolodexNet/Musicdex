import { t } from "i18next";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const hotFormatter: PlaylistFormatter<{ ch: string }, undefined> = {
  bannerImage: (playlist, _, data) => {
    return `https://holodex.net/api/statics/channelImg/${playlist.art_context?.channels?.[0]}/banner/3.jpeg`;
  },
  channelImage: (playlist, _, data) => {
    return `https://holodex.net/api/statics/channelImg/${playlist.art_context?.channels?.[0]}.png`;
  },
  title: (playlist, _, data, { t }) => {
    console.log(playlist, _, data);
    if (!data) return;
    return t(`Trending Songs`);
  },
  description: (playlist, _, data, { t }) => {
    console.log(data);
    if (!data) return;
    return t("Trending songs radio");
    // return t(``);
  },
  link: (playlist) => {
    return `/radio/${playlist.id}/`;
  },

  // link: (p, { id }, d: any) => {}
};
