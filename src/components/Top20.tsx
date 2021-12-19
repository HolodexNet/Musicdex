import React from "react";
import { Jacket } from "./Jacket";
import { useTop20 } from "../modules/songs";
import { useStoreActions } from "../store";

export const Top20: React.FC<{ org: string; type: "w" | "m" }> = ({
  org,
  type,
}) => {
  const [top20] = useTop20({ org, type });
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  if (!top20) {
    return <div>Loading</div>;
  }

  function handleClick(song: Song) {
    queueSongs({ songs: [song], immediatelyPlay: false });
  }

  return (
    <div>
      <h1>Top20</h1>
      {top20.map((music) => (
        <Jacket
          onClick={() => handleClick(music)}
          key={music.video_id + music.start}
          title={music.name}
          artwork={music.art}
          artist={music.original_artist}
          // playCount={Number(music.frequency)}
        />
      ))}
    </div>
  );
};
