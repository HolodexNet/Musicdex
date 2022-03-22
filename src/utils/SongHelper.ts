import { intervalToDuration } from "date-fns";

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
