import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  IconButton,
} from "@chakra-ui/react";
import { FiChevronDown, FiMoreHorizontal } from "react-icons/fi";

export function PlaylistMoreControlsMenu({
  ...rest
}: Omit<MenuProps, "children">) {
  return (
    <Menu {...rest} isLazy>
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
