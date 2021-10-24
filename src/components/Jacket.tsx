import { Box, Image } from "@chakra-ui/react";
import React from "react";

export const Jacket: React.FC<{
  title: string;
  artwork: string;
  artist: string;
  playCount: number;
}> = ({ title, artwork, artist, playCount }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image p={3} src={artwork} alt={title} />
      <Box pl={3}>
        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {title}
        </Box>

        <Box>{artist}</Box>

        <Box d="flex" mt="2" alignItems="center">
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {playCount} plays
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
