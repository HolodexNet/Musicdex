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

export function SongTableDropDownMenu({
  ...rest
}: Omit<MenuProps, "children">) {
  return (
    <Menu {...rest} isLazy>
      <MenuButton
        //   py={2}
        icon={<FiMoreHorizontal />}
        as={IconButton}
        rounded="full"
        variant="ghost"
        colorScheme="n2"
        aria-label="More"
      ></MenuButton>
      <MenuList>
        <MenuItem>Add to Queue</MenuItem>
        <MenuItem>Share Link</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => {}}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
