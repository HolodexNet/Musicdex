import { useEffect, useState } from "react";
import { useAuth } from "./auth";

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

export function useTop20({ org, type }: { org: string; type: "w" | "m" }) {
  const { fetch } = useAuth();

  const [res, setRes] = useState<Music[] | null>(null);

  useEffect(() => {
    (async () => {
      const endpoint = `/api/v2/songs/top20?org=${org}&type=${type}`;
      const res = await fetch(endpoint);
      setRes(res);
    })();
  }, [org, type, fetch]);

  return [res];
}
