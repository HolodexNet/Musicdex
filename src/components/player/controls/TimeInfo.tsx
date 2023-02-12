import React from "react";
import { Text } from "@chakra-ui/react";
import { formatSeconds } from "../../../utils/SongHelper";
import { usePlayerStats } from "../YoutubePlayer";

const TimeInfo = React.memo(() => {
  const { totalDuration, progress } = usePlayerStats();

  return (
    <Text fontSize=".85em" display="inline-block" opacity={0.5}>
      <span>
        {formatSeconds((Math.max(progress, 0) / 100) * totalDuration)}
      </span>{" "}
      / <span>{formatSeconds(totalDuration)}</span>
    </Text>
  );
});

export default TimeInfo;
