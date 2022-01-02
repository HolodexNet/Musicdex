import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
} from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { useStoreActions } from "../../store";

export function PlaylistSongTableDropDownMenu({
  song,
  ...rest
}: Omit<MenuProps, "children"> & { song: Song }) {
  const queue = useStoreActions((store) => store.playback.queueSongs);
  const addPlaylist = useStoreActions(
    (store) => store.addPlaylist.showPlaylistAddDialog
  );
  const copyToClipboard = useClipboardWithToast();
  const navigate = useNavigate();

  return (
    <Menu
      {...rest}
      isLazy
      boundary="scrollParent"
      computePositionOnMount={true}
      gutter={10}
      placement="left"
    >
      <MenuButton
        //   py={2}
        icon={<FiMoreHorizontal />}
        as={IconButton}
        rounded="full"
        size="sm"
        mr={-2}
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
        <MenuItem
          onClick={() =>
            copyToClipboard(`${window.location.origin}/song/${song.id}`)
          }
        >
          Copy Song Link
        </MenuItem>
        <MenuItem
          onClick={() => {
            addPlaylist(song);
          }}
        >
          Add To Playlist...
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            navigate("/song/" + song.id);
          }}
        >
          Go To Song Page
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/video/" + song.video_id);
          }}
        >
          Go To Video Page
        </MenuItem>
        <MenuItem>Go to Channel Page</MenuItem>
        {/* <MenuDivider /> */}
      </MenuList>
    </Menu>
  );
}
