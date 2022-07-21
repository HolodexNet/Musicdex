import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
  SliderProps,
  SliderMark,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { formatSeconds } from "../../../utils/SongHelper";

interface TimeSliderProps extends SliderProps {
  progress: number;
  onChange: (e: number) => void;
  totalDuration: number;
  fullPlayer?: boolean;
}

export const TimeSlider = React.memo(
  ({
    progress,
    onChange,
    totalDuration,
    fullPlayer = false,
    ...rest
  }: TimeSliderProps) => {
    const [hovering, setHovering] = useState(false);
    return (
      <Slider
        defaultValue={0}
        step={0.1}
        min={0}
        max={100}
        value={progress}
        itemID="main-slider"
        colorScheme="blue"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onChange={onChange}
        focusThumbOnChange={false}
        {...rest}
      >
        {fullPlayer && (
          <>
            <SliderMark value={0} mt="1" fontSize="md">
              {formatSeconds((progress / 100) * totalDuration)}
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
          <SliderFilledTrack
            background={`linear-gradient(to right, var(--chakra-colors-brand-400), var(--chakra-colors-n2-400))`}
          />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={hovering}
          label={<span>{formatSeconds((progress / 100) * totalDuration)}</span>}
        >
          <SliderThumb
            opacity={hovering || fullPlayer ? 1 : 0}
            scale={hovering || fullPlayer ? 1 : 0}
            transition="opacity var(--chakra-transition-duration-fast) ease-in"
          />
        </Tooltip>
      </Slider>
    );
  }
);
