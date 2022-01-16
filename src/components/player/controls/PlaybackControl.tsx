import { BoxProps, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { FaStepBackward, FaPause, FaPlay, FaStepForward } from "react-icons/fa";
import { useStoreActions } from "../../../store";
import { MotionBox } from "../../common/MotionBox";

interface PlaybackControlProps extends FlexProps {
  isPlaying: boolean;
  togglePlay: () => void;
  fullPlayer?: boolean;
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
      {...rest}
    >
      {icon}
    </MotionBox>
  );
};

export const PlaybackControl = ({
  isPlaying,
  togglePlay,
  fullPlayer = false,
  ...rest
}: PlaybackControlProps) => {
  const previous = useStoreActions((actions) => actions.playback.previous);
  const next = useStoreActions((actions) => actions.playback.next);

  return (
    <Flex {...rest}>
      <PlaybackButton
        icon={<FaStepBackward size={fullPlayer ? 32 : 16} />}
        onClick={() => previous()}
        marginX={3}
      />
      <PlaybackButton
        icon={
          isPlaying ? (
            <FaPause size={fullPlayer ? 48 : 24} />
          ) : (
            <FaPlay size={fullPlayer ? 48 : 24} />
          )
        }
        onClick={togglePlay}
        padding={fullPlayer ? 6 : 3}
      />
      <PlaybackButton
        icon={<FaStepForward size={fullPlayer ? 32 : 16} />}
        onClick={() => next({ count: 1, userSkipped: true })}
        marginX={3}
      />
    </Flex>
  );
};
