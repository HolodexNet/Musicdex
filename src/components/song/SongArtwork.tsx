import { Image, ImageProps } from "@chakra-ui/react";
import { getSongArtwork } from "../../utils/SongHelper";

interface SongArtworkProps extends ImageProps {
  artUrl?: string;
  song?: Song;
  size: number;
  resizeHint?: number;
}

export function SongArtwork({
  artUrl,
  song,
  size = 200,
  resizeHint,
  ...rest
}: SongArtworkProps) {
  const url = getSongArtwork(song, resizeHint || size);

  return (
    <Image
      src={url}
      alt={song?.name || ""}
      minWidth={size + "px"}
      width={size + "px"}
      height={size + "px"}
      loading="lazy"
      objectFit="cover"
      {...rest}
    />
  );
}
