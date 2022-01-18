import { Box, Button, Heading, HStack, Spacer, Stack } from "@chakra-ui/react";
import { Suspense, useMemo, useState } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useLikedSongs } from "../modules/services/like.service";
import { useStoreActions } from "../store";
import { XHRError } from "../components/common/XHRError";

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
      <ContainerInlay mt={12}>
        {/* <Stack spacing={4} my={4}> */}
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
        {/* </Stack> */}
      </ContainerInlay>
    </PageContainer>
  );
}
