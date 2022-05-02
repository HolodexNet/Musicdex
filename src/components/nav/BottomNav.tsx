import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FiClock, FiHeart, FiHome } from "react-icons/fi";
import { RiPlayListFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { LinkItemProps } from "./Sidebar";

export function BottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pages: LinkItemProps[] = useMemo(
    () => [
      { name: t("Home"), icon: FiHome, path: "/" },
      { name: t("Recently Played"), icon: FiClock, path: "/history" },
      { name: t("Liked Songs"), icon: FiHeart, path: "/liked" },
      { name: t("Library"), icon: RiPlayListFill, path: "/library" },
    ],
    [t]
  );
  return (
    <Flex
      minHeight="56px"
      justify="space-evenly"
      bgColor="bg.900"
      paddingBottom="calc(env(safe-area-inset-bottom)*0.5)"
      boxSizing="content-box"
    >
      {pages.map(({ name, icon, path }) => (
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          spacing={1}
          as={Link}
          to={path}
          key={path}
          color={path === pathname ? "brand.100" : "white"}
        >
          <Icon as={icon} aria-label={name} w={5} h={5} />
          <Text fontSize="xs" noOfLines={1}>
            {name}
          </Text>
        </Stack>
      ))}
    </Flex>
  );
}
