import { Divider, Heading, Icon } from "@chakra-ui/react";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistList } from "../components/playlist/PlaylistList";
import {
  useMyPlaylists,
  useStarredPlaylists,
} from "../modules/services/playlist.service";
import { FiStar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { QueryStatus } from "../components/common/QueryStatus";

export default function Library() {
  const { data: playlistList, ...status } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();

  return (
    <PageContainer>
      <ContainerInlay mt={12}>
        <Heading mx={2} mb={6}>
          <Icon as={FaBookmark} marginBottom={-1} marginRight={2} />
          Library
        </Heading>
        {status.isLoading ? (
          <QueryStatus queryStatus={status} />
        ) : (
          <>
            <Heading mx={2} my={4} size="md">
              My Playlists
            </Heading>
            <Divider />
            {playlistList && (
              <PlaylistList playlistStubs={playlistList as any} />
            )}
            <Heading mx={2} my={4} size="md">
              Starred Playlists
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
