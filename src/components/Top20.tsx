import React from "react";
import { Jacket } from "./Jacket";
import { useTop20 } from "../modules/api/music";

export const Top20: React.FC<{ org: string; type: "w" | "m" }> = ({
  org,
  type,
}) => {
  const [top20] = useTop20({ org, type });

  if (!top20) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1>Top20</h1>
      {top20.map((music) => (
        <Jacket
          key={music.video_id + music.start}
          title={music.name}
          artwork={music.art}
          artist={music.original_artist}
          playCount={Number(music.frequency)}
        />
      ))}
    </div>
  );
};
