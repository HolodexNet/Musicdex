import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";
import { formatSeconds } from "../../../utils/SongHelper";

interface TimeSliderProps {
  progress: number;
  onChange: (e: number) => void;
  totalDuration: number;
}

export const TimeSlider = ({
  progress,
  onChange,
  totalDuration,
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
    >
      <SliderTrack height={hovering ? "10px" : "6px"}>
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
        <SliderThumb visibility={hovering ? "visible" : "hidden"} />
      </Tooltip>
    </Slider>
  );
};
