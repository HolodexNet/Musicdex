import { PlaylistFormatter } from "../useFormatPlaylist";

export const latestFormatter: PlaylistFormatter<
  { org: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}.png`;
    } else {
      return undefined;
    }
  },
  title: (playlist, { org }, _) => {
    return `Catchup on ${org}`;
  },
  description: (playlist, { org }, data, { tn }) => {
    return `Latest tagged songs in ${org}`;
  },
};
