import { Box } from "@chakra-ui/react";
import { jsx } from "@emotion/react";
import { Song } from "../../modules/songs";

export const SongItem = (song: Song) => {
  return <Box>{song.name}</Box>;
};
