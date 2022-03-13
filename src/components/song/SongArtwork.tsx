import { Box, Image, ImageProps } from "@chakra-ui/react";
import { resizeArtwork } from "../../modules/songs/utils";
import { getVideoThumbnails } from "../../utils/SongHelper";

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
  let url = `https://via.placeholder.com/${size}x${size}.jpg`;
  const resizeSize = resizeHint || size;
  const videoArtSize = resizeSize > 200 ? "maxres" : "medium";
  if (song) {
    url = song.art
      ? resizeArtwork(song.art, resizeHint || size)
      : getVideoThumbnails(song.video_id)[videoArtSize];
  }

  return (
    <Image
      src={url}
      alt={song?.name || ""}
      minWidth={size + "px"}
      width={size + "px"}
      height={size + "px"}
      loading="lazy"
      objectFit="cover"
      crossorigin="anonymous"
      {...rest}
    />
  );
}
