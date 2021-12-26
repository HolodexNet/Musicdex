import { Box, Image, ImageProps } from "@chakra-ui/react";
import { resizeArtwork } from "../../modules/songs/utils";

interface SongArtworkProps extends ImageProps {
  artUrl?: string;
  song?: Song;
  size: number;
}

export function SongArtwork({
  artUrl,
  song,
  size = 200,
  ...rest
}: SongArtworkProps) {
  const url =
    artUrl || song?.art || `https://via.placeholder.com/${size}x${size}.jpg`;
  // TODO: swap with a placeholder image url
  if (!url) {
    return (
      <Box width={size + "px"} height={size + "px"}>
        Default Artwork Placeholder
      </Box>
    );
  }
  const resizedUrl = resizeArtwork(url, size);
  return (
    <Image
      src={resizedUrl}
      alt={song?.name || ""}
      width={size + "px"}
      height={size + "px"}
      {...rest}
    />
  );
}
