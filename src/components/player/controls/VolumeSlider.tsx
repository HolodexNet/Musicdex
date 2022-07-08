import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";

interface VolumeSliderProps {
  volume: number;
  muted: boolean;
  onChange: (e: number) => void;
}

export const VolumeSlider = React.memo(
  ({ volume, muted, onChange }: VolumeSliderProps) => {
    return (
      <Slider
        aria-label="slider-ex-4"
        value={muted ? 0 : volume}
        onChange={onChange}
        focusThumbOnChange={false}
      >
        <SliderTrack bg="gray.700">
          <SliderFilledTrack
            background={`linear-gradient(to right, var(--chakra-colors-brand-300), var(--chakra-colors-n2-300) 90%)`}
          />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box
            color="brand.400"
            as={
              muted || volume === 0
                ? FiVolumeX
                : volume > 50
                ? FiVolume2
                : FiVolume1
            }
          />
        </SliderThumb>
      </Slider>
    );
  }
);
