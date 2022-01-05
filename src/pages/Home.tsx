import {
  SimpleGrid,
  Text,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Container,
} from "@chakra-ui/react";
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
import styled from "@emotion/styled";

export function Home() {
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...rest } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const { data: discovery, isSuccess } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <Container maxW="4xl">
        <CenterTabs>
          <Tabs
            isFitted
            isLazy
            // px={{ sm: 0, md: 12, lg: 24 }}
            variant="line"
            size="lg"
          >
            <TabList borderBottomColor="transparent">
              <Tab marginX={3}>Latest in Hololive</Tab>
              <Tab marginX={3}>Live Event</Tab>
              <Tab marginX={3}>Latest in Musicdex</Tab>
              <Tab marginX={3}>New Song Releases</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>one!</p>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>
                <p>one!</p>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CenterTabs>
      </Container>

      <Heading size="lg" marginBottom={6}>
        Discover {org.name}
      </Heading>
      <Heading size="md" marginBottom={2}>
        {org.name} Artists
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
      <Heading size="md" marginBottom={2}>
        Trending {org.name} Songs
      </Heading>
      <Spacer />
      <QueryStatus queryStatus={rest} />
      {trendingSongs && (
        <SimpleGrid minChildWidth="290px" spacing={2}>
          {trendingSongs.slice(0, 4).map((song) => (
            <SongItem song={song} key={song.id} />
          ))}
        </SimpleGrid>
      )}
      {trendingSongs && <SongTable songs={trendingSongs} />}
    </PageContainer>
  );
}

const CenterTabs = styled.div`
  .chakra-tabs__tablist {
    justify-content: space-around;
  }
  .chakra-tabs button[role="tab"] {
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: fit-content;
    padding-bottom: 3px;
    border-bottom: 4px solid transparent;
    font-family: var(--chakra-fonts-heading);
  }
  .chakra-tabs button[aria-selected="true"] {
    border-bottom-style: solid;
    border-bottom-width: 4px;
    border-image-source: linear-gradient(
      to right,
      var(--chakra-colors-brand-300) 20%,
      var(--chakra-colors-n2-300) 80%
    );
    border-image-slice: 1;
    color: unset;
    font-weight: 500;
  }
`;
