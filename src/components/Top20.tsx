import React from "react";
import { Jacket } from "./Jacket";
import { useStoreActions } from "../store";
import { useTrendingSongs } from "../modules/services/songs.service";
import { SongTable } from "./data/SongTable";

export const Top20: React.FC<{ org: string; type: "w" | "m" }> = ({
  org,
  type,
}) => {
  const { data: trendingSongs, isLoading } = useTrendingSongs({ org });
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  if (isLoading) {
    return <div>Loading</div>;
  }

  function handleClick(song: Song) {
    queueSongs({ songs: [song], immediatelyPlay: true });
  }

  return (
    <div>
      <h1>Top20</h1>
      {isLoading && <p>Loading...</p>}
      {trendingSongs && SongTable(trendingSongs, undefined)}
    </div>
  );
};
