import {
  useToast,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useClient } from "../../modules/client";
import { usePlaylistWriter } from "../../modules/services/playlist.service";

export default function PlaylistCreateForm(): JSX.Element {
  const { mutateAsync: writePlaylist } = usePlaylistWriter();

  const form = useRef<any>(undefined);
  const toast = useToast();
  const { user } = useClient();

  return (
    <Stack
      w={"full"}
      rounded={"xl"}
      mb={6}
      as="form"
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as any);
        const formProps: Record<string, string> = Object.fromEntries(
          formData
        ) as Record<string, string>;
        if (
          formProps.name.trim().length > 0 &&
          formProps.description.trim().length > 0
        ) {
          const playlist = {
            title: formProps.name,
            description: formProps.description,
            owner: user?.id,
            type: "ugp",
            content: [],
          };
          writePlaylist(playlist).then(
            () => {
              toast({
                status: "success",
                position: "top-right",
                title: "Created",
              });
            },
            () => {
              toast({
                status: "warning",
                position: "top-right",
                title: "Something went wrong",
              });
            }
          );
        } else {
          toast({
            variant: "solid",
            status: "warning",
            description: "You need to provide both name and description.",
          });
        }
      }}
    >
      <FormControl id="name" isRequired>
        <FormLabel>
          Name (Can start a playlist with an emoji to set it as the icon)
        </FormLabel>
        <Input _placeholder={{ color: "gray.500" }} type="text" name="name" />
      </FormControl>
      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Input type="text" name="description" />
      </FormControl>
      <Stack spacing={6}>
        <Button
          bg={"green.400"}
          color={"white"}
          _hover={{
            bg: "green.500",
          }}
          type="submit"
        >
          Create
        </Button>
      </Stack>
    </Stack>
  );
}

export function PlaylistCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PlaylistCreateForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
