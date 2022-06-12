import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiEdit2, FiMoreHorizontal, FiShare2, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import {
  usePlaylistDeleter,
  usePlaylistStarUpdater,
  usePlaylistWriter,
} from "../../modules/services/playlist.service";
import {
  ClickEventHandler,
  PlaylistButtonElement,
  PlaylistButtonChildren,
} from "./PlaylistButtonArray";

export function PlaylistMoreControlsMenu({
  playlist,
  canEdit,
  canStar,
  canShare,
  starred,
  hideElement,
  onDelete,
  onEditClick,
  children,
  ...rest
}: Omit<MenuProps, "children"> & {
  playlist: PlaylistFull;
  canEdit: boolean;
  canStar: boolean;
  canShare: boolean;
  starred?: boolean;
  hideElement?: PlaylistButtonElement[];
  onDelete?: ClickEventHandler;
  onEditClick?: ClickEventHandler;
  children?: PlaylistButtonChildren[];
}) {
  const { t } = useTranslation();
  const { mutateAsync: write, isLoading } = usePlaylistWriter();
  const { mutateAsync: del } = usePlaylistDeleter();
  const { mutateAsync: updateStar } = usePlaylistStarUpdater();

  const navigate = useNavigate();
  const toast = useToast();
  const clip = useClipboardWithToast();

  const changeListed = (e: boolean) => {
    const update = { ...playlist, listed: e };
    delete update.content;

    write(update as any).then(
      () => {
        toast({
          status: "success",
          title: t("Successfully saved playlist"),
          position: "top-right",
        });
      },
      (err) => {
        toast({
          status: "error",
          title: t("Failed to save playlist"),
          description: err.toString(),
          position: "top-right",
          isClosable: true,
        });
      }
    );
  };

  if (
    !canEdit &&
    (!canShare || !hideElement?.includes("share")) &&
    (!canStar || !hideElement?.includes("star")) &&
    (!children || !hideElement?.includes("children"))
  )
    return <></>;

  return (
    <Menu {...rest} isLazy>
      <MenuButton
        py={2}
        transition="all 0.3s"
        icon={<FiMoreHorizontal />}
        as={IconButton}
        variant="ghost"
        colorScheme="n2"
        aria-label="More"
      />
      <MenuList>
        {hideElement?.includes("star") && canStar && (
          <MenuItem
            icon={starred ? <FaRegStar /> : <FaStar />}
            onClick={() =>
              updateStar({
                playlist_id: playlist.id,
                action: starred ? "delete" : "add",
              })
            }
          >
            {t(starred ? "Unstar" : "Star")}
          </MenuItem>
        )}
        {hideElement?.includes("share") && canShare && (
          <MenuItem
            icon={<FiShare2 />}
            onClick={() => clip(window.location.toString(), false)}
          >
            {t("Copy link")}
          </MenuItem>
        )}
        {hideElement?.includes("children") &&
          children?.map(({ title, icon, onClick }) => (
            <MenuItem icon={icon} onClick={onClick}>
              {title}
            </MenuItem>
          ))}
        {hideElement?.includes("edit") && canEdit && (
          <MenuItem icon={<FiEdit2 />} onClick={onEditClick}>
            {t("Edit")}
          </MenuItem>
        )}
        {canEdit && (
          <>
            <MenuOptionGroup
              defaultValue={playlist.listed ? "1" : "0"}
              title={t("Playlist Visibility State")}
              type="radio"
            >
              <MenuItemOption
                value={"1"}
                onClick={() => {
                  changeListed(true);
                }}
              >
                {t("Public Playlist")}
              </MenuItemOption>
              <MenuItemOption
                value={"0"}
                onClick={() => {
                  changeListed(false);
                }}
              >
                {t("Private Playlist")}
              </MenuItemOption>
            </MenuOptionGroup>
          </>
        )}
        {hideElement?.includes("delete") && canEdit && (
          <>
            <MenuDivider />
            <MenuItem
              icon={<FiTrash />}
              color="red.300"
              _hover={{ backgroundColor: "red.700" }}
              onClick={onDelete}
            >
              {t("Delete Playlist")}
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
