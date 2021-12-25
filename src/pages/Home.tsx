import { Container, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { Loading } from "../components/common/Loading";
import { SongTable } from "../components/data/SongTable";
import { useTrendingSongs } from "../modules/services/songs.service";

export function Home() {
  const [org, setOrg] = useState<string>("Hololive");
  const { data: trendingSongs, isLoading } = useTrendingSongs({ org });

  function handle(e: any) {
    setOrg(e.target.value);
  }

  return (
    <Container maxW="container.xl">
      <Select placeholder="Select org" value={org} onChange={handle}>
        <option value="Hololive">Hololive</option>
        <option value="Nijisanji">Nijisanji</option>
        <option value="Independents">Independents</option>
      </Select>
      <div>
        <h1>Top20</h1>
        {isLoading && <Loading />}
        {trendingSongs && <SongTable songs={trendingSongs} />}
      </div>
    </Container>
  );
}
