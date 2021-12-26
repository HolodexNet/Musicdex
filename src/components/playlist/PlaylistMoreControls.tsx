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
        <MenuItem color="red">Menu Under Construction</MenuItem>
        {/* <MenuItem>Billing</MenuItem> */}
        <MenuDivider />
        <MenuItem onClick={() => {}}>Make Private</MenuItem>
        <MenuItem _hover={{ backgroundColor: "red.700" }}>
          Delete Playlist
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
