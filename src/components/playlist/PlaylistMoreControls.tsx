import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiMoreHorizontal } from "react-icons/fi";
import { usePlaylistWriter } from "../../modules/services/playlist.service";
import { PlaylistButtonType } from "./PlaylistButtonArray";

export function PlaylistMoreControlsMenu({
  playlist,
  canEdit,
  children,
  ...rest
}: Omit<MenuProps, "children"> & {
  playlist: PlaylistFull;
  canEdit: boolean;
  children?: PlaylistButtonType[];
}) {
  const { t } = useTranslation();
  const { mutateAsync: write } = usePlaylistWriter();
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
        {children?.map(({ text, title, icon, onClick, type }, index) => (
          <MenuItem icon={icon} onClick={onClick} key={type + index}>
            {text || title}
          </MenuItem>
        ))}
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
      </MenuList>
    </Menu>
  );
}
