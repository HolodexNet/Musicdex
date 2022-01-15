import {
  Box,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { useContextMenu } from "react-contexify";
import { NavLink, useNavigate } from "react-router-dom";
import { useClipboardWithToast } from "../../../modules/common/clipboard";
import useNamePicker from "../../../modules/common/useNamePicker";
import { useStoreActions } from "../../../store";
import { DEFAULT_MENU_ID } from "../../common/CommonContext";
import { SongArtwork } from "../../song/SongArtwork";

interface SongInfoProps extends StackProps {
  song: Song;
  fullPlayer?: boolean;
}
export const SongInfo = ({
  song,
  fullPlayer = false,
  ...rest
}: SongInfoProps) => {
  const copyToClipboard = useClipboardWithToast();
  const navigate = useNavigate();
  const addPlaylist = useStoreActions(
    (a) => a.addPlaylist.showPlaylistAddDialog
  );
  const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
  const tn = useNamePicker();

  return (
    <HStack onContextMenu={show} {...rest}>
      <Menu
        eventListeners={{ scroll: false }}
        isLazy
        boundary="scrollParent"
        gutter={10}
        placement={fullPlayer ? "bottom-end" : "top-start"}
      >
        <MenuButton position="relative">
          <SongArtwork
            song={song}
            size={fullPlayer ? 70 : 50}
            marginRight={2}
            resizeHint={70}
          />
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
        {/* <Link as={NavLink} to={`/song/${song.id}`}> */}
        <Text
          fontWeight={fullPlayer ? 600 : 500}
          noOfLines={fullPlayer ? 2 : 1}
          fontSize={fullPlayer ? "lg" : "md"}
        >
          {song.name}
        </Text>
        {/* </Link> */}
        {/* <Link as={NavLink} to={`/channel/${song.channel_id}`}> */}
        <Text
          noOfLines={fullPlayer ? 2 : 1}
          opacity={0.66}
          fontSize={fullPlayer ? "lg" : "md"}
        >
          {tn(song.channel.english_name, song.channel.name)}
        </Text>
        {/* </Link> */}
      </Box>
    </HStack>
  );
};
