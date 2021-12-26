import { Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { useStoreState } from "../store";

export function History() {
  const history = useStoreState((store) => store.playback.history);
  const historySongs: Song[] = useMemo(() => {
    return (
      history.map((x) => {
        return x.song!;
      }) || []
    );
  }, [history]);

  return (
    <PageContainer>
      <Stack spacing={4}>
        <Heading>History</Heading>
        <Text fontSize="lg">
          Right now, History page is only reflecting playback on your current
          device.
        </Text>
        <SongTable songs={historySongs}></SongTable>
      </Stack>
    </PageContainer>
  );
}
