import {
  FlexProps,
  useColorModeValue,
  Flex,
  IconButton,
  HStack,
  Button,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  Box,
  Heading,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useClient } from "../../modules/client";
import { Searchbox } from "../header/Searchbox";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export function NavBar({ onOpen, ...rest }: MobileProps) {
  const { isLoggedIn, logout, user } = useClient();

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
      <HStack>
        <Icon w={6} h={6}>
          <path
            d="M4.5 2a2 2 0 0 1 3-1.7L23 9.6a2 2 0 0 1 0 3.5L7.6 22.4a2 2 0 0 1-3-1.7V2Z"
            fill="url(#a)"
          />
          <path
            d="M0 2A2 2 0 0 1 3 .3l15.5 9.3a2 2 0 0 1 0 3.5L3.1 22.4A2 2 0 0 1 0 20.7V2Z"
            fill="url(#b)"
          />
          <defs>
            <linearGradient
              id="a"
              x1=".2"
              y1="2.8"
              x2="19.3"
              y2="18.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F06292" />
              <stop offset="1" stopColor="#FF3A81" />
            </linearGradient>
            <linearGradient
              id="b"
              x1="-4.4"
              y1="2.8"
              x2="19.5"
              y2="11.3"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5DA2F2" />
              <stop offset="1" stopColor="#715BF7" stopOpacity=".8" />
            </linearGradient>
          </defs>
        </Icon>
        <Heading
          display={{ base: "flex", lg: "flex" }}
          fontSize="2xl"
          // fontFamily="monospace"
          // fontWeight="bold"
        >
          Musicdex
        </Heading>
      </HStack>

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
                <MenuItem as={Link} to="/settings">
                  Profile
                </MenuItem>
                <MenuItem as={Link} to="/settings">
                  Settings
                </MenuItem>
                {/* <MenuItem>Billing</MenuItem> */}
                <MenuDivider />
                <MenuItem onClick={logout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login">
              <Button size="lg" colorScheme="n2">
                Login
              </Button>
            </Link>
          )}
        </Flex>
      </HStack>
    </Flex>
  );
}
