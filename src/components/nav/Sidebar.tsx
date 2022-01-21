import {
  Box,
  CloseButton,
  Divider,
  BoxProps,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiClock,
  FiStar,
  FiHeart,
  FiHome,
  FiPlusCircle,
  FiSettings,
} from "react-icons/fi";
import { useClient } from "../../modules/client";
import {
  usePlaylistWriter,
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
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
import { useEffect, useRef } from "react";
import { PlaylistList } from "../playlist/PlaylistList";
import { LogoWithText } from "./LogoWithText";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  closeOnNav?: boolean;
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
  closeOnNav = false,
  onClose,
  ...rest
}: SidebarProps) {
  const { user } = useClient();
  const { data: playlistList, isLoading: loadingMine } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();
  const { pathname } = useLocation();
  const isDragging = useStoreState((s) => s.dnd.dragging);
  const { isOpen, onClose: closeModal, onOpen } = useDisclosure();
  const toast = useToast();

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
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateNewPlaylistForm />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        h="20"
        alignItems="center"
        mx="4"
        justifyContent="space-between"
        display={{ base: "flex", lg: "none" }}
      >
        <LogoWithText />
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
        onClick={(e) => {
          if (!user?.id)
            return toast({
              variant: "solid",
              status: "warning",
              description: "You need to be logged in to create playlists.",
            });

          onOpen();
        }}
      >
        Create New Playlist
      </NavItem>
      {playlistList && (
        <PlaylistList playlistStubs={playlistList as any} vibe={isDragging} />
      )}
      <Divider my={2} />
      {starredList && (
        <PlaylistList playlistStubs={starredList as any} defaultIcon={FiStar} />
      )}
    </Box>
  );
}

export default function CreateNewPlaylistForm(): JSX.Element {
  const {
    mutateAsync: writePlaylist,
    isSuccess,
    isError,
  } = usePlaylistWriter();

  const form = useRef<any>(undefined);
  const toast = useToast();
  const { user } = useClient();

  return (
    <Stack
      w={"full"}
      rounded={"xl"}
      mb={6}
      as="form"
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);
        const formProps: Record<string, string> = Object.fromEntries(
          formData
        ) as Record<string, string>;
        if (
          formProps.name.trim().length > 0 &&
          formProps.description.trim().length > 0
        ) {
          const playlist = {
            title: formProps.name,
            description: formProps.description,
            owner: user?.id,
            type: "ugp",
            content: [],
          };
          writePlaylist(playlist).then(
            () => {
              toast({
                status: "success",
                position: "top-right",
                title: "Created",
              });
            },
            () => {
              toast({
                status: "warning",
                position: "top-right",
                title: "Something went wrong",
              });
            }
          );
        } else {
          toast({
            variant: "solid",
            status: "warning",
            description: "You need to provide both name and description.",
          });
        }
      }}
    >
      {/* <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Create New Playlist
        </Heading> */}
      <FormControl id="name" isRequired>
        <FormLabel>
          Name (Can start a playlist with an emoji to set it as the icon)
        </FormLabel>
        <Input _placeholder={{ color: "gray.500" }} type="text" name="name" />
      </FormControl>
      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Input type="text" name="description" />
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
    // </Flex>
  );
}
