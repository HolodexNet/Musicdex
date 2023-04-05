import {
  AspectRatio,
  Container,
  VStack,
  Heading,
  Box,
  Flex,
  Button,
  StackProps,
  Slide,
  useBreakpointValue,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { MotionValue, PanInfo } from "framer-motion";
import React, { Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiMinimize2, FiMinus } from "react-icons/fi";
import { Link as NavLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store";
import { MotionBox } from "../common/MotionBox";
import { UpcomingSongList } from "../data/SongTable/UpcomingSongList";
import { PlaybackControl } from "./controls/PlaybackControl";
import { PlayerOption } from "./controls/PlayerOption";
import { SongInfo } from "./controls/PlayerSongInfo";
import { TimeSlider } from "./controls/TimeSlider";

interface FullPlayerProps {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

const FullPlayer = React.memo(({ y, opacity }: FullPlayerProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song,
  );

  const fullPlayer = useStoreState((state) => state.player.fullPlayer);
  const setFullPlayer = useStoreActions((store) => store.player.setFullPlayer);
  const setPos = useStoreActions((store) => store.player.setOverridePosition);

  const onClose = useCallback(() => {
    setPos(undefined);
    setFullPlayer(false);
  }, [setFullPlayer, setPos]);

  return (
    <Slide
      direction="bottom"
      in={fullPlayer}
      style={{
        top: 0,
        zIndex: 10,
        background:
          "linear-gradient(to bottom, var(--chakra-colors-brand-300) 30%, var(--chakra-colors-n2-300) 90%)",
        opacity,
      }}
    >
      <MotionBox
        backdropFilter="auto"
        backdropBrightness="40%"
        w="full"
        h="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        dragMomentum={false}
        onDragEnd={(event: any, info: PanInfo) => {
          if (info.offset.y > 180) {
            onClose();
          }
        }}
        style={{ y }}
      >
        <Container
          display="grid"
          gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gridTemplateRows="repeat(1, 1fr)"
          gap={{ base: 0, md: 8 }}
          px={6}
          pt={{ base: "max(env(safe-area-inset-top), 1.5rem)", md: 12 }}
          pb={{ base: "max(env(safe-area-inset-bottom), 1.5rem)", md: 12 }}
          h="full"
          maxH="6xl"
          maxW={{ md: "8xl", "3xl": "120rem" }}
        >
          <VStack w="full" align="flex-start">
            {isMobile && (
              <IconButton
                aria-label="close full player"
                icon={<Icon as={FiMinus} boxSize={8} />}
                size="sm"
                w="100%"
                variant="ghost"
                onClick={() => {
                  setFullPlayer(false);
                  setPos(undefined);
                }}
              />
            )}
            {/* YouTube frame space */}
            <AspectRatio w="100%" pt={{ base: "10vh", md: 0 }} ratio={16 / 9}>
              <Box />
            </AspectRatio>
            <VStack
              w="100%"
              h="100%"
              maxH="30vh"
              align="flex-start"
              justify="space-evenly"
            >
              <MotionBox>
                {currentSong && <SongInfo fullPlayer song={currentSong} />}
              </MotionBox>
              <TimeSlider fullPlayer my={6} />
              <MotionBox
                w="100%"
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PlaybackControl
                  fullPlayer
                  w="100%"
                  justifyContent="space-around"
                />
              </MotionBox>
              {isMobile && (
                <MotionBox w="100%">
                  <PlayerOption fullPlayer justifyContent="center" />
                </MotionBox>
              )}
              {/* <div></div>
              <div></div>  */}
              {/* Just some empty boxes to push the controls closer together?*/}
            </VStack>
          </VStack>
          {!isMobile && <PlayerBarExpandedRightSide />}
        </Container>
      </MotionBox>
    </Slide>
  );
});

const PlayerBarExpandedRightSide = React.memo(({ ...rest }: StackProps) => {
  const { t } = useTranslation();

  const queue = useStoreState((state) => state.playback.queue);
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const playlist = useStoreState((state) => state.playback.currentPlaylist);
  const next = useStoreActions((actions) => actions.playback.next);
  const setFullPlayer = useStoreActions((store) => store.player.setFullPlayer);
  const setOverridePos = useStoreActions(
    (store) => store.player.setOverridePosition,
  );

  return (
    <VStack w="full" h="full" align="flex-start" {...rest}>
      <Heading size="lg">{t("Upcoming")}</Heading>
      <Suspense fallback={<div>{t("Loading...")}</div>}>
        <Box w="100%" h="100%" maxH="100%">
          {queue.length === 0 && playlistQueue.length === 0 ? (
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
              <Button as={NavLink} to="/" variant="ghost">
                {t("Return to Home")}
              </Button>
            </Flex>
          ) : (
            <UpcomingSongList
              songs={playlistQueue}
              queue={queue}
              playlist={playlist}
              rowProps={{
                songClicked: (e, song, idx) =>
                  next({ count: idx + 1, userSkipped: true }),
              }}
            />
          )}
        </Box>
      </Suspense>
      <IconButton
        aria-label="close full player"
        icon={<Icon as={FiMinimize2} boxSize={6} />}
        onClick={() => {
          setFullPlayer(false);
          setOverridePos(undefined);
        }}
        size="lg"
        variant="ghost"
        alignSelf="end"
      />
    </VStack>
  );
});

export default FullPlayer;
