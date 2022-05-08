import { intervalToDuration } from "date-fns";
import { resizeArtwork } from "../modules/songs/utils";

export function formatSeconds(secs: number) {
  const { hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: secs * 1000,
  });
  return `${hours ? hours + ":" : ""}${
    String(minutes).padStart(!hours && minutes ? 1 : 2, "0") ||
    (hours ? "00" : "0")
  }:${String(seconds).padStart(2, "0") || "00"}`;
}

export function getVideoThumbnails(ytVideoKey: string, useWebP = false) {
  const base = useWebP
    ? "https://i.ytimg.com/vi_webp"
    : "https://i.ytimg.com/vi";
  const ext = useWebP ? "webp" : "jpg";
  return {
    // 120w
    default: `${base}/${ytVideoKey}/default.${ext}`,
    // 320w
    medium: `${base}/${ytVideoKey}/mqdefault.${ext}`,
    // 640w
    standard: `${base}/${ytVideoKey}/sddefault.${ext}`,
    // 1280w
    maxres: `${base}/${ytVideoKey}/maxresdefault.${ext}`,
    hq720: `${base}/${ytVideoKey}/hq720.${ext}`,
  };
}

export function getSongArtwork(song: Song | undefined, size = 200) {
  let url = `https://via.placeholder.com/${size}x${size}.jpg`;
  const videoArtSize = size > 200 ? "maxres" : "medium";
  if (song) {
    url = song.art
      ? resizeArtwork(song.art, size)
      : getVideoThumbnails(song.video_id)[videoArtSize];
  }
  return url;
}
