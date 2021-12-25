import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useMyPlaylists,
  usePlaylistUpdater,
} from "../../modules/services/playlist.service";
import { useStoreActions, useStoreState } from "../../store";

export function AddToPlaylist(): JSX.Element {
  const song = useStoreState((state) => state.addPlaylist.songToAdd);
  const showDialog = useStoreState((state) => state.addPlaylist.dialogShow);
  const close = useStoreActions(
    (actions) => actions.addPlaylist.clearPlaylistAddDialog
  );

  const { mutateAsync } = usePlaylistUpdater();

  const { data: playlists, isLoading } = useMyPlaylists();

  const [selectedPlaylistId, setPlaylist] = useState("_");

  useEffect(() => {
    if (playlists && playlists[0]) {
      setPlaylist(playlists[0].id);
    }
  }, [playlists]);

  return (
    <Modal onClose={close} isOpen={showDialog}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add To Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <hr style={{ margin: "0.4rem -1rem" }} />
          {song && (
            <Box>
              <Heading size="sm">{song.name}</Heading> covered by{" "}
              <Heading size="sm">{song.channel.english_name}</Heading>
            </Box>
          )}
          <hr style={{ margin: "0.4rem -1rem" }} />
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
          <Button
            onClick={async () => {
              if (selectedPlaylistId !== "_" && song && song.id)
                await mutateAsync({
                  action: "add",
                  playlist: selectedPlaylistId,
                  song: song.id,
                });
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
