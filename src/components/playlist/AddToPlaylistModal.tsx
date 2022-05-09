import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiDragDropLine } from "react-icons/ri";
import useNamePicker from "../../modules/common/useNamePicker";
import {
  useMyPlaylists,
  usePlaylist,
  usePlaylistUpdater,
  usePlaylistWriter,
} from "../../modules/services/playlist.service";
import { useStoreActions, useStoreState } from "../../store";

export const AddToPlaylistModal: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const tn = useNamePicker();

  const { mutateAsync: writeNewPlaylist } = usePlaylistWriter();
  const { mutateAsync } = usePlaylistUpdater();

  const song = useStoreState((state) => state.addPlaylist.songToAdd);
  const showDialog = useStoreState((state) => state.addPlaylist.dialogShow);
  const close = useStoreActions(
    (actions) => actions.addPlaylist.clearPlaylistAddDialog
  );

  const [selectedPlaylistId, setSelectedPlaylist] = useState<
    string | undefined
  >();
  const isContainMultipleSongs = Array.isArray(song) && song.length > 1;

  const { data: playlists, isLoading } = useMyPlaylists();
  const { data: selectedPlaylistFull } = usePlaylist(selectedPlaylistId);

  useEffect(() => {
    if (playlists && playlists[0]) {
      setSelectedPlaylist(playlists[0].id);
    }
  }, [playlists]);

  async function onSave() {
    if (!selectedPlaylistId || !song) return;

    close();

    if (Array.isArray(song)) {
      // Merge old playlist songs and new songs
      const songIds =
        selectedPlaylistFull?.content?.map((song) => song.id) || [];
      const newSongIds = [...songIds, ...song.map((song) => song.id)];
      const newWritable: Partial<WriteablePlaylist> = {
        ...selectedPlaylistFull,
        content: newSongIds,
      };

      await writeNewPlaylist(newWritable).then(
        (_) => {
          //success:
          toast({
            status: "success",
            title: t("Added"),
            duration: 1500,
            position: "top-right",
          });
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
    } else if (!Array.isArray(song) && song.id) {
      await mutateAsync({
        action: "add",
        playlistId: selectedPlaylistId,
        song: song.id,
      }).then(
        () => {
          toast({
            status: "success",
            title: t("Added"),
            duration: 1500,
            position: "top-right",
          });
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
    }
  }

  return (
    <Modal onClose={close} isOpen={showDialog}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Add To Playlist")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {song && (
            <Box>
              <Heading size="md" my={1}>
                {Array.isArray(song) ? song[0].name : song.name}
              </Heading>
              <Text
                fontSize="sm"
                color={isContainMultipleSongs ? "" : "whiteAlpha.600"}
              >
                {isContainMultipleSongs
                  ? t("... and {{count}} other", { count: song.length - 1 })
                  : Array.isArray(song)
                  ? tn(song[0].channel?.english_name, song[0].channel?.name)
                  : tn(song.channel?.english_name, song.channel?.name)}
              </Text>
            </Box>
          )}
          <Divider my={2} />
          {isLoading ? (
            t("Loading...")
          ) : (
            <RadioGroup
              onChange={setSelectedPlaylist}
              value={selectedPlaylistId}
            >
              <Stack>
                {playlists?.map((p) => (
                  <Radio key={"atp-radio-" + p.id} value={p.id}>
                    {p.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex direction="column">
            <Button onClick={onSave}>{t("Save")}</Button>
            <Text color="whiteAlpha.500" fontSize="sm" my={2}>
              <RiDragDropLine style={{ display: "inline" }}></RiDragDropLine>
              {t(
                "Tip: you can also drag songs from tables into playlists to quickly add to playlist."
              )}
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
