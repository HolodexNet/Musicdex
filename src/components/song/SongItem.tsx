import { Box } from "@chakra-ui/react";
import { jsx } from "@emotion/react";

export const SongItem = (song: Song) => {
  return <Box>{song.name}</Box>;
};
