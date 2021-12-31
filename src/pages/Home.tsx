import { Container, Flex, Select, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import { useTrendingSongs } from "../modules/services/songs.service";

export function Home() {
  const [org, setOrg] = useState<string>("Hololive");
  const { data: trendingSongs, ...rest } = useTrendingSongs({ org });

  function handle(e: any) {
    setOrg(e.target.value);
  }

  return (
    <PageContainer>
      <Select placeholder="Select org" value={org} onChange={handle}>
        <option value="Hololive">Hololive</option>
        <option value="Nijisanji">Nijisanji</option>
        <option value="Independents">Independents</option>
      </Select>
      <div>
        <h1>Top20</h1>
        <QueryStatus queryStatus={rest} />
        {trendingSongs && (
          <SimpleGrid minChildWidth="305px" spacing={2} autoFlow="row">
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
