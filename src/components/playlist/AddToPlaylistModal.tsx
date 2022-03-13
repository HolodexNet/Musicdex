import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Heading,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMove } from "react-icons/fi";
import { RiDragDropLine } from "react-icons/ri";
import useNamePicker from "../../modules/common/useNamePicker";
import {
  useMyPlaylists,
  usePlaylistUpdater,
} from "../../modules/services/playlist.service";
import { useStoreActions, useStoreState } from "../../store";

export function AddToPlaylistModal(): JSX.Element {
  const song = useStoreState((state) => state.addPlaylist.songToAdd);
  const showDialog = useStoreState((state) => state.addPlaylist.dialogShow);
  const close = useStoreActions(
    (actions) => actions.addPlaylist.clearPlaylistAddDialog
  );

  const { mutateAsync } = usePlaylistUpdater();
  const toast = useToast();

  const { data: playlists, isLoading } = useMyPlaylists();

  const [selectedPlaylistId, setPlaylist] = useState("_");

  useEffect(() => {
    if (playlists && playlists[0]) {
      setPlaylist(playlists[0].id);
    }
  }, [playlists]);
  const tn = useNamePicker();
  return (
    <Modal onClose={close} isOpen={showDialog}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add To Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Divider mx={-4} mb={1} />
          {song && (
            <Box>
              <Heading size="sm">{song.name}</Heading> covered by{" "}
              <Heading size="sm">
                {tn(song.channel?.english_name, song.channel?.name)}
              </Heading>
            </Box>
          )}
          <Divider mx={-4} mt={1} mb={2} />
          {isLoading ? (
            "Loading"
          ) : (
            <RadioGroup onChange={setPlaylist} value={selectedPlaylistId}>
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
          <Text color="whiteAlpha.500">
            <RiDragDropLine style={{ display: "inline" }}></RiDragDropLine> Tip:
            you can also drag songs from tables into playlists to quickly add to
            playlist.
          </Text>
          <Button
            onClick={async () => {
              if (selectedPlaylistId !== "_" && song && song.id)
                await mutateAsync({
                  action: "add",
                  playlistId: selectedPlaylistId,
                  song: song.id,
                }).then(
                  () => {
                    toast({
                      status: "success",
                      title: "Added",
                      duration: 1500,
                      position: "top-right",
                    });
                  },
                  () => {
                    toast({
                      status: "warning",
                      position: "top-right",
                      title: "Something went wrong",
                      isClosable: true,
                    });
                  }
                );
              close();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
