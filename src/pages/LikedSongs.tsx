import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useLikedSongs } from "../modules/services/like.service";

export function LikedSongs() {
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

  return (
    <PageContainer>
      <ContainerInlay>
        <Stack spacing={4} my={4}>
          <Heading>Liked Songs</Heading>
          <QueryStatus queryStatus={status} />
          {paginatedSongs?.content?.length && (
            <>
              <SongTable songs={paginatedSongs.content}></SongTable>
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
        </Stack>
      </ContainerInlay>
    </PageContainer>
  );
}
