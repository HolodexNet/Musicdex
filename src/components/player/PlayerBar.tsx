import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { formatSeconds } from "../../utils/SongHelper";
import { SongInfo } from "./controls/PlayerSongInfo";
import { PlaybackControl } from "./controls/PlaybackControl";
import { PlayerOption } from "./controls/PlayerOption";
import { VolumeSlider } from "./controls/VolumeSlider";
import { TimeSlider } from "./controls/TimeSlider";
interface PlayerBarProps {
  progress: number;
  onProgressChange: (e: number) => void;
  currentSong: Song | undefined;
  isPlaying: boolean;
  togglePlay: () => void;
  seconds: string;
  volume: number;
  onVolumeChange: (e: number) => void;
  totalDuration: number;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export function PlayerBar({
  progress,
  onProgressChange,
  currentSong,
  isPlaying,
  togglePlay,
  seconds,
  volume,
  onVolumeChange,
  totalDuration,
  isExpanded,
  toggleExpanded,
}: PlayerBarProps) {
  return (
    <PlayerContainer>
      <TimeSlider
        progress={progress}
        onChange={onProgressChange}
        totalDuration={totalDuration}
      />
      <PlayerMain>
        <div className="left">
          <span>{currentSong && <SongInfo song={currentSong} />}</span>
        </div>
        <div className="center">
          <PlaybackControl isPlaying={isPlaying} togglePlay={togglePlay} />
        </div>
        <Flex className="right">
          <Box width={36} mr={2}>
            <VStack spacing={-1}>
              <VolumeSlider volume={volume} onChange={onVolumeChange} />
              <Text fontSize=".85em" display="inline-block" opacity={0.5}>
                <span>{seconds}</span> /{" "}
                <span>{formatSeconds(totalDuration)}</span>
              </Text>
            </VStack>
          </Box>
          <PlayerOption
            isExpanded={isExpanded}
            toggleExpanded={toggleExpanded}
          />
        </Flex>
      </PlayerMain>
    </PlayerContainer>
  );
}
// const MemoizedPlayerBarLower = React.memo(PlayerBar);

const PlayerContainer = styled.div`
  width: 100%;
  height: 80px;
  flex-basis: 1;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease-out;
  background: #1c1c1c;
  /* overflow: hidden; */
  flex-direction: row;
  display: flex;
  z-index: 10;

  > .chakra-slider {
    position: fixed !important;
    margin-top: -3px;
    width: 100%;
  }
`;

const PlayerMain = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 5px;
  /* flex-direction: column; */

  .left > span {
    margin-right: auto;
    padding-left: 20px;
  }
  .left,
  .right,
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    justify-content: flex-end;
    margin-left: auto;
    padding-right: 12px;
  }
`;
