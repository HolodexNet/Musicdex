// series of Helper functions for playlists

import { extractUsingFn, isSGPPlaylist } from "./SGPFunctions";

export function identifyPlaylistBannerImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    // console.log('extracting..."');
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
      ":history": (p, _, __) => {
        return undefined;
      },
      ":video": (p, _, __) => {
        return undefined;
      },
      ":latest": (p, __, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
      ":mv": (p, __, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
    });
  } else {
    // console.log(playlist);
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}/banner/3.jpeg`;
    } else {
      return undefined;
    }
  }
}

export function identifyPlaylistChannelImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    const out = extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `/api/statics/channelImg/${ch || d?.channel.id}.png`;
      },
      ":userweekly": (p, { user }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}.png`;
        } else {
          return undefined;
        }
      },
      ":weekly": (p, { org }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}.png`;
        } else {
          return undefined;
        }
      },
      ":history": (p, _, __) => {
        return undefined;
      },
      ":video": (p, { id }, __) => {
        return undefined;
      },
    });
    if (out) return out;
  }
  if (playlist.content && playlist.content?.[0]) {
    return `/api/statics/channelImg/${playlist.content[0].channel_id}/200.png`;
  } else if ((playlist as any).channels || (playlist as any).videoids) {
    const chs = (playlist as any).channels || [];
    const vids = (playlist as any).videoids || [];
    if (chs.length < 4 && chs.length > 0)
      return `/api/statics/channelImg/${chs[0]}.png`;
    else return `https://i.ytimg.com/vi/${vids[0]}/hqdefault.jpg`;
  } else {
    return undefined;
  }
}

export function identifyTitle(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `Daily Mix: ${d?.channel.english_name || d?.channel.name}`;
      },
      ":userweekly": (p, { user }, _) => {
        return `Your Weekly Mix`;
      },
      ":weekly": (p, { org }, _) => {
        return `${org} Weekly Mix`;
      },
      ":history": (p, _, __) => {
        return "Recently Played";
      },
      ":video": (p, { id }, d) => {
        return d?.title || "Video";
      },
      ":latest": (p, { org }, _) => {
        return `${org} New Arrivals`;
      },
      ":mv": (p, { org, sort }, _) => {
        switch (sort) {
          case "random":
            return `${org} MV Mix`;
          case "latest":
            return `Latest ${org} MVs`;
        }
      },
    });
  } else {
    return playlist.title;
  }
}

export function identifyDescription(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d: any) => {
        return `Your daily dose of ${d.channel.english_name || d.channel.name}`;
      },
      ":userweekly": (p, { user }, _) => {
        return `Generated weekly by Holodex based on your past listens.`;
      },
      ":weekly": (p, { org }, d) => {
        return `Explore this week in ${org}`;
      },
      ":history": (p, _, __) => {
        return "Your recently played songs";
      },
      ":video": (p, { id }, d: any) => {
        return `Playlist from ${
          d.channel.english_name || d.channel.name
        }'s stream`;
      },
      ":latest": (p, { org }, _) => {
        return `Latest tagged songs in ${org}`;
      },
      ":mv": (p, { org, sort }, _) => {
        switch (sort) {
          case "random":
            return `Some of the best from ${org}`;
          case "latest":
            return `Recent ${org} covers & originals`;
        }
      },
    });
  } else {
    return playlist.description;
  }
}

export function identifyLink(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    const url = extractUsingFn(playlist, {
      ":history": (p, _, __) => {
        return "/history";
      },
      ":video": (p, { id }, d: any) => {
        return `/video/${id}`;
      },
    });
    if (url) return url;
  } else {
    return `/playlists/${playlist.id}/`;
  }
}
