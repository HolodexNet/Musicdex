import {
  Box,
  Button,
  Heading,
  HStack,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ChannelCard } from "../components/channel/ChannelCard";
import { CardCarousel } from "../components/common/CardCarousel";
import { VideoPlaylistCarousel } from "../components/playlist/VideoPlaylistCarousel";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { SongCard } from "../components/song/SongCard";
import { useDiscoveryOrg } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreActions, useStoreState } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...trendingStatus } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const isMobile = useBreakpointValue({ base: true, md: false });
  const queueSongs = useSongQueuer();

  const { data: discovery, ...discoveryStatus } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <ContainerInlay pt={0}>
        <HomeSection>
          <Heading size="lg" mb={3}>
            {t("Recent Singing Streams")}
          </Heading>

          {isMobile ? (
            <CardCarousel height={230} width={160} scrollMultiplier={4}>
              {discovery?.recentSingingStreams
                .filter((stream: any) => stream.playlist?.content?.length)
                .map((stream: any) => (
                  <PlaylistCard
                    playlist={stream.playlist}
                    key={"kpc" + stream.playlist.id}
                    mx={["2px", null, 1, 2]}
                  />
                ))}
            </CardCarousel>
          ) : (
            <VideoPlaylistCarousel
              videoPlaylists={discovery?.recentSingingStreams}
            />
          )}
        </HomeSection>

        <HomeSection>
          <Heading size="lg" mb={3}>
            {t("{{org}} Playlists", { org: org.name })}
          </Heading>
          <CardCarousel height={230} width={160} scrollMultiplier={4}>
            {discovery?.recommended?.playlists?.map(
              (p: Partial<PlaylistFull>) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              )
            )}
          </CardCarousel>
        </HomeSection>

        <HomeSection>
          <HStack alignItems="flex-end" mb={3}>
            <Heading size="lg">
              {t("Trending {{org}} Songs", { org: org.name })}
            </Heading>
            <Spacer />
            <Button
              variant="ghost"
              size="sm"
              colorScheme="n2"
              onClick={() =>
                queueSongs({
                  songs: trendingSongs || [],
                  immediatelyPlay: false,
                })
              }
            >
              {t("Queue ({{amount}})", { amount: trendingSongs?.length })}
            </Button>
          </HStack>
          <CardCarousel height={180} width={128} scrollMultiplier={4}>
            {trendingSongs?.map((song) => (
              <SongCard song={song} key={song.id} mx={["2px", null, 1, 2]} />
            ))}
          </CardCarousel>
        </HomeSection>

        <HomeSection>
          <Link to="/channels">
            <Button float="right" variant="outline" colorScheme="n2">
              {t("See All")}
            </Button>
          </Link>
          <Heading size="lg" mb={3}>
            {t("Discover {{org}}", { org: org.name })}
          </Heading>
          <CardCarousel height={180} width={160} scrollMultiplier={4} mb={2}>
            {discovery?.channels?.map((c: Channel) => (
              <ChannelCard
                channel={c}
                key={c.id}
                marginX={["2px", null, 1, 2]}
              />
            ))}
          </CardCarousel>
        </HomeSection>
      </ContainerInlay>
    </PageContainer>
  );
}

const HomeSection = styled.div`
  padding: 0.5rem 0px;
  margin-bottom: 1.5rem;
`;
