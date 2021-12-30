import { intervalToDuration } from "date-fns";

export function formatSeconds(secs: number) {
  const { hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: secs * 1000,
  });
  return `${hours ? hours + ":" : ""}${
    String(minutes).padStart(!hours && minutes ? 1 : 2, "0") || "00"
  }:${String(seconds).padStart(2, "0") || "00"}`;
}
