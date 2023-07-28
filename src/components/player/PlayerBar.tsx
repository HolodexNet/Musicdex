import {
  Box,
  Flex,
  useBreakpointValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { LayoutGroup } from "framer-motion";
import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store";
import { MotionBox } from "../common/MotionBox";
import { PlaybackControl } from "./controls/PlaybackControl";
import { PlayerOption } from "./controls/PlayerOption";
import { SongInfo } from "./controls/PlayerSongInfo";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import TimeInfo from "./controls/TimeInfo";

export const PlayerBar = React.memo(() => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song,
  );

  const fullPlayer = useStoreState((state) => state.player.fullPlayer);
  const setFullPlayer = useStoreActions((store) => store.player.setFullPlayer);
  const setPos = useStoreActions((store) => store.player.setOverridePosition);
  const location = useLocation();

  useEffect(() => {
    if (fullPlayer) {
      toggleFullPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const toggleFullPlayer = useCallback(() => {
    setFullPlayer(!fullPlayer);
    if (fullPlayer) {
      setPos(undefined);
    } else {
      setPos("full-player");
    }
  }, [fullPlayer, setFullPlayer, setPos]);

  const handlePlayerbarClick = useCallback(
    (e: any) => {
      if (
        currentSong &&
        isMobile &&
        e?.target?.className &&
        typeof e.target.className === "string" &&
        e?.target?.className.split(" ").length === 1
      )
        toggleFullPlayer();
    },
    [currentSong, isMobile, toggleFullPlayer],
  );

  const handleSongInfoClick = useCallback(
    (e: any) => {
      if (isMobile) {
        e.preventDefault();
        e.stopPropagation();
        toggleFullPlayer();
      }
    },
    [isMobile, toggleFullPlayer],
  );

  return (
    <Flex direction="column" bg="bg.800" h={{ base: "4.5rem", md: 20 }}>
      <TimeSlider mt="-3.5px" />
      <Flex
        w="full"
        py={isMobile ? 1 : 2}
        align="center"
        onClickCapture={handlePlayerbarClick}
      >
        <LayoutGroup>
          <MotionBox
            display="flex"
            flex="1"
            alignItems="center"
            mr="auto"
            pl={{ base: 2, sm: 5 }}
          >
            {currentSong && (
              <SongInfo
                song={currentSong}
                onClickCapture={handleSongInfoClick}
              />
            )}
          </MotionBox>
          <MotionBox
            display="flex"
            flex={{ base: 0, sm: 1 }}
            alignItems="center"
            justifyContent={{ base: "flex-end", sm: "center" }}
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PlaybackControl />
          </MotionBox>
          <HStack
            flex={{ base: 0, sm: 1 }}
            paddingRight={{ base: 0, sm: 3 }}
            marginLeft="auto"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box width={36} mr={2} display={{ base: "none", md: "block" }}>
              <VStack spacing={0}>
                <VolumeSlider />
                <TimeInfo />
              </VStack>
            </Box>
            <PlayerOption display={{ base: "none", sm: "flex" }} />
          </HStack>
        </LayoutGroup>
      </Flex>
    </Flex>
  );
});
