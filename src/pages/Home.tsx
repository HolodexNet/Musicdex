import {
  Box,
  Button,
  Flex,
  Heading,
  HeadingProps,
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
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo } from "react";
import { useServerOrgList } from "../modules/services/statics.service";
import { useQueryState } from "react-router-use-location-state";

const HomeHeading = function ({
  children,
  seeMoreTo,
  seeMoreText,
  ...props
}: {
  children: React.ReactNode;
  seeMoreTo?: string;
  seeMoreText?: string;
} & HeadingProps) {
  const { t } = useTranslation();
  return (
    <Heading
      as={Flex}
      alignItems="center"
      justifyContent="space-between"
      size="lg"
      fontSize={["lg", null, "xl", null, "xl"]}
      mb={{ base: 2, md: 3 }}
      {...props}
    >
      <Box>{children}</Box>
      {seeMoreTo && (
        <Button
          variant="ghost"
          colorScheme="n2"
          size="sm"
          as={Link}
          to={seeMoreTo}
          ml={2}
        >
          {seeMoreText || t("See More")}
        </Button>
      )}
    </Heading>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const org = useStoreState((store) => store.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);
  const { data: orgs } = useServerOrgList();
  const { data: trendingSongs, ...trendingStatus } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {}
  );
  const { org: orgParam } = useParams();
  useEffect(() => {
    if (orgParam && orgParam !== org.name) {
      // if it's not the same, then overwrite it.
      const targetOrg = orgs?.filter((x) => x.name === orgParam);
      if (targetOrg && targetOrg.length === 1 && targetOrg[0]) {
        setOrg(targetOrg[0]);
      }
    }
  }, [org, orgParam, orgs, setOrg]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const queueSongs = useSongQueuer();

  const { data: discovery, ...discoveryStatus } = useDiscoveryOrg(org.name);

  const {
    sgp: recPlaylists,
    radios: recRadios,
    ugp: communityPlaylists,
  } = useMemo(() => {
    const sgp: PlaylistStub[] = [];
    const radios: PlaylistStub[] = [];
    const ugp: PlaylistStub[] = [];
    discovery?.recommended?.playlists.forEach((p: PlaylistStub) => {
      if (p.type === "ugp") ugp.push(p);
      else if (p.type.startsWith("radio")) radios.push(p);
      else sgp.push(p);
    });
    return { sgp, radios, ugp };
  }, [discovery]);

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Home")} - Musicdex</title>
      </Helmet>
      <ContainerInlay pt={3}>
        <HomeSection>
          <HomeHeading>{t("Recent Singing Streams")}</HomeHeading>

          {isMobile ? (
            <CardCarousel height={210} width={160} scrollMultiplier={2}>
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

        {recPlaylists?.length && (
          <HomeSection>
            <HomeHeading seeMoreTo="./playlists">
              {t("{{org}} Playlists", { org: org.name })}
            </HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {recPlaylists?.map((p: Partial<PlaylistFull>) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        )}

        {recRadios?.length && (
          <HomeSection>
            <HomeHeading seeMoreTo="./radios">{t("Radios")}</HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {recRadios?.map((p: Partial<PlaylistFull>) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        )}

        {communityPlaylists?.length && (
          <HomeSection>
            <HomeHeading seeMoreTo="./community">
              {t("{{org}} Community Playlists", { org: org.name })}
            </HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {communityPlaylists?.map((p: Partial<PlaylistFull>) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        )}

        <HomeSection>
          <HStack alignItems="flex-end" mb={3}>
            <HomeHeading mb={0}>
              {t("Trending {{org}} Songs", { org: org.name })}
            </HomeHeading>
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
          <CardCarousel
            height={180}
            width={128}
            scrollMultiplier={isMobile ? 2 : 4}
          >
            {trendingSongs?.map((song) => (
              <SongCard song={song} key={song.id} mx={["2px", null, 1, 2]} />
            ))}
          </CardCarousel>
        </HomeSection>

        <HomeSection>
          <HomeHeading seeMoreTo={`./channels`}>
            {t("Discover {{org}}", { org: org.name })}
          </HomeHeading>
          <CardCarousel
            height={180}
            width={160}
            scrollMultiplier={isMobile ? 2 : 4}
            mb={2}
          >
            {discovery?.channels?.slice(0, 10).map((c: Channel) => (
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
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
`;
