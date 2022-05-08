import {
  BoxProps,
  Flex,
  IconButton,
  FlexProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { ReactElement } from "react";
import { useStoreActions, useStoreState } from "../../../store";
import { FaStepBackward, FaPause, FaPlay, FaStepForward } from "react-icons/fa";
import { MotionBox } from "../../common/MotionBox";
import { ChangePlayerLocationButton } from "../ChangePlayerLocationButton";
import { ShuffleIcon, RepeatIcon } from "./PlayerOption";

interface PlaybackControlProps extends FlexProps {
  isPlaying: boolean;
  togglePlay: () => void;
  fullPlayer?: boolean;
  mobilePlayer?: boolean;
}

interface PlaybackButtonProps extends BoxProps {
  icon: ReactElement;
}

const PlaybackButton = ({ icon, ...rest }: PlaybackButtonProps) => {
  return (
    <MotionBox
      whileTap={{ scale: 0.9 }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.3 },
      }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="brand.200"
      cursor="pointer"
      {...rest}
    >
      {icon}
    </MotionBox>
  );
};

export const PlaybackControl = React.memo(
  ({
    isPlaying,
    togglePlay,
    fullPlayer = false,
    mobilePlayer = false,
    ...rest
  }: PlaybackControlProps) => {
    const previous = useStoreActions((actions) => actions.playback.previous);
    const next = useStoreActions((actions) => actions.playback.next);

    const sizeMultiplier = useMemo(() => (fullPlayer ? 2 : 1), [fullPlayer]);
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const shuffleMode = useStoreState((state) => state.playback.shuffleMode);
    const toggleShuffleMode = useStoreActions(
      (actions) => actions.playback.toggleShuffle
    );

    const repeatMode = useStoreState((state) => state.playback.repeatMode);
    const toggleRepeatMode = useStoreActions(
      (actions) => actions.playback.toggleRepeat
    );

    useEffect(() => {
      navigator.mediaSession.setActionHandler("previoustrack", function () {
        console.log('> User clicked "Previous Track" button.');
        previous();
      });

      navigator.mediaSession.setActionHandler("nexttrack", function () {
        console.log('> User clicked "Next Track" button.');
        next({ count: 1, userSkipped: true });
      });

      navigator.mediaSession.setActionHandler("play", function () {
        console.log('> User clicked "Play" button.');
        if (!isPlaying) togglePlay();
        (document.pictureInPictureElement as HTMLVideoElement)?.play();
      });

      navigator.mediaSession.setActionHandler("pause", function () {
        console.log('> User clicked "Pause" button.');
        if (isPlaying) togglePlay();
        (document.pictureInPictureElement as HTMLVideoElement)?.pause();
      });
    }, [previous, next, isPlaying, togglePlay]);

    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        paddingRight={mobilePlayer ? 2 : 0}
        {...rest}
      >
        {mobilePlayer && <ChangePlayerLocationButton size="lg" />}
        {fullPlayer && !isMobile && (
          <PlaybackButton
            aria-label="Shuffle"
            icon={ShuffleIcon(shuffleMode, 36)}
            onClick={() => toggleShuffleMode()}
          />
        )}
        {!mobilePlayer && (
          <PlaybackButton
            icon={<FaStepBackward size={sizeMultiplier * 16} />}
            onClick={() => previous()}
            marginX={3}
          />
        )}
        <PlaybackButton
          icon={
            isPlaying ? (
              <FaPause size={sizeMultiplier * 24} />
            ) : (
              <FaPlay size={sizeMultiplier * 24} />
            )
          }
          onClick={togglePlay}
          padding={sizeMultiplier * 3}
        />
        <PlaybackButton
          icon={<FaStepForward size={sizeMultiplier * 16} />}
          onClick={() => next({ count: 1, userSkipped: true })}
          marginX={3}
        />
        {fullPlayer && !isMobile && (
          <PlaybackButton
            aria-label="Repeat Mode"
            icon={RepeatIcon(repeatMode, 36)}
            onClick={() => toggleRepeatMode()}
          />
        )}
      </Flex>
    );
  }
);
