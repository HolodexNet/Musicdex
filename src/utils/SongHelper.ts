import { intervalToDuration, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function formatSeconds(secs: number) {
  const { hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: secs * 1000,
  });
  return `${hours ? hours + ":" : ""}${
    String(minutes).padStart(!hours && minutes ? 1 : 2, "0") || "00"
  }:${String(seconds).padStart(2, "0") || "00"}`;
}

// const SYSTEM_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone
// export function AbsoluteTimestampForTitle(ts: Date, locale: Locale) {
//   const ts1 = formatInTimeZone(ts, SYSTEM_TZ, 'Pp zzz', { locale });
//   const ts2 = formatInTimeZone(ts, 'Asia/Tokyo', 'Pp zzz', { locale, });
//   if (ts1 === ts2) {
//     return ts1;
//   }
//   return `${ts1}\n${ts2}`;

// }

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
