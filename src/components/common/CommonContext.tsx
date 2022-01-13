import { Icon, Menu } from "@chakra-ui/react";
import {
  Item,
  Separator,
  ItemParams,
  Menu as CMenu,
  Submenu,
} from "react-contexify";
import { FiCopy } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { useStoreActions } from "../../store";

export const DEFAULT_MENU_ID = "r1";

export const CommonContextMenu = () => {
  const showAddDialog = useStoreActions(
    (action) => action.addPlaylist.showPlaylistAddDialog
  );

  const copyToClipboard = useClipboardWithToast();

  const navigate = useNavigate();
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  return (
    <CMenu id={DEFAULT_MENU_ID} theme="dark" animation="fade">
      <Item
        onClick={(x: ItemParams) => {
          queueSongs({ songs: [x.props], immediatelyPlay: false });
        }}
      >
        Add to queue
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          copyToClipboard(`${window.location.origin}/song/${x.props.id}`);
        }}
      >
        Copy Song Link
      </Item>
      <Submenu label="Select and Copy">
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(x.props.name);
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> Song Name
        </Item>
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(x.props.original_artist);
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> Original Artist
        </Item>
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(
              `https://youtu.be/${x.props.video_id}?t=${x.props.start}`
            );
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> Timestamped Youtube Link
        </Item>
      </Submenu>
      <Item
        onClick={(x: ItemParams) => {
          showAddDialog(x.props);
        }}
      >
        Add To Playlist...
      </Item>
      <Separator />
      <Item
        onClick={(x: ItemParams) => {
          navigate("/song/" + x.props.id);
        }}
      >
        Go To Song Page
      </Item>
      <Item onClick={(x: ItemParams) => navigate("/video/" + x.props.video_id)}>
        Go To Video Page
      </Item>
      <Item
        onClick={(x: ItemParams) => navigate(`/channel/${x.props.channel_id}/`)}
      >
        Go To Channel Page
      </Item>
    </CMenu>
  );
};
