import { Heading, Stack, Text } from "@chakra-ui/react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { useHistory } from "../modules/services/history.service";

export function History() {
  // const history = useStoreState((store) => store.playback.history);
  const { data: history, ...status } = useHistory();

  return (
    <PageContainer>
      <Stack spacing={4}>
        <Heading>Recently Played</Heading>
        <QueryStatus queryStatus={status} />
        {history?.length && <SongTable songs={history}></SongTable>}
      </Stack>
    </PageContainer>
  );
}
