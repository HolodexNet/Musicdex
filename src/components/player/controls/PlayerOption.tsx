import { Button, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { RiPlayListFill } from "react-icons/ri";
import { useStoreActions, useStoreState } from "../../../store";
import { ChangePlayerLocationButton } from "../ChangePlayerLocationButton";

function RepeatIcon(repeatMode: string, size: number = 24) {
  switch (repeatMode) {
    case "repeat":
      return <MdRepeat size={size} />;
    case "repeat-one":
      return <MdRepeatOne size={size} />;
    default:
      return <MdRepeat size={size} color="grey" />;
  }
}

function ShuffleIcon(shuffleMode: boolean, size: number = 24) {
  return <MdShuffle size={size} color={shuffleMode ? "" : "grey"} />;
}

interface PlayerOptionProps extends FlexProps {
  fullPlayer?: boolean;
}

export const PlayerOption = React.memo(
  ({ fullPlayer = false, ...rest }: PlayerOptionProps) => {
    const isExpanded = useStoreState(
      (state) => state.player.showUpcomingOverlay
    );
    const setExpanded = useStoreActions(
      (actions) => actions.player.setShowUpcomingOverlay
    );

    const toggleExpanded = () => setExpanded(!isExpanded);

    const shuffleMode = useStoreState((state) => state.playback.shuffleMode);
    const toggleShuffleMode = useStoreActions(
      (actions) => actions.playback.toggleShuffle
    );

    const repeatMode = useStoreState((state) => state.playback.repeatMode);
    const toggleRepeatMode = useStoreActions(
      (actions) => actions.playback.toggleRepeat
    );
    return (
      <Flex align="center" {...rest}>
        <IconButton
          aria-label="Shuffle"
          icon={ShuffleIcon(shuffleMode, fullPlayer ? 36 : 24)}
          variant="ghost"
          onClick={() => toggleShuffleMode()}
          size="lg"
        />
        {fullPlayer && (
          <Button
            leftIcon={<RiPlayListFill />}
            marginX={4}
            onClick={() => toggleExpanded()}
          >
            Upcoming
          </Button>
        )}
        <IconButton
          aria-label="Repeat Mode"
          icon={RepeatIcon(repeatMode, fullPlayer ? 36 : 24)}
          variant="ghost"
          onClick={() => toggleRepeatMode()}
          size="lg"
        />
        {!fullPlayer && (
          <>
            <ChangePlayerLocationButton />
            <IconButton
              aria-label="Expand"
              icon={isExpanded ? <FaChevronDown /> : <FaChevronUp />}
              variant="ghost"
              onClick={() => toggleExpanded()}
            />
          </>
        )}
      </Flex>
    );
  }
);
