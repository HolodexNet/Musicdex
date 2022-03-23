import {
  Button,
  Divider,
  Heading,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistList } from "../components/playlist/PlaylistList";
import {
  useMyPlaylists,
  useStarredPlaylists,
} from "../modules/services/playlist.service";
import { FiStar } from "react-icons/fi";
import { QueryStatus } from "../components/common/QueryStatus";
import { PlaylistCreateModal } from "../components/playlist/PlaylistCreateForm";
import { useTranslation } from "react-i18next";
import { RiPlayListFill } from "react-icons/ri";
import { Helmet } from "react-helmet-async";

export default function Library() {
  const { t } = useTranslation();
  const { data: playlistList, ...status } = useMyPlaylists();
  const { data: starredList } = useStarredPlaylists();
  const { onOpen, ...modalProps } = useDisclosure();
  return (
    <PageContainer>
      <Helmet>
        <title>{t("Library")} - Musicdex</title>
      </Helmet>
      <ContainerInlay mt={12}>
        <Heading mx={2} mb={6}>
          <Icon as={RiPlayListFill} marginBottom={-1} marginRight={2} />
          {t("Library")}
        </Heading>
        <PlaylistCreateModal {...modalProps} />
        <Button onClick={onOpen} maxW="200px">
          {t("Create Playlist")}
        </Button>
        {status.isLoading ? (
          <QueryStatus queryStatus={status} />
        ) : (
          <>
            <Heading mx={2} my={4} size="md">
              {t("My Playlists")}
            </Heading>
            <Divider />
            {playlistList && (
              <PlaylistList playlistStubs={playlistList as any} />
            )}
            <Heading mx={2} my={4} size="md">
              {t("Starred Playlists")}
            </Heading>
            <Divider />
            {starredList && (
              <PlaylistList
                playlistStubs={starredList as any}
                defaultIcon={FiStar}
              />
            )}
          </>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
