import { useEffect, useState } from "react";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";

export interface Channel {
  name: string;
  english_name: string;
  photo: string;
}

export interface Song {
  frequency: string;
  channel_id: string;
  video_id: string;
  name: string;
  start: number;
  end: number;
  itunesid: number;
  art: string;
  amUrl: string;
  available_at: string;
  original_artist: string;
  channel: Channel;
}

// function enlargeArtworks(music: Song): Song {
//   music.art = resizeArtwork(music.art);
//   return music;
// }

export function usePlaylist({ id }: { id: string }) {
  const { fetchJSON } = useClient();

  const [res, setRes] = useState<Song[] | null>(null);

  useEffect(() => {
    (async () => {
      setRes(null);
      const endpoint = `/api/v2/musicdex/playlist/${id}`;
      const res = await fetchJSON<Song[]>(endpoint);
      setRes(res);
    })();
  }, [id]);

  return [res];
}
