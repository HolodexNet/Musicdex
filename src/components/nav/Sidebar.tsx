import {
  Box,
  CloseButton,
  Divider,
  BoxProps,
  useToast,
  Icon,
  HStack,
  Heading,
  Spacer,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiClock,
  FiStar,
  FiHeart,
  FiHome,
  FiSettings,
  FiPlus,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import { useClient } from "../../modules/client";
import {
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { NavItem } from "./NavItem";
import { OrgSelector, useOrgPath } from "./OrgSelector";
import { useLocation } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store";
import { AnimatePresence } from "framer-motion";
import { Suspense, useMemo, useState, useCallback } from "react";
import { PlaylistList } from "../playlist/PlaylistList";
import { LogoWithText } from "./LogoWithText";
import { PlaylistCreateModal } from "../playlist/PlaylistCreateForm";
import { useTranslation } from "react-i18next";
import { BsBoxArrowRight } from "react-icons/bs";
import { HolodexLogo } from "../icons/HolodexLogo";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  closeOnNav?: boolean;
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  disabled?: boolean;
}

const HOLODEX_URL = import.meta.env.PROD
  ? "https://holodex.net"
  : "https://staging.holodex.net";

export function SidebarContent({
  closeOnNav = false,
  onClose,
  ...rest
}: SidebarProps) {
  const { t } = useTranslation();
  const pages: LinkItemProps[] = useMemo(
    () => [
      { name: t("Recently Played"), icon: FiClock, path: "/history" },
      { name: t("Liked Songs"), icon: FiHeart, path: "/liked" },
      { name: t("Settings"), icon: FiSettings, path: "/settings" },
    ],
    [t],
  );
  const { user } = useClient();
  const { data: playlistList, isLoading: loadingMine } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();
  const { pathname } = useLocation();
  const isDragging = useStoreState((s) => s.dnd.dragging);
  const toast = useToast();
  const openModal = useStoreActions(
    (actions) => actions.playlist.showPlaylistCreateDialog,
  );
  const orgPath = useOrgPath();
  const [editMode, setEditMode] = useState(false);

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
      <NavItem icon={FiHome} key={"Home"} mb={1} path={orgPath}>
        {t("Home")}
      </NavItem>
      <AnimatePresence>
        {pathname.startsWith("/org/") && <OrgSelector />}
      </AnimatePresence>
      {pages.map((page) => (
        <NavItem {...page} key={page.name} mb={1}>
          {page.name}
        </NavItem>
      ))}
      <NavItem
        icon={HolodexLogo}
        mb={1}
        as="a"
        // typescript can't figure out that as="a" allows href
        // @ts-ignore
        href={HOLODEX_URL}
      >
        Holodex <Icon as={BsBoxArrowRight} ml={2} />
      </NavItem>
      <Divider mb={2} />
      <Flex flexDirection="column" overflowY="auto" flex="1">
        <PlaylistCreateModal />
        <HStack mx={2} py={2}>
          <Heading px={2} size="sm" noOfLines={1}>
            {t("My Playlists")}
          </Heading>
          <Spacer />
          {editMode ? (
            <HStack>
              <IconButton
                aria-label={t("Save")}
                icon={<FiCheck />}
                size="sm"
                colorScheme="green"
                variant="outline"
                onClick={() => setEditMode(false)}
              />
            </HStack>
          ) : (
            <HStack spacing={1}>
              {playlistList?.length && (
                <IconButton
                  aria-label={t("Edit")}
                  icon={<FiEdit2 />}
                  size="sm"
                  colorScheme="n2"
                  variant="ghost"
                  onClick={() => setEditMode(true)}
                />
              )}
              <IconButton
                aria-label={t("Create New Playlist")}
                icon={<FiPlus />}
                size="sm"
                colorScheme="n2"
                variant="ghost"
                onClick={(e) => {
                  if (!user?.id)
                    return toast({
                      variant: "solid",
                      status: "warning",
                      position: "top-right",
                      description: t(
                        "You need to be logged in to create playlists.",
                      ),
                      isClosable: true,
                    });
                  openModal();
                }}
              />
            </HStack>
          )}
        </HStack>
        <Suspense fallback={"..."}>
          {playlistList && (
            <PlaylistList
              playlistStubs={playlistList as any}
              vibe={isDragging}
              editable={true}
              editMode={editMode}
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
