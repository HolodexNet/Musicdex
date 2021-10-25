import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { resizeArtwork } from "./utils";

export interface Channel {
  name: string;
  english_name: string;
  photo: string;
}

export interface Music {
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

function enlargeArtworks(music: Music): Music {
  music.art = resizeArtwork(music.art);
  return music;
}

export function useTop20({ org, type }: { org: string; type: "w" | "m" }) {
  const { fetchJSON } = useAuth();

  const [res, setRes] = useState<Music[] | null>(null);

  useEffect(() => {
    (async () => {
      setRes(null);
      const endpoint = `/api/v2/songs/top20?org=${org}&type=${type}`;
      const res = (await fetchJSON<Music[]>(endpoint)).map(enlargeArtworks);
      setRes(res);
    })();
  }, [org, type, fetchJSON]);

  return [res];
}
