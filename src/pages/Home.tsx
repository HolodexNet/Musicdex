import {
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  useBoolean,
  useInterval,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import {
  SnapItem,
  SnapList,
  useScroll,
  useVisibleElements,
} from "react-snaplist-carousel";
import { ChannelCard } from "../components/channel/ChannelCard";
import { CardCarousel } from "../components/common/CardCarousel";
import { QueryStatus } from "../components/common/QueryStatus";
import { VideoPlaylistHighlight } from "../components/common/VideoPlaylistHighlight";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
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
      <ContainerInlay>
        <Heading size="lg" mt={2} mb={3}>
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
        <Heading size="lg" mt={6} mb={3}>
          Trending {org.name} Songs
        </Heading>
        <QueryStatus queryStatus={rest} />
        {trendingSongs && (
          <SimpleGrid minChildWidth="290px" spacing={2}>
            {trendingSongs.slice(0, 4).map((song) => (
              <SongItem song={song} key={song.id} />
            ))}
          </SimpleGrid>
        )}
        {trendingSongs && <SongTable songs={trendingSongs} />}
      </ContainerInlay>
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
    if (!hovering) {
      goToSnapItem((currentItemAuto + 1) % (videoPlaylists?.length || 1));
      setCurrentItemAuto(currentItemAuto + (1 % (videoPlaylists?.length || 1)));
    }
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
                currentItemAuto === idx
                  ? "cnav-button cnav-active"
                  : "cnav-button"
              }
              onClick={() => {
                goToSnapItem(idx);
                setCurrentItemAuto(idx);
              }}
            ></button>
          ))}
      </CarouselNav>

      <SnapList ref={snapList} direction="horizontal">
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
    border-radius: 0.75rem;
    font-size: 0;
    transition: all 0.4s;
  }

  .cnav-button.cnav-active {
    background-color: var(--chakra-colors-n2-400);
    height: 2rem;
  }
`;
