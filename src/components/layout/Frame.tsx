import {
  useDisclosure,
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FiHome, FiHeart, FiClock, FiServer, FiSettings } from "react-icons/fi";
import Footer from "./Footer";
import { Player } from "../player/Player";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
import { NavBar } from "../nav/NavBar";
import { LinkItemProps, SidebarContent } from "../nav/Sidebar";

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/" },
  { name: "Recently Played", icon: FiClock, path: "/history" },
  { name: "Liked Songs", icon: FiHeart, path: "/" },
  { name: "My Playlists", icon: FiServer, path: "/" },
  { name: "Settings", icon: FiSettings, path: "/" },
];

export default function FrameWithHeader({
  children,
}: {
  children?: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      h="100vh"
      w="100vw"
      bg={useColorModeValue("bg.100", "bg.900")}
      overflow="hidden"
    >
      <Flex direction="column" h="100vh" overflow="hidden">
        {/* Generic Display: always present */}
        <NavBar onOpen={onOpen} />

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
            <SidebarContent onClose={onClose} linkItems={LinkItems} />
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
            linkItems={LinkItems}
          />

          <Flex
            // ml={{ base: 0, md: 60 }}
            direction="column"
            alignItems="stretch"
            overflowY="scroll"
            h="100%"
            position="relative"
            flexGrow={1}
            flexShrink={1}
          >
            {children}
            <Footer></Footer>
          </Flex>
        </Flex>
        <Player />
        <AddToPlaylistModal />
      </Flex>
    </Box>
  );
}
