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
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useClient } from "../../modules/client";
import { Searchbox } from "../header/Searchbox";
import { LogoWithText } from "./LogoWithText";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export function NavBar({ onOpen, ...rest }: MobileProps) {
  const { t } = useTranslation();
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
      paddingTop="env(safe-area-inset-top)"
      boxSizing="content-box"
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
      <LogoWithText display={{ base: "none", md: "flex" }} />

      <Searchbox w={{ base: "100%", md: "40%" }} paddingX={4} />

      <HStack spacing={{ base: "0", lg: "6" }}>
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
                      {user?.username}
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
              <MenuList borderColor={borderColor}>
                <MenuItem as={Link} to="/settings">
                  {t("Profile / Settings")}
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>{t("Sign out")}</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login">
              <Button size="md" colorScheme="n2">
                {t("Login")}
              </Button>
            </Link>
          )}
        </Flex>
      </HStack>
    </Flex>
  );
}
