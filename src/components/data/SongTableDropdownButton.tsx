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
import { useStoreActions } from "../../store";

export function PlaylistSongTableDropDownMenu({
  song,
  ...rest
}: Omit<MenuProps, "children"> & { song: Song }) {
  const queue = useStoreActions((store) => store.playback.queueSongs);

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
        <MenuItem
          onClick={() => {
            queue({ songs: [song], immediatelyPlay: true });
          }}
        >
          Play Now
        </MenuItem>
        <MenuItem
          onClick={() => {
            queue({ songs: [song], immediatelyPlay: false });
          }}
        >
          Add to Queue
        </MenuItem>
        <MenuItem>Copy Song Link</MenuItem>
        <MenuItem>Add To Playlist...</MenuItem>
        <MenuDivider />
        <MenuItem>Go To Song Page</MenuItem>
        <MenuItem>Go To Video Page</MenuItem>
        <MenuItem>Go to Channel Page</MenuItem>
        {/* <MenuDivider /> */}
      </MenuList>
    </Menu>
  );
}
