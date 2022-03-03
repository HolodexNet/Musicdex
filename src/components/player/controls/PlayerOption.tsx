import { Button, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
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
    const navigate = useNavigate();
    const location = useLocation();

    const queueActive = useMemo(() => {
      return location.pathname === "/queue";
    }, [location]);

    function toggleQueue() {
      if (queueActive) {
        navigate(-1);
      } else {
        navigate("/queue");
      }
    }

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
          icon={ShuffleIcon(shuffleMode, fullPlayer ? 36 : 20)}
          variant="ghost"
          onClick={() => toggleShuffleMode()}
        />
        {fullPlayer && (
          <Button
            leftIcon={<RiPlayList2Fill />}
            marginX={4}
            onClick={() => toggleQueue()}
          >
            Upcoming
          </Button>
        )}
        <IconButton
          aria-label="Repeat Mode"
          icon={RepeatIcon(repeatMode, fullPlayer ? 36 : 20)}
          variant="ghost"
          onClick={() => toggleRepeatMode()}
        />
        {!fullPlayer && (
          <>
            <ChangePlayerLocationButton />
            <IconButton
              aria-label="Expand"
              icon={<RiPlayList2Fill />}
              color={queueActive ? "brand.200" : "gray"}
              variant="ghost"
              onClick={() => toggleQueue()}
            />
          </>
        )}
      </Flex>
    );
  }
);
