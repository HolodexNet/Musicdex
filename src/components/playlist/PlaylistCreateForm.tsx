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
import { useTranslation } from "react-i18next";
import { useClient } from "../../modules/client";
import { usePlaylistWriter } from "../../modules/services/playlist.service";

export default function PlaylistCreateForm({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const { t } = useTranslation();
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
                title: t("Created"),
                duration: 1500,
              });
              onClose();
            },
            () => {
              toast({
                status: "warning",
                position: "top-right",
                title: t("Something went wrong"),
                isClosable: true,
              });
              onClose();
            }
          );
        } else {
          toast({
            variant: "solid",
            status: "warning",
            description: t("You need to provide both name and description"),
            position: "top-right",
            isClosable: true,
          });
        }
      }}
    >
      <FormControl id="name" isRequired>
        <FormLabel>
          {t("Name (Can start with an emoji to set it as the icon)")}
        </FormLabel>
        <Input _placeholder={{ color: "gray.500" }} type="text" name="name" />
      </FormControl>
      <FormControl id="description" isRequired>
        <FormLabel>{t("Description")}</FormLabel>
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
          {t("Create")}
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
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Create New Playlist")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PlaylistCreateForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
