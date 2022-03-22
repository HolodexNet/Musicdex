import { Button, HStack, StackProps } from "@chakra-ui/react";
import React, { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiPlay, FiShare2 } from "react-icons/fi";
import { useClient } from "../../modules/client";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import {
  usePlaylistStarUpdater,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { PlaylistMoreControlsMenu } from "./PlaylistMoreControls";

type ClickEventHandler = React.MouseEventHandler<HTMLButtonElement>;

export function PlaylistButtonArray({
  onPlayClick,
  onAddQueueClick,
  onEditClick,
  onFinishEditClick,
  editMode,
  canStar = true,
  canEdit,
  playlist,
  children = undefined,
  ...rest
}: {
  onPlayClick: ClickEventHandler;
  onAddQueueClick: ClickEventHandler;
  onEditClick?: ClickEventHandler;
  onFinishEditClick?: ClickEventHandler;
  editMode: boolean;
  canEdit: boolean;
  canStar?: boolean;
  playlist: PlaylistFull;
  children?: ReactNode;
} & StackProps): JSX.Element {
  const { t } = useTranslation();
  const clip = useClipboardWithToast();

  let { user, isLoggedIn } = useClient();
  let { data: playlists } = useStarredPlaylists();

  let faved = useMemo(() => {
    return (
      isLoggedIn &&
      playlists &&
      playlists?.findIndex((x) => x.id === playlist.id) >= 0
    );
  }, [isLoggedIn, playlist.id, playlists]);

  let { mutateAsync: updateStar } = usePlaylistStarUpdater();

  return (
    <HStack spacing={4} flexShrink={1} flexWrap="wrap" {...rest}>
      <Button
        aria-label="play"
        leftIcon={<FiPlay />}
        size="md"
        colorScheme="n2"
        onClick={onPlayClick}
      >
        {t("Play")}
      </Button>
      <Button
        variant="ghost"
        aria-label="add to queue"
        size="md"
        colorScheme="n2"
        onClick={onAddQueueClick}
      >
        {t("Add to Queue")}
      </Button>
      <Button
        display={!editMode && canEdit ? "block" : "none"}
        variant="ghost"
        aria-label="edit"
        size="md"
        colorScheme="n2"
        onClick={(e) => {
          onEditClick && onEditClick(e);
        }}
      >
        {t("Edit")}
      </Button>
      <Button
        display={editMode && canEdit ? "block" : "none"}
        variant="ghost"
        aria-label="edit"
        size="md"
        colorScheme="green"
        onClick={(e) => {
          onFinishEditClick && onFinishEditClick(e);
        }}
      >
        {t("Save Changes")}
      </Button>
      {isLoggedIn && user && user.id !== playlist.owner && canStar && (
        <Button
          variant="ghost"
          aria-label="star playlist"
          size="md"
          onClick={() =>
            updateStar({
              playlist_id: playlist.id,
              action: faved ? "delete" : "add",
            })
          }
          colorScheme="n2"
        >
          {faved ? <FaStar /> : <FaRegStar />}
        </Button>
      )}
      <Button
        variant="ghost"
        aria-label="share link"
        size="md"
        title={t("Copy link")}
        onClick={() => clip(window.location.toString(), false)}
        colorScheme="n2"
      >
        <FiShare2 />
      </Button>
      <PlaylistMoreControlsMenu
        playlist={playlist}
        canEdit={canEdit}
      ></PlaylistMoreControlsMenu>
      {children}
    </HStack>
  );
}
