import { Container, Flex, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { Loading } from "../components/common/Loading";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import { useTrendingSongs } from "../modules/services/songs.service";

export function Home() {
  const [org, setOrg] = useState<string>("Hololive");
  const { data: trendingSongs, isLoading } = useTrendingSongs({ org });

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
        {isLoading && <Loading />}
        {trendingSongs && (
          <Flex flexDirection="row" mx="-6px" py="8px">
            {trendingSongs.slice(0, 4).map((song) => (
              <SongItem song={song} mx="6px" />
            ))}
          </Flex>
        )}
        {trendingSongs && <SongTable songs={trendingSongs} />}
      </div>
    </PageContainer>
  );
}
