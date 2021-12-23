import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  Text,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { FiChevronDown, FiMoreHorizontal } from "react-icons/fi";

export function PlaylistMoreControlsMenu({
  ...rest
}: Omit<MenuProps, "children">) {
  return (
    <Menu {...rest}>
      <MenuButton
        py={2}
        transition="all 0.3s"
        icon={<FiMoreHorizontal />}
        as={IconButton}
        variant="ghost"
        colorScheme="n2"
        aria-label="More"
      ></MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        {/* <MenuItem>Billing</MenuItem> */}
        <MenuDivider />
        <MenuItem onClick={() => {}}>Sign out</MenuItem>
      </MenuList>
    </Menu>
  );
}
