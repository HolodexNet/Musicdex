import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";
import { PlayerContext } from "../../layout/Frame";
import { usePlayer } from "../YoutubePlayer";

export const VolumeSlider = React.memo(() => {
  const [player] = useContext(PlayerContext);
  const { volume, muted } = usePlayer();
  const [volumeSlider, setVolumeSlider] = useState(volume);

  useEffect(() => {
    setVolumeSlider(volume);
  }, [volume]);

  const onChange = useCallback(
    (value: number) => {
      setVolumeSlider(value);
      player?.unMute();
      player?.setVolume(value);
    },
    [player],
  );

  return (
    <Slider
      aria-label="slider-ex-4"
      value={muted ? 0 : volumeSlider}
      onChange={onChange}
      focusThumbOnChange={false}
    >
      <SliderTrack bg="gray.700">
        <SliderFilledTrack bgGradient="linear(to-r, brand.300, n2.300 90%)" />
      </SliderTrack>
      <SliderThumb boxSize={6}>
        <Box
          color="brand.400"
          as={
            muted || volumeSlider === 0
              ? FiVolumeX
              : volumeSlider > 50
              ? FiVolume2
              : FiVolume1
          }
        />
      </SliderThumb>
    </Slider>
  );
});
