import {
  Button,
  HStack,
  IconButton,
  IconButtonProps,
  StackProps,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useCallback } from "react";
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

export type PlaylistButtonElement =
  | "play"
  | "children"
  | "addToQueue"
  | "star"
  | "edit"
  | "share"
  | "delete";

const useResponsePlaylistArray = () => {
  return useBreakpointValue<PlaylistButtonElement[] | undefined>({
    base: ["addToQueue", "children", "star", "edit", "delete"],
    sm: ["children", "star", "edit", "delete"],
    md: ["delete"],
    lg: ["delete"],
  });
};

export interface PlaylistButtonType
  extends Omit<Partial<IconButtonProps>, "type"> {
  type: PlaylistButtonElement;
  hidden?: boolean;
  ariaLabel?: string;
  text?: string;
}

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
  children?: Partial<PlaylistButtonType>[];
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

  const deletePlaylist = useCallback(() => {
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
  }, [del, navigate, playlist.id, t, toast]);

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

  // List of all buttons and props
  const buttonList: PlaylistButtonType[] = useMemo(() => {
    return [
      {
        type: "play",
        variant: "solid",
        ariaLabel: "play",
        icon: <FiPlay />,
        text: t("Play"),
        onClick: onPlayClick,
      },
      {
        type: "addToQueue",
        ariaLabel: "add to queue",
        text: t("Add to Queue"),
        onClick: onAddQueueClick,
      },
      {
        type: "star",
        ariaLabel: "star",
        icon: starred ? <FaStar /> : <FaRegStar />,
        title: t(starred ? "Unstar" : "Star"),
        hidden: !canStar,
        onClick: () => {
          updateStar({
            playlist_id: playlist.id,
            action: starred ? "delete" : "add",
          });
        },
      },
      {
        type: "share",
        ariaLabel: "share link",
        icon: <FiShare2 />,
        title: canShare
          ? t("Copy link")
          : t("Playlist is private and cannot be shared."),
        hidden: !canShare,
        onClick: () => clip(window.location.toString(), false),
      },
      {
        type: "edit",
        ariaLabel: "edit",
        icon: <FiEdit2 />,
        title: t("Edit"),
        hidden: !canEdit,
        onClick: (e) => {
          onEditClick && onEditClick(e);
        },
      },
      {
        type: "delete",
        ariaLabel: "delete",
        hidden: !canEdit,
        icon: <FiTrash />,
        title: t("Delete Playlist"),
        onClick: deletePlaylist,
        colorScheme: "red",
      },
      ...(children?.map((props) => ({
        ...props,
        type: "children" as PlaylistButtonElement,
      })) || []),
    ];
  }, [
    canEdit,
    canShare,
    canStar,
    children,
    clip,
    deletePlaylist,
    onAddQueueClick,
    onEditClick,
    onPlayClick,
    playlist.id,
    starred,
    t,
    updateStar,
  ]);

  // Find buttons to render in line
  const visibleButtons = useMemo(
    () =>
      buttonList.filter(
        (btn) => !btn.hidden && !hideButton?.includes(btn.type)
      ),
    [buttonList, hideButton]
  );

  // Find buttons to render in the menu
  const collapsedButtons = useMemo(
    () =>
      buttonList.filter((btn) => !btn.hidden && hideButton?.includes(btn.type)),
    [buttonList, hideButton]
  );
  return (
    <HStack w="100%" spacing={4} {...rest}>
      <HStack spacing={4} flexGrow={1}>
        {editMode ? (
          <>
            <Button
              aria-label="finish edit"
              size="md"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
            {visibleButtons.map(
              (
                {
                  type,
                  variant = "ghost",
                  ariaLabel,
                  icon,
                  title,
                  text,
                  onClick,
                  colorScheme = "n2",
                  size,
                },
                index
              ) => {
                return icon && !text ? (
                  <IconButton
                    variant={variant}
                    aria-label={ariaLabel || ""}
                    icon={icon}
                    title={title}
                    onClick={onClick}
                    colorScheme={colorScheme}
                    key={type + index}
                  />
                ) : (
                  <Button
                    variant={variant}
                    aria-label={ariaLabel || ""}
                    size={size}
                    onClick={onClick}
                    colorScheme={colorScheme}
                    leftIcon={icon}
                    key={type + index}
                  >
                    {text}
                  </Button>
                );
              }
            )}
            {(canEdit || !!collapsedButtons.length) && (
              <PlaylistMoreControlsMenu playlist={playlist} canEdit={canEdit}>
                {collapsedButtons}
              </PlaylistMoreControlsMenu>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
}
