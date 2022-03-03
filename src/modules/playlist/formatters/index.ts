import { dailyRandomFormatter } from "./dailyrandom";
import { defaultFormatter } from "./default";
import { historyFormatter } from "./history";
import { latestFormatter } from "./latest";
import { mvFormatter } from "./mv";
import { videoFormatter } from "./video";
import { weeklyFormatter } from "./weekly";

export const formatters = {
  ":dailyrandom": dailyRandomFormatter,
  ":weekly": weeklyFormatter,
  ":userweekly": defaultFormatter,
  ":history": historyFormatter,
  ":video": videoFormatter,
  ":latest": latestFormatter,
  ":mv": mvFormatter,
  default: defaultFormatter,
};
