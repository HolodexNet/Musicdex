import { Container, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Jacket } from "../components/Jacket";
import { usePlaylist } from "../modules/playlist";

export function Playlist() {
  let { playlistId }: { playlistId: string } = useParams();
  const playlist = usePlaylist({ id: playlistId });
  return (
    <Container pt={30}>
      {playlist && (
        <div>
          <h1>{playlist.id}</h1>
          {playlist.content.map((music) => (
            <Jacket
              // onClick={() => handleClick(music.video_id)}
              key={music.video_id + music.start}
              title={music.name}
              artwork={music.art}
              artist={music.original_artist}
              playCount={Number(music.frequency)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
