import { Icon } from "@chakra-ui/react";
import { useState } from "react";
import {
  Item,
  ItemParams,
  Menu as CMenu,
  Separator,
  Submenu,
} from "react-contexify";
import { useTranslation } from "react-i18next";
import { BiListPlus } from "react-icons/bi";
import { BsInputCursorText } from "react-icons/bs";
import { FiChevronRight, FiCopy, FiFolderPlus, FiLink } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { useStoreActions, useStoreState } from "../../store";
import { useSongQueuer } from "../../utils/SongQueuerHook";

export const DEFAULT_MENU_ID = "r1";
export const QUEUE_MENU_ID = "q_r1";

export const SongContextMenu = ({
  menuId = DEFAULT_MENU_ID,
}: {
  menuId?: string;
}) => {
  const showAddDialog = useStoreActions(
    (action) => action.addPlaylist.showPlaylistAddDialog
  );
  const showDeleteFromQueue = menuId === QUEUE_MENU_ID;

  const { t } = useTranslation();

  const copyToClipboard = useClipboardWithToast();
  const navigate = useNavigate();
  const queueSongs = useSongQueuer();
  const queue = useStoreState((x) => x.playback.queue);
  const queueRemove = useStoreActions((store) => store.playback.queueRemove);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const openUrl = (
    url: string,
    event: MouseEvent | TouchEvent | KeyboardEvent
  ) => {
    if (event.shiftKey) {
      window.open(url, "_blank", "width:500,height:500");
    } else if (event.ctrlKey) {
      window.open(url, "_blank");
    } else navigate(url);
  };

  return (
    <CMenu id={menuId} theme="dark" animation="fade">
      {!showDeleteFromQueue ? (
        <Item
          hidden={(x) => {
            setSong(x.props);
            return false;
          }}
          onClick={(x: ItemParams) => {
            queueSongs({ songs: [x.props], immediatelyPlay: false });
          }}
        >
          <Icon mr={2} as={BiListPlus}></Icon> {t("Add to Queue")}
        </Item>
      ) : (
        <Item
          hidden={(x) => {
            setSong(x.props);
            return false;
          }}
          onClick={(x: ItemParams) => {
            const song = x.props;
            const idx = queue.findIndex((x) => x === song);
            if (idx >= 0)
              // when the song you want to remove is on the queue.
              queueRemove(idx);
            else {
              console.error(
                "Hmm, I can't find the song you're trying to remove? Bug."
              );
            }
          }}
          style={{ backgroundColor: "var(--chakra-colors-red-800)" }}
        >
          <Icon mr={2} as={BiListPlus}></Icon> {t("Remove from Queue")}
        </Item>
      )}
      <Item
        onClick={(x: ItemParams) => {
          showAddDialog(x.props);
        }}
      >
        <Icon mr={2} as={FiFolderPlus}></Icon> {t("Add To Playlist...")}
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          copyToClipboard(`${window.location.origin}/song/${x.props.id}`);
        }}
      >
        <Icon mr={2} as={FiLink}></Icon> {t("Share Song")}
      </Item>
      <Submenu
        label={
          <>
            <Icon mr={2} as={BsInputCursorText}></Icon> {t("Select and Copy")}
          </>
        }
      >
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(x.props.name);
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> {t("Song Name")}
        </Item>
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(x.props.original_artist);
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> {t("Original Artist")}
        </Item>
        <Item
          onClick={(x: ItemParams) => {
            copyToClipboard(
              `https://youtu.be/${x.props.video_id}?t=${x.props.start}`
            );
          }}
        >
          <Icon mr={2} as={FiCopy}></Icon> {t("Timestamped Youtube Link")}
        </Item>
      </Submenu>
      <Separator />
      <Item
        onClick={(x: ItemParams) => {
          openUrl("/song/" + x.props.id, x.event as any);
        }}
        onAuxClick={(e) => {
          song && window.open("/song/" + song.id, "_blank");
        }}
      >
        <Icon mr={2} as={FiChevronRight}></Icon> {t("Go To Song Page")}
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          openUrl("/video/" + x.props.video_id, x.event as any);
        }}
        onAuxClick={(e) => {
          song && window.open("/video/" + song.video_id, "_blank");
        }}
      >
        <Icon mr={2} as={FiChevronRight}></Icon> {t("Go To Video Page")}
      </Item>
      <Item
        onClick={(x: ItemParams) => {
          openUrl("/channel/" + x.props.channel_id, x.event as any);
        }}
        onAuxClick={(e) => {
          song && window.open("/channel/" + song.channel_id, "_blank");
        }}
      >
        <Icon mr={2} as={FiChevronRight}></Icon> {t("Go To Channel Page")}
      </Item>
    </CMenu>
  );
};
