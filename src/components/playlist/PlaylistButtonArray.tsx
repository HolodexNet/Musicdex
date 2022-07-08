import {
  Button,
  HStack,
  IconButton,
  StackProps,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiPlay, FiShare2, FiTrash, FiEdit2, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClient } from "../../modules/client";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import {
  usePlaylistDeleter,
  usePlaylistStarUpdater,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { PlaylistMoreControlsMenu } from "./PlaylistMoreControls";

export type ClickEventHandler = React.MouseEventHandler<HTMLButtonElement>;

export interface PlaylistButtonChildren {
  title: string;
  ariaLabel: string;
  icon: React.ReactElement;
  onClick: ClickEventHandler;
  disabled?: boolean;
}

export type PlaylistButtonElement =
  | "children"
  | "addToQueue"
  | "star"
  | "edit"
  | "share"
  | "delete";

const useResponsePlaylistArray = () => {
  return useBreakpointValue<PlaylistButtonElement[] | undefined>({
    base: ["children", "star", "edit", "share", "delete"],
    sm: ["children", "star", "edit", "delete"],
    md: ["delete"],
    lg: ["delete"],
  });
};

export function PlaylistButtonArray({
  onPlayClick,
  onAddQueueClick,
  onEditClick,
  onFinishEditClick,
  onAbortEditClick,
  editMode,
  canStar = true,
  canEdit,
  playlist,
  hideElement,
  children = undefined,
  ...rest
}: {
  onPlayClick: ClickEventHandler;
  onAddQueueClick?: ClickEventHandler;
  onEditClick?: ClickEventHandler;
  onFinishEditClick?: ClickEventHandler;
  onAbortEditClick?: ClickEventHandler;
  editMode: boolean;
  canEdit: boolean;
  canStar?: boolean;
  playlist: PlaylistFull;
  hideElement?: PlaylistButtonElement[];
  children?: PlaylistButtonChildren[];
} & StackProps): JSX.Element {
  const { t } = useTranslation();
  const clip = useClipboardWithToast();
  const toast = useToast();
  const navigate = useNavigate();
  const responseButtonLv = useResponsePlaylistArray();
  const hideButton = useMemo(
    () => hideElement ?? responseButtonLv,
    [hideElement, responseButtonLv]
  );

  let { isLoggedIn } = useClient();
  let { data: playlists } = useStarredPlaylists();
  const { mutateAsync: del } = usePlaylistDeleter();
  const { mutateAsync: updateStar } = usePlaylistStarUpdater();

  const deletePlaylist = () => {
    // eslint-disable-next-line no-restricted-globals
    const x = confirm(t("Really delete this playlist?"));
    if (x)
      del({ playlistId: playlist.id }).then(
        () => {
          toast({
            status: "success",
            position: "top-right",
            title: t("Deleted"),
            duration: 1500,
          });
          navigate("/");
        },
        () => {
          toast({
            status: "warning",
            position: "top-right",
            title: t("Something went wrong"),
            isClosable: true,
          });
        }
      );
  };

  const starred = useMemo(() => {
    return (
      isLoggedIn &&
      playlists &&
      playlists?.findIndex((x) => x.id === playlist.id) >= 0
    );
  }, [isLoggedIn, playlist.id, playlists]);

  const canShare = useMemo(
    () => playlist.listed || playlist.owner === 1,
    [playlist]
  );

  return (
    <HStack w="100%" spacing={4} {...rest}>
      <HStack spacing={4} flexGrow={1}>
        {editMode ? (
          <>
            <Button
              aria-label="finish edit"
              size="md"
              onClick={(e) => {
                onFinishEditClick && onFinishEditClick(e);
              }}
              colorScheme="green"
              leftIcon={<FiSave />}
            >
              {t("Save")}
            </Button>
            <Button
              variant="ghost"
              aria-label="abort edit"
              size="md"
              onClick={onAbortEditClick}
              colorScheme="red"
            >
              {t("Abort Changes")}
            </Button>
          </>
        ) : (
          <>
            <Button
              aria-label="play"
              leftIcon={<FiPlay />}
              size="md"
              colorScheme="n2"
              onClick={onPlayClick}
            >
              {t("Play")}
            </Button>
            {!hideButton?.includes("addToQueue") && (
              <Button
                variant="ghost"
                aria-label="add to queue"
                size="md"
                colorScheme="n2"
                onClick={onAddQueueClick}
              >
                {t("Add to Queue")}
              </Button>
            )}
            {!hideButton?.includes("star") && canStar && (
              <IconButton
                variant="ghost"
                aria-label="star"
                icon={starred ? <FaStar /> : <FaRegStar />}
                onClick={() =>
                  updateStar({
                    playlist_id: playlist.id,
                    action: starred ? "delete" : "add",
                  })
                }
                colorScheme="n2"
              />
            )}
            {!hideButton?.includes("share") && canShare && (
              <IconButton
                variant="ghost"
                aria-label="share link"
                icon={<FiShare2 />}
                title={
                  canShare
                    ? t("Copy link")
                    : t("Playlist is private and cannot be shared.")
                }
                onClick={() => clip(window.location.toString(), false)}
                colorScheme="n2"
                disabled={!canShare}
              />
            )}
            {!hideButton?.includes("children") &&
              children?.map(({ ariaLabel, icon, title, onClick, disabled }) => (
                <IconButton
                  variant="ghost"
                  aria-label={ariaLabel}
                  icon={icon}
                  title={title}
                  onClick={onClick}
                  colorScheme="n2"
                  disabled={disabled}
                />
              ))}
          </>
        )}
      </HStack>
      <HStack spacing={2}>
        {!editMode && (
          <>
            {!hideButton?.includes("edit") && canEdit && (
              <IconButton
                variant="ghost"
                aria-label="edit"
                icon={<FiEdit2 />}
                colorScheme="n2"
                onClick={(e) => {
                  onEditClick && onEditClick(e);
                }}
              />
            )}
            {!hideButton?.includes("delete") && canEdit && (
              <IconButton
                variant="ghost"
                aria-label="delete"
                icon={<FiTrash />}
                title={t("Delete Playlist")}
                onClick={deletePlaylist}
                colorScheme="red"
              />
            )}
            <PlaylistMoreControlsMenu
              playlist={playlist}
              canEdit={canEdit}
              canStar={canStar}
              canShare={canShare}
              starred={starred}
              hideElement={hideButton}
              onDelete={deletePlaylist}
              onEditClick={onEditClick}
              children={children}
            />
          </>
        )}
      </HStack>
    </HStack>
  );
}
