import { Box, Image, ImageProps } from "@chakra-ui/react";
import { resizeArtwork } from "../../modules/songs/utils";
import { getVideoThumbnails } from "../../utils/SongHelper";

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
  let url = `https://via.placeholder.com/${size}x${size}.jpg`;
  if (song) {
    url = song.art
      ? resizeArtwork(song.art, size)
      : getVideoThumbnails(song.video_id).maxres;
  }

  return (
    <Image
      src={url}
      alt={song?.name || ""}
      width={size + "px"}
      height={size + "px"}
      loading="lazy"
      objectFit="cover"
      {...rest}
    />
  );
}
