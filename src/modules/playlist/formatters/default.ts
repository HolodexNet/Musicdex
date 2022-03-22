import { PlaylistFormatter } from "../useFormatPlaylist";

export const defaultFormatter: PlaylistFormatter<any, any> = {
  bannerImage: (playlist) => {
    if (playlist.content && playlist.content[0]) {
      return `https://holodex.net/api/statics/channelImg/${playlist.content[0].channel_id}/banner/3.jpeg`;
    } else {
      return undefined;
    }
  },
  channelImage: (playlist) => {
    if (playlist.content && playlist.content?.[0]) {
      return `https://holodex.net/api/statics/channelImg/${playlist.content[0].channel_id}/200.png`;
    } else if ((playlist as any).channels || (playlist as any).videoids) {
      const chs = (playlist as any).channels || [];
      const vids = (playlist as any).videoids || [];
      if (chs.length < 4 && chs.length > 0)
        return `https://holodex.net/api/statics/channelImg/${chs[0]}.png`;
      else return `https://i.ytimg.com/vi/${vids[0]}/hqdefault.jpg`;
    } else {
      return undefined;
    }
  },
  title: (playlist) => {
    return playlist.title;
  },
  description: (playlist) => {
    return playlist.description;
  },
  link: (playlist) => {
    return `/playlists/${playlist.id}/`;
  },
};
