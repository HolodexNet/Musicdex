import { BoxProps, Flex, FlexProps } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ReactElement } from "react";
import { FaStepBackward, FaPause, FaPlay, FaStepForward } from "react-icons/fa";
import { useStoreActions } from "../../../store";
import { MotionBox } from "../../common/MotionBox";
import { ChangePlayerLocationButton } from "../ChangePlayerLocationButton";

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
    return (
      <Flex
        justifyContent="center"
        paddingRight={mobilePlayer ? 2 : 0}
        {...rest}
      >
        {mobilePlayer && <ChangePlayerLocationButton size="lg" />}
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
      </Flex>
    );
  }
);
