import { useEffect, useState } from "react";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";
import { resizeArtwork } from "./utils";

function enlargeArtworks(music: Song): Song {
  music.art = resizeArtwork(music.art);
  return music;
}

export function useTop20({ org, type }: { org: string; type: "w" | "m" }) {
  const { AxiosInstance } = useClient();

  const [res, setRes] = useState<Song[] | null>(null);

  useEffect(() => {
    (async () => {
      setRes(null);
      const endpoint = encodeUrl("/songs/latest", { org, type });
      const res = (
        await AxiosInstance<Song[]>(endpoint, { method: "POST", data: { org } })
      ).data.map(enlargeArtworks);
      setRes(res);
    })();
  }, [org, type, AxiosInstance]);

  return [res];
}
