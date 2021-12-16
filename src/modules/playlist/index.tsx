import { useEffect, useState } from "react";
import { useClient } from "../client";
import { Song } from "../songs";
export interface Playlist {
  id: string;
  listed: boolean;
  owner: string;
  title: string;
  type: string;
  updated_at: Date;
  created_at: Date;
  description: string;
  content: Song[];
}

// function enlargeArtworks(music: Song): Song {
//   music.art = resizeArtwork(music.art);
//   return music;
// }

export function usePlaylist({ id }: { id: string }) {
  const { fetchJSON } = useClient();

  const [res, setRes] = useState<Playlist | null>(null);

  useEffect(() => {
    (async () => {
      setRes(null);
      const endpoint = `/api/v2/musicdex/playlist/${id}`;
      const res = await fetchJSON<Playlist>(endpoint);
      setRes(res);
    })();
  }, [id]);

  return res;
}
