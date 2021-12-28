import { Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Loading } from "../components/common/Loading";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { useHistory } from "../modules/services/history.service";
import { useStoreState } from "../store";

export function History() {
  // const history = useStoreState((store) => store.playback.history);
  const { data: history, isLoading, isFetching, error, isError } = useHistory();

  return (
    <PageContainer>
      <Stack spacing={4}>
        <Heading>Recently Played</Heading>
        {/* <Text fontSize="lg">
          Right now, History page is only reflecting playback on your current
          device.
        </Text> */}
        {isLoading && <Loading />}
        {history?.length && <SongTable songs={history}></SongTable>}
      </Stack>
    </PageContainer>
  );
}
