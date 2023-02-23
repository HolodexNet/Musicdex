import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
  SliderProps,
  SliderMark,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useStoreState } from "../../../store";
import { formatSeconds } from "../../../utils/SongHelper";
import { PlayerContext } from "../../layout/Frame";
import { usePlayerStats } from "../YoutubePlayer";

interface TimeSliderProps extends SliderProps {
  fullPlayer?: boolean;
}

export const TimeSlider = React.memo(
  ({ fullPlayer = false, ...rest }: TimeSliderProps) => {
    const [player] = useContext(PlayerContext);
    const { totalDuration, progress } = usePlayerStats();
    const currentSong = useStoreState(
      (state) => state.playback.currentlyPlaying.song,
    );

    const [progressSlider, setProgressSlider] = useState(0);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
      setProgressSlider(Math.max(progress, 0));
    }, [progress]);

    return (
      <Slider
        defaultValue={0}
        step={0.1}
        min={0}
        max={100}
        value={progressSlider}
        itemID="main-slider"
        colorScheme="blue"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onChange={(value) => {
          if (!currentSong) return;
          setProgressSlider(value);
          player?.seekTo(
            currentSong.start + (value / 100) * totalDuration,
            true,
          );
        }}
        focusThumbOnChange={false}
        {...rest}
      >
        {fullPlayer && (
          <>
            <SliderMark value={0} mt="1" fontSize="md">
              {formatSeconds((progressSlider / 100) * totalDuration)}
            </SliderMark>
            <SliderMark value={100} mt="1" ml="-1.75rem" fontSize="md">
              {formatSeconds(totalDuration)}
            </SliderMark>
          </>
        )}

        <SliderTrack
          height={hovering ? "10px" : "6px"}
          transition="height var(--chakra-transition-duration-fast) ease-in"
        >
          <SliderFilledTrack bgGradient="linear(to-r, brand.400, n2.400)" />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={hovering}
          label={
            <span>{formatSeconds((progressSlider / 100) * totalDuration)}</span>
          }
        >
          <SliderThumb
            opacity={hovering || fullPlayer ? 1 : 0}
            transition="opacity var(--chakra-transition-duration-fast) ease-in"
          />
        </Tooltip>
      </Slider>
    );
  },
);
