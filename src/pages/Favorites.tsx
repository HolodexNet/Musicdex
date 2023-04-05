import { useMemo } from "react";
import { useBreakpointValue, Box, BoxProps } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardCarousel } from "../components/common/CardCarousel";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { VideoPlaylistCarousel } from "../components/playlist/VideoPlaylistCarousel";
import { useDiscoveryFavorites } from "../modules/services/discovery.service";
import { useLikedSongs } from "../modules/services/like.service";
import { SongCard } from "../components/song/SongCard";
import { HomeHeading } from "./Home";
import { ChannelCard } from "../components/channel/ChannelCard";

export default function Favorites() {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    data: paginatedSongs,
    isPreviousData,
    ...status
  } = useLikedSongs(1, { keepPreviousData: true });

  const { data: discovery } = useDiscoveryFavorites();

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
        <title>{t("Favorites")}</title>
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

        {recRadios?.length ? (
          <HomeSection>
            <HomeHeading seeMoreTo="./radios">
              {t("Favorites Radios")}
            </HomeHeading>
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
        ) : null}

        {paginatedSongs?.content.length && (
          <HomeSection>
            <HomeHeading seeMoreTo="/liked">{t("Liked Songs")}</HomeHeading>
            <CardCarousel
              height={180}
              width={128}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {[...paginatedSongs.content]
                .sort(() => Math.random() - 0.5)
                .map((song) => (
                  <SongCard
                    song={song}
                    key={song.id}
                    mx={["2px", null, 1, 2]}
                  />
                ))}
            </CardCarousel>
          </HomeSection>
        )}

        <HomeSection>
          <HomeHeading seeMoreTo={`./channels`}>
            {t("Discover Favorites")}
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

function HomeSection({ children }: BoxProps) {
  return (
    <Box mt={3} mb={2}>
      {children}
    </Box>
  );
}
