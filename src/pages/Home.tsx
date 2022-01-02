import { Container, Flex, SimpleGrid, useQuery } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import { useDiscoveryOrg } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreState } from "../store";

export function Home() {
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...rest } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const { data: discovery, isSuccess } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <div>
        Discovery: {JSON.stringify(discovery)}
        <h1>Top20: {org.name}</h1>
        <QueryStatus queryStatus={rest} />
        {trendingSongs && (
          <SimpleGrid minChildWidth="290px" spacing={2} paddingX={3}>
            {trendingSongs.slice(0, 4).map((song) => (
              <SongItem song={song} key={song.id} />
            ))}
          </SimpleGrid>
        )}
        {trendingSongs && <SongTable songs={trendingSongs} />}
      </div>
    </PageContainer>
  );
}
