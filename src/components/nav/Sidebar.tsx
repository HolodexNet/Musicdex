import {
  Box,
  CloseButton,
  Divider,
  BoxProps,
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
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { NavItem } from "./NavItem";
import { OrgSelector } from "./OrgSelector";
import { useLocation } from "react-router-dom";
import { useStoreState } from "../../store";
import { AnimatePresence } from "framer-motion";

import { Flex, useColorModeValue } from "@chakra-ui/react";
import { Suspense, useMemo } from "react";
import { PlaylistList } from "../playlist/PlaylistList";
import { LogoWithText } from "./LogoWithText";
import { PlaylistCreateModal } from "../playlist/PlaylistCreateForm";
import { useTranslation } from "react-i18next";

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

export function SidebarContent({
  closeOnNav = false,
  onClose,
  ...rest
}: SidebarProps) {
  const { t } = useTranslation();
  const pages = useMemo(
    () => [
      { name: t("Recently Played"), icon: FiClock, path: "/history" },
      { name: t("Liked Songs"), icon: FiHeart, path: "/liked" },
      // { name: "My Playlists", icon: FiServer, path: "/playlists" },
      { name: t("Settings"), icon: FiSettings, path: "/settings" },
    ],
    [t]
  );
  const { user } = useClient();
  const { data: playlistList, isLoading: loadingMine } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();
  const { pathname } = useLocation();
  const isDragging = useStoreState((s) => s.dnd.dragging);
  const toast = useToast();
  const { onOpen: openModal, ...modalProps } = useDisclosure();
  return (
    <Box
      display="flex"
      flexDirection="column"
      transition="3s ease"
      bg={useColorModeValue("bg.100", "bg.900")}
      paddingTop="env(safe-area-inset-top)"
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
        <LogoWithText />
        <CloseButton onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} key={"Home"} mb={1} path="/">
        {t("Home") as string}
      </NavItem>
      <AnimatePresence>{pathname === "/" && <OrgSelector />}</AnimatePresence>
      {pages.map((page) => (
        <NavItem {...page} key={page.name} mb={1}>
          {page.name}
        </NavItem>
      ))}
      <Divider mb={2} />
      <Flex flexDirection="column" overflowY="auto" flex="1">
        <PlaylistCreateModal {...modalProps} />
        <NavItem
          key="playlist"
          icon={FiPlusCircle}
          onClick={(e) => {
            if (!user?.id)
              return toast({
                variant: "solid",
                status: "warning",
                position: "top-right",
                description: t("You need to be logged in to create playlists."),
                isClosable: true,
              });
            openModal();
          }}
          m="1"
          px="2"
          py="1"
        >
          {t("Create New Playlist") as string}
        </NavItem>
        <Suspense fallback={"..."}>
          {playlistList && (
            <PlaylistList
              playlistStubs={playlistList as any}
              vibe={isDragging}
            />
          )}
          <Divider my={2} />
          {starredList && (
            <PlaylistList
              playlistStubs={starredList as any}
              defaultIcon={FiStar}
            />
          )}
        </Suspense>
      </Flex>
    </Box>
  );
}
