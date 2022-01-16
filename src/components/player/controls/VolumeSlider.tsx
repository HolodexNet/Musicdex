import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { FiVolume1 } from "react-icons/fi";

interface VolumeSliderProps {
  volume: number;
  onChange: (e: number) => void;
}

export const VolumeSlider = React.memo(
  ({ volume, onChange }: VolumeSliderProps) => {
    return (
      <Slider aria-label="slider-ex-4" value={volume} onChange={onChange}>
        <SliderTrack bg="red.50">
          <SliderFilledTrack
            background={`linear-gradient(to right, var(--chakra-colors-brand-400), var(--chakra-colors-n2-400))`}
          />
        </SliderTrack>
        <SliderThumb boxSize={5}>
          <Box color="brand.400" as={FiVolume1} />
        </SliderThumb>
      </Slider>
    );
  }
);
