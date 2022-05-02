import {
  Box,
  Flex,
  Button,
  IconButton,
  Heading,
  Text,
  useBreakpoint,
  useBreakpointValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link as navLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { MotionBox } from "../common/MotionBox";
import { PlaybackControl } from "./controls/PlaybackControl";
import { PlayerOption } from "./controls/PlayerOption";
import { SongInfo } from "./controls/PlayerSongInfo";
import { SongLink } from "./controls/PlayerSongLink";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import { SongTable } from "../data/SongTable";
import { QUEUE_MENU_ID } from "../song/SongContextMenu";

interface PlayerBarProps {
  progress: number;
  onProgressChange: (e: number) => void;
  currentSong: Song | undefined;
  isPlaying: boolean;
  togglePlay: () => void;
  seconds: string;
  volume: number;
  onVolumeChange: (e: number) => void;
  totalDuration: number;
}

const springTransition = { type: "spring", stiffness: 350, damping: 23 };

export const PlayerBar = React.memo(
  ({
    progress,
    onProgressChange,
    currentSong,
    isPlaying,
    togglePlay,
    seconds,
    volume,
    onVolumeChange,
    totalDuration,
  }: PlayerBarProps) => {
    const { t } = useTranslation();
    const fullPlayer = useStoreState((state) => state.player.fullPlayer);
    const setFullPlayer = useStoreActions(
      (store) => store.player.setFullPlayer
    );
    const setPos = useStoreActions((store) => store.player.setOverridePosition);
    const location = useLocation();
    const breakpoint = useBreakpoint();

    const [dragStartY, setDragStartY] = useState(0);
    const canEnlarge = useBreakpointValue({ base: true, lg: false });

    const queue = useStoreState((state) => state.playback.queue);
    const playlistQueue = useStoreState(
      (state) => state.playback.playlistQueue
    );
    const playedPlaylistQueue = useStoreState(
      (state) => state.playback.playedPlaylistQueue
    );
    const playlistTotalQueue = useMemo(() => {
      return [...playlistQueue, ...playedPlaylistQueue];
    }, [playedPlaylistQueue, playlistQueue]);
    const next = useStoreActions((actions) => actions.playback.next);

    useEffect(() => {
      if (fullPlayer) {
        toggleFullPlayer();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    function toggleFullPlayer() {
      setFullPlayer(!fullPlayer);
      if (fullPlayer) {
        setPos(undefined);
      } else {
        setPos("full-player");
      }
    }

    function handlePlayerbarClick(e: any) {
      if (
        e?.target?.className &&
        typeof e.target.className === "string" &&
        e?.target?.className.split(" ").length === 1 &&
        canEnlarge &&
        currentSong
      ) {
        toggleFullPlayer();
      }
    }

    function handleSongInfoClick(e: any) {
      if (breakpoint === "base") {
        e.preventDefault();
        e.stopPropagation();
        toggleFullPlayer();
      }
    }

    return (
      <PlayerContainer expanded={fullPlayer} dense={breakpoint === "base"}>
        {!fullPlayer && (
          <>
            <TimeSlider
              progress={progress}
              onChange={onProgressChange}
              totalDuration={totalDuration}
              marginTop="-4px"
              marginBottom="-3px"
            />
            <MotionBox className="main" onClickCapture={handlePlayerbarClick}>
              <LayoutGroup>
                <MotionBox
                  display="flex"
                  flex="1"
                  alignItems="center"
                  marginRight="auto"
                  paddingLeft={{ base: 2, sm: 5 }}
                  layout
                  transition={springTransition}
                  layoutId="songInfo"
                  // JUNKY BUG FIX for framer... randomly shifts top and applies transform
                  // These two initial/animate does nothing but hints at framer to not apply transforms
                  initial={{ opacity: 0, y: "0px" }}
                  animate={{ opacity: 1, y: 0 }}
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
                  <PlaybackControl
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    mobilePlayer={breakpoint === "base"}
                  />
                </MotionBox>
                <Flex
                  flex={{ base: 0, sm: 1 }}
                  paddingRight={{ base: 0, sm: 3 }}
                  marginLeft="auto"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Box
                    width={36}
                    mr={2}
                    display={{ base: "none", md: "block" }}
                  >
                    <VStack spacing={-1}>
                      <VolumeSlider volume={volume} onChange={onVolumeChange} />
                      <Text
                        fontSize=".85em"
                        display="inline-block"
                        opacity={0.5}
                      >
                        <span>{seconds}</span> /{" "}
                        <span>{formatSeconds(totalDuration)}</span>
                      </Text>
                    </VStack>
                  </Box>
                  <PlayerOption display={{ base: "none", sm: "flex" }} />
                </Flex>
              </LayoutGroup>
            </MotionBox>
          </>
        )}
        <AnimatePresence>
          {fullPlayer && (
            <>
              <MotionBox
                padding={6}
                paddingTop={3}
                display={{ base: "flex", lg: "none" }}
                flex="1"
                flexDirection="column"
                justifyContent="space-evenly"
                exit={{ opacity: 0, pointerEvents: "none" }}
                drag="y"
                whileDrag={{ opacity: 0.9 }}
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragStart={(event: any, info: any) => {
                  setDragStartY(info.point.y);
                }}
                onDragEnd={(event: any, info: any) => {
                  if (info.point.y - dragStartY > 180) {
                    toggleFullPlayer();
                  }
                }}
              >
                <LayoutGroup>
                  <IconButton
                    aria-label="Close Full Player"
                    onClick={() => toggleFullPlayer()}
                    icon={<FaChevronDown size={20} />}
                    variant="ghost"
                    size="lg"
                    margin={2}
                    position="absolute"
                    left={0}
                    top="env(safe-area-inset-top)"
                  ></IconButton>
                  <MotionBox
                    layout
                    layoutId="songInfo"
                    transition={springTransition}
                    marginTop="calc(40vh + 56px)"
                  >
                    {currentSong && (
                      <SongInfo song={currentSong} fullPlayer={true} />
                    )}
                  </MotionBox>

                  <TimeSlider
                    progress={progress}
                    onChange={onProgressChange}
                    totalDuration={totalDuration}
                    fullPlayer={true}
                    marginY={6}
                  />

                  <MotionBox
                    initial={{ opacity: 0, y: "30vh", scale: 0.1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    // transition={{ ease: "easeOut", duration: 0.3 }}
                    transition={springTransition}
                  >
                    <PlaybackControl
                      isPlaying={isPlaying}
                      togglePlay={togglePlay}
                      fullPlayer={true}
                      justifyContent="space-around"
                      flexGrow={1}
                    />
                  </MotionBox>
                  <Box
                    bgGradient="linear-gradient(
                    to bottom,
                    var(--chakra-colors-brand-300) 30%,
                    var(--chakra-colors-n2-300) 80%
                  );"
                    backgroundSize="cover"
                    backgroundPosition="center"
                    zIndex={-1}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    opacity={0.25}
                  />
                  <MotionBox
                    initial={{ opacity: 0, y: "20vh" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springTransition}
                  >
                    <PlayerOption justifyContent="center" fullPlayer={true} />
                  </MotionBox>
                </LayoutGroup>
              </MotionBox>
              <MotionBox
                padding={6}
                paddingTop={3}
                paddingBottom="env(safe-area-inset-bottom)"
                display={{ base: "none", lg: "flex" }}
                maxH="100%"
                maxW="100vw"
                flex="1"
                flexDirection="column"
                justifyContent="space-evenly"
                exit={{ opacity: 0, pointerEvents: "none" }}
              >
                <LayoutGroup>
                  <IconButton
                    aria-label="Close Full Player"
                    onClick={() => toggleFullPlayer()}
                    icon={<FaChevronDown size={20} />}
                    variant="ghost"
                    size="lg"
                    margin={2}
                    position="absolute"
                    left={0}
                    top="env(safe-area-inset-top)"
                  />
                  <HStack maxH="90vh" w="100%" gap={8}>
                    <Flex
                      w="100%"
                      h="100%"
                      justifyContent="space-between"
                      direction="column"
                    >
                      <MotionBox
                        layout
                        layoutId="songInfo"
                        transition={springTransition}
                        marginTop="min(calc(40vh + 56px), calc(100vw * .5625 + 56px))"
                      >
                        {currentSong && (
                          <SongInfo song={currentSong} fullPlayer={true} />
                        )}
                      </MotionBox>

                      <TimeSlider
                        progress={progress}
                        onChange={onProgressChange}
                        totalDuration={totalDuration}
                        fullPlayer={true}
                        marginY={6}
                      />
                      <MotionBox
                        initial={{ opacity: 0, y: "30vh", scale: 0.1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        // transition={{ ease: "easeOut", duration: 0.3 }}
                        transition={springTransition}
                      >
                        <PlaybackControl
                          isPlaying={isPlaying}
                          togglePlay={togglePlay}
                          fullPlayer={true}
                          justifyContent="space-around"
                          flexGrow={1}
                        />
                      </MotionBox>
                      <MotionBox
                        initial={{ opacity: 0, y: "20vh" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springTransition}
                      >
                        {currentSong && (
                          <SongLink
                            song={currentSong}
                            w="100%"
                            h="100%"
                            pt={3}
                          />
                        )}
                      </MotionBox>
                    </Flex>
                    <VStack w="100%" h="90vh" maxH="90vh" align="flex-start">
                      <Heading my={6} size="lg">
                        {t("Upcoming")}
                      </Heading>
                      <Suspense fallback={<div>{t("Loading...")}</div>}>
                        <Box w="100%" h="100%" maxH="100%" overflowY="auto">
                          {queue && queue.length > 0 && (
                            <SongTable
                              songs={queue}
                              menuId={QUEUE_MENU_ID}
                              rowProps={{
                                songClicked: (e, song, idx) =>
                                  next({ count: idx + 1, userSkipped: true }),
                                indexShift: queue.length,
                                hideCol: ["idx", "og_artist", "sang_on"],
                              }}
                            />
                          )}
                          {playlistTotalQueue && playlistTotalQueue.length > 0 && (
                            <SongTable
                              songs={playlistTotalQueue}
                              rowProps={{
                                songClicked: (e, song, idx) =>
                                  next({
                                    count: queue.length + idx + 1,
                                    userSkipped: true,
                                  }),
                                hideCol: ["idx", "og_artist", "sang_on"],
                              }}
                            />
                          )}
                          {queue.length === 0 &&
                            playlistTotalQueue.length === 0 && (
                              <Flex
                                w="100%"
                                h="100%"
                                direction="column"
                                align="center"
                                justify="center"
                              >
                                <Heading my={2} size="md" color="gray.500">
                                  {t("No Songs")}
                                </Heading>
                                <Button as={navLink} to="/" variant="ghost">
                                  {t("Return to Home")}
                                </Button>
                              </Flex>
                            )}
                        </Box>
                      </Suspense>
                    </VStack>
                  </HStack>
                  <Box
                    bgGradient="linear-gradient(
                    to bottom,
                    var(--chakra-colors-brand-300) 30%,
                    var(--chakra-colors-n2-300) 80%
                  );"
                    backgroundSize="cover"
                    backgroundPosition="center"
                    zIndex={-1}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    opacity={0.25}
                  />
                </LayoutGroup>
              </MotionBox>
            </>
          )}
        </AnimatePresence>
      </PlayerContainer>
    );
  }
);
// const MemoizedPlayerBarLower = React.memo(PlayerBar);

const PlayerContainer = styled.div<{
  expanded: boolean;
  backgroundUrl?: string;
  dense?: boolean;
}>`
  height: ${({ expanded, dense }) =>
    expanded ? "100vh" : dense ? "64px" : "80px"};
  position: ${({ expanded }) => (expanded ? "absolute" : "relative")};
  /* padding-top: ${({ expanded }) =>
    expanded ? "calc(env(safe-area-inset-top))" : "0"};
    padding-bottom: env(safe-area-inset-top); */
  background: var(--chakra-colors-bg-800);

  width: 100%;
  flex-basis: 1;
  flex-shrink: 0;
  bottom: 0;
  transition: all 0.3s ease-out;
  flex-direction: column;
  display: flex;
  z-index: 10;

  .main {
    display: flex;
    width: 100%;
    align-items: center;
    /* Need static margin, cuz Framer motion is miscalculating layout */
    margin-top: ${({ dense }) => (dense ? "3.5px" : "11.5px")};
  }
`;
