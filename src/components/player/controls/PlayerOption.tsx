import { Flex, IconButton } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { useStoreActions, useStoreState } from "../../../store";
import { ChangePlayerLocationButton } from "../ChangePlayerLocationButton";

function RepeatIcon(repeatMode: string) {
  switch (repeatMode) {
    case "repeat":
      return <MdRepeat size={24} />;
    case "repeat-one":
      return <MdRepeatOne size={24} />;
    default:
      return <MdRepeat size={24} color="grey" />;
  }
}

function ShuffleIcon(shuffleMode: boolean) {
  return <MdShuffle size={24} color={shuffleMode ? "" : "grey"} />;
}

interface PlayerOptionProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export const PlayerOption = ({
  isExpanded,
  toggleExpanded,
}: PlayerOptionProps) => {
  const shuffleMode = useStoreState((state) => state.playback.shuffleMode);
  const toggleShuffleMode = useStoreActions(
    (actions) => actions.playback.toggleShuffle
  );

  const repeatMode = useStoreState((state) => state.playback.repeatMode);
  const toggleRepeatMode = useStoreActions(
    (actions) => actions.playback.toggleRepeat
  );
  return (
    <Flex alignItems="center">
      <IconButton
        aria-label="Shuffle"
        icon={ShuffleIcon(shuffleMode)}
        variant="ghost"
        onClick={() => toggleShuffleMode()}
        size="lg"
      />
      <IconButton
        aria-label="Shuffle"
        icon={RepeatIcon(repeatMode)}
        variant="ghost"
        onClick={() => toggleRepeatMode()}
        size="lg"
      />
      <ChangePlayerLocationButton />

      <IconButton
        aria-label="Expand"
        icon={isExpanded ? <FaChevronDown /> : <FaChevronUp />}
        variant="ghost"
        onClick={() => toggleExpanded()}
      />
    </Flex>
  );
};
