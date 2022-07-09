import { artistFormatter } from "./artist";
import { dailyRandomFormatter } from "./dailyrandom";
import { defaultFormatter } from "./default";
import { historyFormatter } from "./history";
import { hotFormatter } from "./hot";
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
  ":artist": artistFormatter,
  ":hot": hotFormatter,
  default: defaultFormatter,
};
