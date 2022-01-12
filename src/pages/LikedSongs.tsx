import {
  Box,
  BoxProps,
  Button,
  Center,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Suspense, useMemo, useState } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { ErrorFallback } from "../ErrorFallback";
import { useClient } from "../modules/client";
import { useLikedSongs } from "../modules/services/like.service";
import { useStoreActions } from "../store";

function XHRError({ error, ...props }: BoxProps & { error: Error }) {
  const { isLoggedIn } = useClient();
  return (
    <Center {...props}>
      {isLoggedIn ? (
        // <Text>You are logged in, but there has been an error.</Text>
        <ErrorFallback
          error={error}
          resetErrorBoundary={() => {
            console.log("hi");
          }}
        />
      ) : (
        <Text my="20vh">
          Unfortunately it looks like you need to login to use this feature.
        </Text>
      )}
    </Center>
  );
}

export default function LikedSongs() {
  // const history = useStoreState((store) => store.playback.history);
  const [page, setPage] = useState(1);
  const {
    data: paginatedSongs,
    isPreviousData,
    ...status
  } = useLikedSongs(page, { keepPreviousData: true });
  const hasMore = useMemo(
    () => page < (paginatedSongs?.page_count || 1),
    [page, paginatedSongs]
  );
  const queueSongs = useStoreActions((s) => s.playback.queueSongs);

  return (
    <PageContainer>
      <ContainerInlay>
        <Stack spacing={4} my={4}>
          <PlaylistHeading
            title={"Liked Songs"}
            description={""}
            canEdit={false}
            count={0}
            editMode={false}
          ></PlaylistHeading>
          {status.isError ? (
            <XHRError error={status.error as Error} />
          ) : (
            <>
              <QueryStatus queryStatus={status} />
              <HStack spacing={4} flexShrink={1} flexWrap="wrap" my={2}>
                <Button
                  variant="solid"
                  aria-label="add to queue"
                  size="md"
                  colorScheme="n2"
                  onClick={() =>
                    queueSongs({
                      songs: paginatedSongs?.content || [],
                      immediatelyPlay: false,
                    })
                  }
                >
                  Add to Queue ({paginatedSongs?.content.length})
                </Button>
              </HStack>
              {paginatedSongs?.content?.length && (
                <>
                  <Suspense fallback={<div>Loading...</div>}>
                    <SongTable songs={paginatedSongs.content}></SongTable>
                  </Suspense>
                  <HStack justifyContent="center">
                    <Button
                      isDisabled={page === 1}
                      onClick={() => setPage((prev) => Math.min(1, prev - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      isDisabled={!hasMore}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </HStack>
                </>
              )}
            </>
          )}
        </Stack>
      </ContainerInlay>
    </PageContainer>
  );
}
