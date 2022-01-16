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
import { ReactNode, useMemo, useState } from "react";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState } from "../../store";
import { CommonContextMenu } from "../common/CommonContext";
import { MotionBox } from "../common/MotionBox";
import { BottomNav } from "../nav/BottomNav";
import { NavBar } from "../nav/NavBar";
import { SidebarContent } from "../nav/Sidebar";
import { Player } from "../player/Player";
import { YoutubePlayer } from "../player/YoutubePlayer";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
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
    top: "calc(40vh/2 - min(40vh, calc(100vw * .5625))/2 + 56px) ",
    left: "0",
    width: "100vw",
    h: "min(40vh, calc(100vw * .5625))",
    zIndex: 15,
  },
  hidden: {
    visibility: "hidden",
    zIndex: -4,
    position: "absolute",
  },
};

export default function Frame({ children }: { children?: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const colorMode = useColorModeValue("applight", "appdark");
  const showBottomNav = useBreakpointValue({ base: true, md: false });
  const pos = useStoreState((state) => state.player.position);

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  const props = useMemo(() => POSITIONS[pos], [pos]);

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
          zIndex={6}
          bg={useColorModeValue("bg.100", "bg.900")}
        />

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
            <SidebarContent onClose={onClose} />
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
            display={{ base: "none", lg: "block" }}
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
            // zIndex={0}
          >
            <Flex overflowY="scroll" flex="1" direction="column">
              {children}
              <Footer></Footer>
              <Box minH={pos === "hover-bottom" ? "250px" : "0px"}></Box>
            </Flex>
            <MotionBox
              {...props}
              transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
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
          </Flex>
        </Flex>
        <Player player={player} />
        {showBottomNav && <BottomNav />}
        <AddToPlaylistModal />
      </Flex>
      <CommonContextMenu />
    </Box>
  );
}
