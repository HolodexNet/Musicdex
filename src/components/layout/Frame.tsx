import {
  Box,
  ChakraProps,
  Drawer,
  DrawerContent,
  Flex,
  useBreakpointValue,
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
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation, useNavigate } from "react-router-dom";
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
    bottom: "0px",
    ml: -60,
    w: 60,
  },
  "hover-top": {
    width: "400px",
    maxWidth: "100%",
    height: "225px",
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
  },
  "hover-bottom": {
    width: "400px",
    maxWidth: "100%",
    height: "225px",
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 10,
  },
  "full-player": {
    position: "fixed",
    top: "calc(40vh/2 - min(40vh, calc(100vw * .5625))/2 + 56px + env(safe-area-inset-top))",
    left: { base: "0", lg: "6" },
    width: { base: "100vw", lg: "calc(50vw - 2.75rem)" },
    h: "min(40vh, calc(100vw * .5625))",
    zIndex: 15,
  },
  hidden: {
    display: "none",
    zIndex: -4,
    position: "absolute",
  },
};

export const FrameRef = createContext<any>(null);

export default function Frame({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = useClient();

  const colorMode = useColorModeValue("applight", "appdark");
  const showBottomNav = useBreakpointValue({
    base: true,
    md: false,
    default: false,
  });

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

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );

  const showCreateDialog = useStoreActions(
    (actions) => actions.playlist.showPlaylistCreateDialog
  );

  // Lazy load the player, wait for first song to be played
  const [loadPlayer, setLoadPlayer] = useState(false);
  useEffect(() => {
    if (!loadPlayer && currentlyPlaying.song) setLoadPlayer(true);
  }, [currentlyPlaying.song, currentlyPlaying.repeat, loadPlayer]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

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
    [client]
  );

  return (
    <Box
      h="100vh"
      w="100vw"
      className={colorMode}
      bg={useColorModeValue("bg.100", "bg.900")}
      overflow="hidden"
    >
      <Flex direction="column" h="100vh" overflow="hidden">
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
                <Footer></Footer>
                {/* <Box minH={pos === "hover-bottom" ? "250px" : "0px"}></Box> */}
              </Flex>
            </FrameRef.Provider>
            {loadPlayer && (
              <MotionBox
                {...props}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  ease: "easeInOut",
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
                ></Box>
                <YoutubePlayer onReady={onReady} />
              </MotionBox>
            )}
          </Flex>
        </Flex>
        <Player player={player} />
        {showBottomNav && <BottomNav />}
        <AddToPlaylistModal />
      </Flex>
      <SongContextMenu />
      <ServiceWorkerWrapper />
    </Box>
  );
}
