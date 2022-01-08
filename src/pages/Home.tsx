import {
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  useBreakpoint,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { ChannelCard } from "../components/channel/ChannelCard";
import { CardCarousel } from "../components/common/CardCarousel";
import { QueryStatus } from "../components/common/QueryStatus";
import { VideoPlaylistCarousel } from "../components/common/VideoPlaylistCarousel";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { SongItem } from "../components/song/SongItem";
import { useDiscoveryOrg } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreState } from "../store";

export function Home() {
  const org = useStoreState((store) => store.org.currentOrg);
  const { data: trendingSongs, ...rest } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { data: discovery, isSuccess } = useDiscoveryOrg(org.name);

  return (
    <PageContainer>
      <ContainerInlay>
        <HStack alignItems="flex-end">
          <Spacer />
          <Button variant="ghost" size="sm" colorScheme="n2">
            All {org.name} Songs
          </Button>
          <Button variant="ghost" size="sm" colorScheme="n2">
            Search {org.name} Songs
          </Button>
        </HStack>

        <Heading size="lg" mb={3}>
          Recent Singing Streams
        </Heading>

        {isMobile ? (
          discovery?.recentSingingStreams && (
            <CardCarousel height={230} width={160} scrollMultiplier={2}>
              {discovery.recentSingingStreams
                .filter((stream: any) => stream.playlist?.content?.length)
                .map((stream: any) => (
                  <PlaylistCard
                    playlist={stream.playlist}
                    key={"kpc" + stream.playlist.id}
                    mx={2}
                  />
                ))}
            </CardCarousel>
          )
        ) : (
          <VideoPlaylistCarousel
            videoPlaylists={discovery?.recentSingingStreams}
          />
        )}

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
        <HStack alignItems="flex-end" mt={6} mb={3}>
          <Heading size="lg">Trending {org.name} Songs</Heading>
          <Spacer />
          <Button variant="ghost" size="sm" colorScheme="n2">
            Queue All
          </Button>
        </HStack>
        <QueryStatus queryStatus={rest} />
        {trendingSongs && (
          <SimpleGrid minChildWidth="290px" spacing={2}>
            {trendingSongs.slice(0, 4).map((song) => (
              <SongItem song={song} key={song.id} />
            ))}
          </SimpleGrid>
        )}
        <Suspense fallback="...">
          {trendingSongs && <SongTable songs={trendingSongs} />}
        </Suspense>
      </ContainerInlay>
    </PageContainer>
  );
}
