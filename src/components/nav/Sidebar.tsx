import { Box, CloseButton, Divider, BoxProps, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiClock,
  FiStar,
  FiHeart,
  FiHome,
  FiPlusCircle,
  FiServer,
  FiSettings,
} from "react-icons/fi";
import { useClient } from "../../modules/client";
import {
  usePlaylistWriter,
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { SidebarPlaylists } from "./SidebarPlaylists";
import { NavItem } from "./NavItem";
import { OrgSelector } from "./OrgSelector";
import { useLocation } from "react-router-dom";
import { useStoreState } from "../../store";
import { AnimatePresence } from "framer-motion";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  linkItems?: LinkItemProps[];
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  disabled?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  // { name: "Home", icon: FiHome, path: "/" },
  { name: "Recently Played", icon: FiClock, path: "/history" },
  { name: "Liked Songs", icon: FiHeart, path: "/liked" },
  // { name: "My Playlists", icon: FiServer, path: "/playlists" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

export function SidebarContent({
  linkItems = LinkItems,
  onClose,
  ...rest
}: SidebarProps) {
  const { user } = useClient();
  const { mutate: writePlaylist, isSuccess, isError } = usePlaylistWriter();
  const { data: playlistList, isLoading: loadingMine } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();
  const { pathname } = useLocation();
  const isDragging = useStoreState((s) => s.dnd.dragging);

  const createNewPlaylistHandler = async () => {
    if (!user?.id) return alert("You must be logged in to create Playlists");

    const playlist: Partial<WriteablePlaylist> = {};
    const name = prompt("Create Playlist: Title of Playlist:");
    if (!name) return alert("Please enter a title.");
    playlist.title = name;
    const description = prompt("Create Playlist: Description of Playlist:");
    playlist.description = description || "";
    playlist.owner = user?.id;
    playlist.type = "ugp";
    playlist.content = [];

    writePlaylist(playlist);
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("bg.100", "bg.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", lg: 60 }}
      flexShrink={0}
      // pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="4"
        justifyContent="space-between"
        display={{ base: "flex", lg: "none" }}
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", lg: "none" }} onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} key={"Home"} mb={4} path="/">
        Home
      </NavItem>
      <AnimatePresence>{pathname === "/" && <OrgSelector />}</AnimatePresence>
      {linkItems.map((link) => (
        <NavItem {...link} key={link.name} mb={4}>
          {link.name}
        </NavItem>
      ))}
      <Divider mb={2} />
      <NavItem
        key="playlist"
        icon={FiPlusCircle}
        onClick={createNewPlaylistHandler}
      >
        Create New Playlist
      </NavItem>
      {playlistList && (
        <SidebarPlaylists
          playlistStubs={playlistList as any}
          vibe={isDragging}
        />
      )}
      <Divider my={2} />
      {starredList && (
        <SidebarPlaylists
          playlistStubs={starredList as any}
          defaultIcon={FiStar}
        />
      )}
    </Box>
  );
}

export default function CreateNewPlaylistForm(): JSX.Element {
  const { mutate: writePlaylist, isSuccess, isError } = usePlaylistWriter();

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
        as="form"
        onSubmit={(e) => alert(JSON.stringify(e))}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Create New Playlist
        </Heading>
        <FormControl id="name" isRequired>
          <FormLabel>
            Name (Can start a playlist with an emoji to set it as the icon)
          </FormLabel>
          <Input
            placeholder="Playlist Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Input type="text" />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"green.400"}
            color={"white"}
            _hover={{
              bg: "green.500",
            }}
            type="submit"
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
