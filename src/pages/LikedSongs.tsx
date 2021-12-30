import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { useLikedSongs } from "../modules/services/like.service";

export function LikedSongs() {
  // const history = useStoreState((store) => store.playback.history);
  const [offset, setOffset] = useState(0);
  const {
    data: likedSongs,
    isPreviousData,
    ...status
  } = useLikedSongs(offset, { keepPreviousData: true });

  return (
    <PageContainer>
      <Stack spacing={4}>
        <Heading>Liked Songs</Heading>
        <QueryStatus queryStatus={status} />
        {likedSongs?.length && <SongTable songs={likedSongs}></SongTable>}
        {/* TODO: better pagination, with a wrapped count... */}
        {isPreviousData && (likedSongs?.length || 0) % 50 === 0 && (
          <Button onClick={() => setOffset((prev) => prev + 50)}>
            Load more
          </Button>
        )}
      </Stack>
    </PageContainer>
  );
}
