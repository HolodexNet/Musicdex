import { SimpleGrid, Text, Heading, Spacer } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { ChannelCard } from "../components/channel/ChannelCard";
import { QueryStatus } from "../components/common/QueryStatus";
import { CardCarousel } from "../components/common/CardCarousel";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import { useDiscoveryOrg } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreState } from "../store";
import { PlaylistCard } from "../components/playlist/PlaylistCard";

export function Home() {
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...rest } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const { data: discovery, isSuccess } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <Heading size="lg" marginBottom={2}>
        Discover {org.name}
      </Heading>
      {discovery && (
        <CardCarousel height={210} width={160} scrollMultiplier={2}>
          {discovery.channels.map((c: Channel) => (
            <ChannelCard channel={c} key={c.id} marginX={2} />
          ))}
        </CardCarousel>
      )}
      {discovery?.recentSingingStream?.playlist && (
        <CardCarousel height={230} width={160} scrollMultiplier={2}>
          <PlaylistCard playlist={discovery.recentSingingStream.playlist} />
        </CardCarousel>
      )}
      <Heading size="lg" marginBottom={2}>
        Trending {org.name} Songs
      </Heading>
      <Spacer />
      <QueryStatus queryStatus={rest} />
      {trendingSongs && (
        <SimpleGrid minChildWidth="290px" spacing={2} paddingX={3}>
          {trendingSongs.slice(0, 4).map((song) => (
            <SongItem song={song} key={song.id} />
          ))}
        </SimpleGrid>
      )}
      {trendingSongs && <SongTable songs={trendingSongs} />}
    </PageContainer>
  );
}
