import {
  useDisclosure,
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Avatar,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  VStack,
  Divider,
} from "@chakra-ui/react";
import React, { ReactNode, ReactText } from "react";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMenu,
  FiBell,
  FiChevronDown,
  FiHome,
  FiHeart,
  FiClock,
  FiServer,
  FiSettings,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";
import { useClient, useClientLogin } from "../../modules/client";
import Footer from "./Footer";
import { Searchbox } from "../header/Searchbox";
import { Player } from "../player/Player";
import {
  useMyPlaylists,
  usePlaylistWriter,
} from "../../modules/services/playlist.service";
import { SidebarPlaylists } from "./SidebarPlaylists";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/" },
  { name: "Recently Played", icon: FiClock, path: "/" },
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
        <Nav onOpen={onOpen} />

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

          <Box
            // ml={{ base: 0, md: 60 }}
            overflowY="scroll"
            h="100%"
            position="relative"
            p="2"
            flexGrow={1}
            flexShrink={1}
          >
            {children}
            <Footer></Footer>
          </Box>
        </Flex>
        <Player />
      </Flex>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { user } = useClient();
  const { mutate: writePlaylist, isSuccess, isError } = usePlaylistWriter();
  const { data: playlistList, isLoading } = useMyPlaylists();

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
        mx="8"
        justifyContent="space-between"
        display={{ base: "flex", lg: "none" }}
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", lg: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem {...link}>{link.name}</NavItem>
      ))}
      <Divider my={4} />
      <NavItem
        key="playlist"
        icon={FiPlusCircle}
        onClick={createNewPlaylistHandler}
      >
        Create New Playlist
      </NavItem>
      {playlistList && <SidebarPlaylists playlistStubs={playlistList as any} />}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path?: string;
  children: ReactText;
}
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  return (
    <Link as={RouterLink} to={path || "#"} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const Nav = ({ onOpen, ...rest }: MobileProps) => {
  const { AxiosInstance, isLoggedIn, logout, user } = useClient();
  const { LoginButton } = useClientLogin();

  // const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      ml={{ base: 0 }}
      px={{ base: 4, md: 4 }}
      height="16"
      flexGrow={0}
      flexShrink={0}
      alignItems="center"
      // bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{ base: "space-between", lg: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", lg: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", lg: "flex" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <Searchbox></Searchbox>

      <HStack spacing={{ base: "0", lg: "6" }}>
        {/* You can put more icons in here tbh */}
        {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
        <Flex alignItems={"center"}>
          {isLoggedIn && user ? (
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={`https://avatars.dicebear.com/api/jdenticon/${user?.id}.svg`}
                    bg="transparent"
                  />
                  <VStack
                    display={{ base: "none", lg: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm" color="gray.300">
                      User {user?.id}
                    </Text>
                    <Text
                      textTransform="capitalize"
                      fontSize="xs"
                      color="gray.600"
                    >
                      {user?.role}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", lg: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                //bg={bgColor}
                borderColor={borderColor}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                {/* <MenuItem>Billing</MenuItem> */}
                <MenuDivider />
                <MenuItem onClick={logout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <LoginButton />
          )}
        </Flex>
      </HStack>
    </Flex>
  );
};
