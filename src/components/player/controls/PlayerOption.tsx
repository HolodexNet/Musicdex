import {
  Button,
  Flex,
  FlexProps,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { FiMaximize2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import { useStoreActions, useStoreState } from "../../../store";
import { ChangePlayerLocationButton } from "../ChangePlayerLocationButton";

export function RepeatIcon(repeatMode: string, size: number = 24) {
  switch (repeatMode) {
    case "repeat":
      return <MdRepeat size={size} />;
    case "repeat-one":
      return <MdRepeatOne size={size} />;
    default:
      return <MdRepeat size={size} color="grey" />;
  }
}

export function ShuffleIcon(shuffleMode: boolean, size: number = 24) {
  return <MdShuffle size={size} color={shuffleMode ? "" : "grey"} />;
}

interface PlayerOptionProps extends FlexProps {
  fullPlayer?: boolean;
  toggleFullPlayer?: () => void;
}

export const PlayerOption = React.memo(
  ({ fullPlayer = false, ...rest }: PlayerOptionProps) => {
    const { t } = useTranslation();
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

    const setFullPlayer = useStoreActions(
      (store) => store.player.setFullPlayer
    );
    const setPos = useStoreActions((store) => store.player.setOverridePosition);
    const displayFullscreenButton = useBreakpointValue({
      base: false,
      lg: true,
    });

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
            {t("Upcoming")}
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
            {displayFullscreenButton && (
              <IconButton
                aria-label="Fullscreen"
                icon={<FiMaximize2 />}
                color="gray"
                variant="ghost"
                onClick={() => {
                  setFullPlayer(true);
                  setPos("full-player");
                }}
              />
            )}
          </>
        )}
      </Flex>
    );
  }
);
