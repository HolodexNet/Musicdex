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
  HStack,
  useInterval,
  useBoolean,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
import { VideoPlaylistHighlight } from "../components/common/VideoPlaylistHighlight";
import {
  SnapList,
  SnapItem,
  useVisibleElements,
  useScroll,
} from "react-snaplist-carousel";
import styled from "@emotion/styled";

export function Home() {
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...rest } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const { data: discovery, isSuccess } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <Heading size="lg" mt={6} mb={3}>
        Recent Singing Streams
      </Heading>

      {/* <Container maxW="4xl"> */}
      <SnapContainer videoPlaylists={discovery?.recentSingingStreams} />
      {/* </Container> */}

      <Heading size="lg" mt={6} mb={3}>
        Discover {org.name}
      </Heading>
      {discovery && (
        <CardCarousel height={210} width={160} scrollMultiplier={2}>
          {discovery.channels.map((c: Channel) => (
            <ChannelCard channel={c} key={c.id} marginX={2} />
          ))}
        </CardCarousel>
      )}
      {/* {discovery?.recentSingingStream?.playlist && (
        <CardCarousel height={230} width={160} scrollMultiplier={2}>
          <PlaylistCard playlist={discovery.recentSingingStream.playlist} />
        </CardCarousel>
      )} */}
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

function SnapContainer({ videoPlaylists }: { videoPlaylists?: any[] }) {
  const snapList = useRef(null);

  const visible = useVisibleElements(
    { debounce: 10, ref: snapList },
    ([element]) => element
  );
  const goToSnapItem = useScroll({ ref: snapList });

  const [currentItemAuto, setCurrentItemAuto] = useState(0);
  const timer = useInterval(() => {
    if (!hovering)
      goToSnapItem((currentItemAuto + 1) % (videoPlaylists?.length || 1));
  }, 5000);

  useEffect(() => {
    setCurrentItemAuto(visible);
  }, [visible]);

  const [hovering, { on, off }] = useBoolean(false);

  if (!videoPlaylists) return <></>;

  return (
    <HStack spacing={0} onMouseEnter={on} onMouseLeave={off}>
      <CarouselNav>
        {videoPlaylists &&
          videoPlaylists.map((x, idx) => (
            <button
              className={
                visible === idx ? "cnav-button cnav-active" : "cnav-button"
              }
              onClick={() => goToSnapItem(idx)}
            ></button>
          ))}
      </CarouselNav>

      <SnapList ref={snapList} direction="vertical" height="320px" width="100%">
        {videoPlaylists &&
          videoPlaylists.map((x: any) => (
            <SnapItem
              key={"kxs" + x?.video.id}
              snapAlign="center"
              height="100%"
              width="100%"
            >
              <VideoPlaylistHighlight video={x?.video} playlist={x?.playlist} />
            </SnapItem>
          ))}
      </SnapList>
    </HStack>
  );
}

const CarouselNav = styled.aside`
  position: relative;
  margin-left: -24px;
  top: 0px;
  bottom: 0px;
  width: 20px;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  z-index: 4;

  .cnav {
    display: block;
  }

  .cnav-button {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #333;
    background-clip: content-box;
    border: 0.25rem solid transparent;
    border-radius: 50%;
    font-size: 0;
    transition: transform 0.1s;
  }

  .cnav-button.cnav-active {
    background-color: var(--chakra-colors-n2-400);
  }
`;
