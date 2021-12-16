import { Container, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylist } from "../modules/playlist";

export function Playlist() {
  let { playlistId }: { playlistId: string } = useParams();
  const playlist = usePlaylist({ id: playlistId });
  return <Container pt={30}>{JSON.stringify(playlist)}</Container>;
}
