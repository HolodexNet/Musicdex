import { t } from "i18next";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const hotFormatter: PlaylistFormatter<{ ch: string }, undefined> = {
  bannerImage: (playlist, _, data) => {
    return `https://holodex.net/api/statics/channelImg/${playlist.art_context?.channels?.[0]}/banner/3.jpeg`;
  },
  channelImage: (playlist, _, data) => {
    console.log(playlist);
    return `https://holodex.net/api/statics/channelImg/${playlist.art_context?.channels?.[0]}.png`;
  },
  title: (playlist, _, data, { t }) => {
    if (!data) return;
    return t(`Magic Shuffle`);
  },
  description: (playlist, _, data, { t }) => {
    if (!data) return;
    return t("Musicdex Radio");
    // return t(``);
  },
  link: (playlist) => {
    return `/radio/${playlist.id}/`;
  },

  // link: (p, { id }, d: any) => {}
};
