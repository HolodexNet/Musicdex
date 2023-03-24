import {
  Box,
  ChakraProps,
  Drawer,
  DrawerContent,
  Flex,
  Show,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation, useNavigate } from "react-router-dom";
import { useMotionValue, useTransform } from "framer-motion";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState, useStoreActions } from "../../store";
import { SongContextMenu } from "../song/SongContextMenu";
import { GlobalLoadingStatus } from "../common/GlobalLoadingStatus";
import { MotionBox } from "../common/MotionBox";
import ServiceWorkerWrapper from "../common/ServiceWorkerWrapper";
import { BottomNav } from "../nav/BottomNav";
import { NavBar } from "../nav/NavBar";
import { SidebarContent } from "../nav/Sidebar";
import { Player } from "../player/Player";
import { YoutubePlayer } from "../player/YoutubePlayer";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
import { useClient } from "../../modules/client";
import Footer from "./Footer";
import FullPlayer from "../player/FullPlayer";

const POSITIONS: { [key: string]: ChakraProps } = {
  background: {
    position: "absolute",
    h: "100%",
    w: "100%",
    zIndex: -1,
  },
  sidebar: {
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    ml: -60,
    w: 60,
    sx: {
      aspectRatio: "16 / 9",
    },
  },
  "hover-top": {
    width: "400px",
    maxWidth: "100%",
    position: "absolute",
    top: "20px",
    right: "20px",
    paddingLeft: "30px",
    zIndex: 10,
    sx: {
      aspectRatio: "16 / 9",
    },
  },
  "hover-bottom": {
    width: "400px",
    maxWidth: "100%",
    position: "absolute",
    bottom: { base: "4.5rem", md: "20px" },
    right: "20px",
    paddingLeft: "30px",
    zIndex: 10,
    sx: {
      aspectRatio: "16 / 9",
    },
  },
  "full-player": {
    position: "fixed",
    top: {
      base: "10vh",
      md: "max(calc(50vh - var(--chakra-sizes-xl) + var(--chakra-space-12)), var(--chakra-space-12))",
    },
    right: { base: undefined, md: "calc(50vw + 1rem)" },
    w: {
      base: "100vw",
      md: "min(calc(50vw - 2.5rem), calc(var(--chakra-sizes-8xl) / 2 - 2.5rem))",
      "3xl": "min(calc(50vw - 2.5rem), calc(120rem / 2 - 2.5rem))",
    },
    zIndex: 15,
    sx: {
      aspectRatio: "16 / 9",
    },
  },
  hidden: {
    display: "none",
    zIndex: -4,
    position: "absolute",
  },
};

export const FrameRef = createContext<any>(null);

// YouTubePlayer context
export const PlayerContext = createContext<
  [YouTubePlayer | null, Dispatch<SetStateAction<YouTubePlayer | null>>]
>([null, () => {}]);

export default function Frame({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = useClient();

  // Full player drag value
  const y = useMotionValue(0);
  const playerY = useTransform(y, [0, 5000], [0, 5000]);
  const opacity = useTransform(y, [0, 500], [1, 0.5]);

  const colorMode = useColorModeValue("applight", "appdark");

  const pos = useStoreState((state) => state.player.position);
  const props = useMemo(() => POSITIONS[pos], [pos]);
  const frameRef = useRef<any>(undefined);

  // START: Scroll Set to 0 every navigation
  const { pathname } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    frameRef.current?.scrollTo(0, 0);
  }, [pathname]);
  // END navigation scrolling behavior.

  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying,
  );

  const showCreateDialog = useStoreActions(
    (actions) => actions.playlist.showPlaylistCreateDialog,
  );

  // Lazy load the player, wait for first song to be played
  const [loadPlayer, setLoadPlayer] = useState(false);
  useEffect(() => {
    if (!loadPlayer && currentlyPlaying.song) setLoadPlayer(true);
  }, [currentlyPlaying.song, currentlyPlaying.repeat, loadPlayer]);

  const location = useLocation();
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, onClose]);

  // Keyboard shortcut
  // Follows spotify keyboard shortcuts
  useHotkeys(
    "ctrl+n, cmd+n, ctrl+l, cmd+l, cmd+alt+f, ctrl+p, cmd+,, ctrl+shift+w, cmd+shift+w",
    (e, handler) => {
      e.preventDefault();

      switch (handler.key) {
        case "ctrl+n":
        case "cmd+n":
          // Create new playlist
          showCreateDialog();
          break;
        case "ctrl+p":
        case "cmd+,":
          // Go to settings page
          navigate("/settings");
          break;
        case "ctrl+shift+w":
        case "cmd+shift+w":
          // Logout
          client.logout();
      }
    },
    [client],
  );

  return (
    <Box
      h="full"
      w="full"
      className={colorMode}
      bg={useColorModeValue("bg.100", "bg.900")}
      overflow="hidden"
    >
      <PlayerContext.Provider value={useState<YouTubePlayer | null>(null)}>
        <Flex direction="column" h="100%" overflow="hidden">
          {/* Generic Display: always present */}
          <NavBar
            onOpen={onOpen}
            zIndex={5}
            bg={useColorModeValue("bg.100", "bg.900")}
          />
          <GlobalLoadingStatus />
          {/* Mobile Display: (provide close method) */}
          <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full"
          >
            <DrawerContent>
              <SidebarContent onClose={onClose} closeOnNav />
            </DrawerContent>
          </Drawer>
          <Flex
            flexGrow={1}
            flexFlow="row nowrap"
            alignItems="stretch"
            overflow="hidden"
            mb={{ base: "calc(4.5rem + 56px)", md: 20 }}
          >
            <SidebarContent
              onClose={onClose}
              display={{ base: "none", lg: "flex" }}
              paddingTop="4"
            />

            <Flex
              // ml={{ base: 0, md: 60 }}
              direction="column"
              alignItems="stretch"
              h="100%"
              position="relative"
              flexGrow={1}
              flexShrink={1}
              zIndex={pos === "background" ? 0 : "auto"}
              paddingLeft="env(safe-area-inset-left)"
              paddingRight="env(safe-area-inset-right)"
            >
              <FrameRef.Provider value={frameRef}>
                <Flex
                  overflowY="scroll"
                  flex="1"
                  direction="column"
                  ref={frameRef}
                >
                  {children}
                  <Footer />
                  {/* <Box minH={pos === "hover-bottom" ? "250px" : "0px"}></Box> */}
                </Flex>
              </FrameRef.Provider>
              {loadPlayer && (
                <MotionBox
                  {...props}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    bounce: "0.2",
                    ease: "easeInOut",
                  }}
                  style={{
                    y: playerY,
                    opacity,
                  }}
                  layout
                >
                  <Box
                    visibility={pos === "background" ? "visible" : "hidden"}
                    width="100%"
                    height="100%"
                    position="absolute"
                    float="initial"
                    opacity={0.6}
                    bgColor="bg.900"
                  />
                  <YoutubePlayer />
                </MotionBox>
              )}
            </Flex>
          </Flex>
          <Flex position="fixed" w="100%" bottom={0} direction="column">
            <Player />
            <Show below="md">
              <BottomNav />
            </Show>
          </Flex>
          <FullPlayer y={y} opacity={opacity} />
          <AddToPlaylistModal />
        </Flex>
      </PlayerContext.Provider>
      <SongContextMenu />
      <ServiceWorkerWrapper />
    </Box>
  );
}
