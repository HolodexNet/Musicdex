import { Icon, Menu } from "@chakra-ui/react";
import {
  Item,
  Separator,
  ItemParams,
  Menu as CMenu,
  Submenu,
} from "react-contexify";
import { BiListPlus } from "react-icons/bi";
import { BsInputCursorText } from "react-icons/bs";
import {
  FiChevronRight,
  FiCopy,
  FiFolderPlus,
  FiLink,
  FiPlusCircle,
} from "react-icons/fi";
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
        <Icon mr={2} as={BiListPlus}></Icon> Add to Queue
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          showAddDialog(x.props);
        }}
      >
        <Icon mr={2} as={FiFolderPlus}></Icon> Add To Playlist...
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          copyToClipboard(`${window.location.origin}/song/${x.props.id}`);
        }}
      >
        <Icon mr={2} as={FiLink}></Icon> Share Song
      </Item>
      <Submenu
        label={
          <>
            <Icon mr={2} as={BsInputCursorText}></Icon>Select and Copy
          </>
        }
      >
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
      <Separator />
      <Item
        onClick={(x: ItemParams) => {
          navigate("/song/" + x.props.id);
        }}
      >
        <Icon mr={2} as={FiChevronRight}></Icon> Go To Song Page
      </Item>
      <Item onClick={(x: ItemParams) => navigate("/video/" + x.props.video_id)}>
        <Icon mr={2} as={FiChevronRight}></Icon> Go To Video Page
      </Item>
      <Item
        onClick={(x: ItemParams) => navigate(`/channel/${x.props.channel_id}/`)}
      >
        <Icon mr={2} as={FiChevronRight}></Icon> Go To Channel Page
      </Item>
    </CMenu>
  );
};
