import {
  HStack,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Menu,
  Link,
  Text,
} from "@chakra-ui/react";
import { useContextMenu } from "react-contexify";
import { FaPlay } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useClipboardWithToast } from "../../../modules/common/clipboard";
import useNamePicker from "../../../modules/common/useNamePicker";
import { useStoreActions } from "../../../store";
import { DEFAULT_MENU_ID } from "../../common/CommonContext";
import { SongArtwork } from "../../song/SongArtwork";

interface SongInfoProps {
  song: Song;
}
export const SongInfo = ({ song }: SongInfoProps) => {
  const copyToClipboard = useClipboardWithToast();
  const navigate = useNavigate();
  const addPlaylist = useStoreActions(
    (a) => a.addPlaylist.showPlaylistAddDialog
  );
  const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
  const tn = useNamePicker();

  return (
    <HStack onContextMenu={show}>
      <Menu
        eventListeners={{ scroll: false }}
        isLazy
        boundary="scrollParent"
        gutter={10}
        placement="top-start"
      >
        <MenuButton position="relative">
          <SongArtwork song={song} size={50} marginRight={2} />
        </MenuButton>
        <MenuList>
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
          <MenuItem
            onClick={() => {
              navigate("/channel/" + song.channel_id);
            }}
          >
            Go to Channel Page
          </MenuItem>
          {/* <MenuDivider /> */}
        </MenuList>
      </Menu>

      <Box>
        <Link
          as={NavLink}
          to={`/song/${song.id}`}
          // display="inline-block"
        >
          <Text fontWeight={500} noOfLines={1}>
            {song.name}
          </Text>
        </Link>
        <Link as={NavLink} to={`/channel/${song.channel_id}`}>
          <Text noOfLines={1} opacity={0.66}>
            {tn(song.channel.english_name, song.channel.name)}
          </Text>
        </Link>
      </Box>
    </HStack>
  );
};
