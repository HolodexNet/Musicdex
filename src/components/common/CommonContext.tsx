import {
  useContextMenu,
  Menu as CMenu,
  Item,
  Separator,
  ItemParams,
} from "react-contexify";
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
      <Item
        onClick={(x: ItemParams) => {
          showAddDialog(x.props);
        }}
      >
        Add To Playlist...
      </Item>
      <hr style={{ marginTop: "0.4rem", marginBottom: "0.4rem" }} />
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
      <Item onClick={(x: ItemParams) => {}}>Go To Channel Page</Item>
    </CMenu>
  );
};
