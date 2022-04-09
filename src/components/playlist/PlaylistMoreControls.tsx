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
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router";
import {
  usePlaylistDeleter,
  usePlaylistWriter,
} from "../../modules/services/playlist.service";

export function PlaylistMoreControlsMenu({
  playlist,
  canEdit,
  ...rest
}: Omit<MenuProps, "children"> & { playlist: PlaylistFull; canEdit: boolean }) {
  const { t } = useTranslation();
  const { mutateAsync: write, isLoading } = usePlaylistWriter();
  const { mutateAsync: del } = usePlaylistDeleter();

  const navigate = useNavigate();
  const toast = useToast();

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
  if (!canEdit) return <></>;
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
      ></MenuButton>
      <MenuList>
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
        <MenuDivider />
        <MenuItem
          _hover={{ backgroundColor: "red.700" }}
          onClick={deletePlaylist}
        >
          {t("Delete Playlist")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
