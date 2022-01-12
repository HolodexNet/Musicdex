import { Flex, IconButton } from "@chakra-ui/react";
import { FaStepBackward, FaPause, FaPlay, FaStepForward } from "react-icons/fa";
import { useStoreActions } from "../../../store";

interface PlaybackControlProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

export const PlaybackControl = ({
  isPlaying,
  togglePlay,
}: PlaybackControlProps) => {
  const previous = useStoreActions((actions) => actions.playback.previous);
  const next = useStoreActions((actions) => actions.playback.next);

  return (
    <Flex alignItems="center">
      <IconButton
        aria-label="Previous Song"
        icon={<FaStepBackward />}
        variant="ghost"
        onClick={() => previous()}
      />
      <IconButton
        size="lg"
        aria-label="Play"
        icon={isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        variant="ghost"
        onClick={togglePlay}
      />
      <IconButton
        aria-label="Next Song"
        icon={<FaStepForward />}
        variant="ghost"
        onClick={() => next({ count: 1, userSkipped: true })}
      />
    </Flex>
  );
};
