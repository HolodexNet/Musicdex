// series of Helper functions for playlists

import { extractUsingFn, isSGPPlaylist } from "./SGPFunctions";

export function identifyPlaylistBannerImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    console.log('extracting..."');
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `/api/statics/channelImg/${ch || d?.channel?.id}/banner/3.jpeg`;
      },
      ":userweekly": (p, { user }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
      ":weekly": (p, { org }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
    });
  } else {
    if (playlist.content && playlist.content[0]) {
      return `/statics/channelImg/${playlist.content[0].channel_id}/banner/3.jpeg`;
    } else {
      return undefined;
    }
  }
}

export function identifyPlaylistChannelImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `/statics/channelImg/${ch || d?.channel.id}/200.png`;
      },
      ":userweekly": (p, { user }, _) => {
        if (p.content && p.content[0]) {
          return `/statics/channelImg/${p.content[0].channel_id}/200.png`;
        } else {
          return undefined;
        }
      },
      ":weekly": (p, { org }, _) => {
        if (p.content && p.content[0]) {
          return `/statics/channelImg/${p.content[0].channel_id}/200.png`;
        } else {
          return undefined;
        }
      },
    });
  } else {
    if (playlist.content && playlist.content[0]) {
      return `/statics/channelImg/${playlist.content[0].channel_id}/200.png`;
    } else {
      return undefined;
    }
  }
}
