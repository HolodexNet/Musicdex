import { useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import {
  FiList,
  FiShare2,
  FiTwitter,
  FiYoutube,
  FiSearch,
  FiHeart,
} from "react-icons/fi";
import { useQuery } from "react-query";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { BGImg, BGImgContainer } from "../components/layout/BGImgContainer";
import { CardCarousel } from "../components/common/CardCarousel";
import { MTHolodexIcon } from "../components/icons/MTHolodex";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClipboardWithToast } from "../modules/common/clipboard";
import useNamePicker from "../modules/common/useNamePicker";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { useDiscoveryChannel } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useSongQueuer } from "../utils/SongQueuerHook";
import ChannelSongs from "./ChannelSongs";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  useFavorites,
  useFavoritesUpdater,
} from "../modules/services/favorite.service";
import { useClient } from "../modules/client";
import { IconType } from "react-icons/lib";

export default function Channel() {
  const { t } = useTranslation();
  let params = useParams();
  let channelId = params.id!;

  const { data: channel, ...channelStatus } = useQuery<Channel, AxiosError>(
    ["channel", channelId],
    async (q) => {
      return (await axios.get("/api/v2/channels/" + q.queryKey[1])).data;
    },
    { ...DEFAULT_FETCH_CONFIG, cacheTime: 600000 /* 10 mins */ },
  );

  const { data: discovery, ...discoveryStatus } =
    useDiscoveryChannel(channelId);

  const { data: trending, ...trendingStatus } = useTrendingSongs({
    channel_id: channelId,
  });

  const queueSongs = useSongQueuer();
  const tn = useNamePicker();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (
    channelStatus.isLoading ||
    discoveryStatus.isLoading ||
    trendingStatus.isLoading
  )
    return <QueryStatus queryStatus={channelStatus} />;

  const name = tn(channel?.english_name, channel?.name) ?? "";

  return (
    <PageContainer>
      <Helmet>
        <title>{name} - Musicdex</title>
      </Helmet>
      <BGImgContainer height="60vh">
        <BGImg
          banner_url={`https://i.ytimg.com/vi/${discovery?.recentSingingStreams?.[0].video.id}/sddefault.jpg`}
          height="33vh"
          blur
        />
      </BGImgContainer>

      <HStack
        mx={isMobile ? 2 : 6}
        my={6}
        flexWrap={isMobile ? "wrap" : "unset"}
        rowGap={4}
      >
        <HStack>
          <ChannelPhoto
            channelId={channel?.id}
            resizePhoto={isMobile ? 100 : 150}
            size={isMobile ? "xl" : "2xl"}
            borderRadius={4}
            mr={isMobile ? 2 : 6}
            shadow="xl"
          ></ChannelPhoto>
          <Link to={`/?org=${encodeURIComponent(channel?.org ?? "")}`}>
            <PlaylistHeading
              title={name}
              description={
                channel?.org +
                (channel?.suborg?.slice(2)
                  ? " — " + channel?.suborg?.slice(2)
                  : "")
              }
              count={0}
              max={0}
              textShadow="1px 1px 5px var(--chakra-colors-bgAlpha-500);"
            />
          </Link>
        </HStack>
        {!isMobile && <Spacer />}
        <ChannelSocialButtons isMobile={isMobile} channel={channel} />
      </HStack>
      <ContainerInlay>
        <Routes>
          <Route
            path="/"
            element={
              <ChannelContent
                discovery={discovery}
                trending={trending}
                queueSongs={queueSongs}
                name={name}
                channel={channel}
              ></ChannelContent>
            }
          ></Route>
          <Route path="/songs" element={<ChannelSongs />}></Route>
        </Routes>
      </ContainerInlay>
    </PageContainer>
  );
}

function ChannelSocialButtons({
  isMobile,
  channel,
}: {
  isMobile: boolean | undefined;
  channel: Channel | undefined;
}) {
  const { isLoggedIn } = useClient();
  const { t } = useTranslation();
  const copy = useClipboardWithToast();
  const { data: favorites } = useFavorites();
  const { mutate } = useFavoritesUpdater();

  const isFavorited = favorites
    ?.map((channel) => channel.id)
    .includes(channel?.id ?? "");
  const favoriteBtnText = isFavorited
    ? "Remove from Favorites"
    : "Add to Favorites";

  const style = {
    color: "white",
    bgColor: "#fff2",
    border: "2px solid #fff5",
    _hover: {
      bgColor: "var(--chakra-colors-n2-800)",
      boxShadow: "lg",
      transform: "translateY(-3px) scale(1.1);",
    },
  };
  return (
    <Grid
      gap={isMobile ? 4 : 2}
      templateRows="repeat(2, 1fr)"
      templateColumns={
        isMobile || isFavorited ? "repeat(4, 1fr)" : "repeat(2, 1fr)"
      }
      {...(isMobile ? { pt: 2, mb: -2, width: "100%", pr: "0.5rem" } : {})}
    >
      {isLoggedIn && (
        <GridItem colStart={1} colEnd={5}>
          <Button
            {...style}
            bgColor={isFavorited ? "n2.700" : style.bgColor}
            w="full"
            leftIcon={<FiHeart />}
            onClick={() => {
              channel &&
                mutate({
                  channelId: channel.id,
                  action: isFavorited ? "remove" : "add",
                });
            }}
            aria-label={favoriteBtnText}
            title={t(favoriteBtnText)}
          >
            {t(favoriteBtnText)}
          </Button>
        </GridItem>
      )}
      <IconButton
        {...style}
        icon={<FiShare2 />}
        onClick={() => {
          copy(window.location.toString());
        }}
        aria-label="Copy URL"
        title={t("Copy link")}
      />
      <IconButton
        {...style}
        icon={<MTHolodexIcon width="18px" back="#eee" />}
        aria-label="Holodex"
        title={t("Open in Holodex")}
        as="a"
        href={"https://holodex.net/channel/" + channel?.id}
        target="_blank"
      />
      <IconButton
        {...style}
        icon={<FiYoutube />}
        color="red.100"
        aria-label="YouTube"
        title="YouTube"
        as="a"
        href={"https://youtube.com/channel/" + channel?.id}
        target="_blank"
      />
      {channel?.twitter && (
        <IconButton
          {...style}
          color="twitter.100"
          icon={<FiTwitter />}
          aria-label="Twitter"
          title="Twitter"
          as="a"
          href={"https://twitter.com/" + channel?.twitter}
          target="_blank"
        />
      )}
    </Grid>
  );
}

interface PlaylistButton {
  label: string;
  link: string;
  icon: IconType;
}

function PlaylistButtons({ buttons }: { buttons: PlaylistButton[] }) {
  const { t } = useTranslation();
  return (
    <>
      {buttons.map(({ label, icon, link }) => (
        <Button
          variant="ghost"
          size="md"
          colorScheme="n2"
          leftIcon={<Icon as={icon} />}
          as={Link}
          to={link}
          float="right"
          textTransform="uppercase"
        >
          {t(label)}
        </Button>
      ))}
    </>
  );
}

function ChannelContent({
  discovery,
  trending,
  queueSongs,
  name,
  channel,
}: {
  discovery?: ChannelDiscovery;
  trending: Song[] | undefined;
  queueSongs: (_: { songs: Song[]; immediatelyPlay: boolean }) => void;
  name: string;
  channel?: Channel;
}) {
  const { t } = useTranslation();
  const scrollAmount = useBreakpointValue({ base: 2, md: 4 }) ?? 4;

  const buttonData = useMemo(
    () => [
      {
        label: "See All Songs",
        link: "/channel/" + channel?.id + "/songs",
        icon: FiList,
      },
      {
        label: "Search Songs",
        link: `/searchV2?mode=fuzzy&ch=["${channel?.name}"]`,
        icon: FiSearch,
      },
    ],
    [channel],
  );

  return (
    <VStack w="100%">
      {trending && (
        <VStack w="100%">
          <HStack w="100%" align="center" justify="space-between">
            <Heading size="md" mt={4} mb={2}>
              {t("Popular")}
            </Heading>
            <Button
              variant="ghost"
              size="sm"
              py={0}
              colorScheme="n2"
              float="right"
              onClick={() => {
                queueSongs({ songs: trending, immediatelyPlay: false });
              }}
            >
              {t("Queue ({{amount}})", { amount: trending.length })}
            </Button>
          </HStack>
          <Box w="100%" flex="1 1 140px" minWidth="300px">
            <SongTable
              songs={trending.slice(0, 10)}
              rowProps={{
                // hideCol: ["og_artist", "menu"],
                flipNames: true,
                showArtwork: true,
              }}
              limit={5}
              appendRight={<PlaylistButtons buttons={buttonData} />}
            />
          </Box>
        </VStack>
      )}
      {discovery?.recentSingingStreams?.filter(
        (stream) => stream.playlist?.content?.length,
      ).length && (
        <VStack w="100%" align="flex-start">
          <Heading size="md" mt={4} mb={2}>
            {t("Latest Streams")}
          </Heading>
          <CardCarousel
            w="100%"
            height={230}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discovery?.recentSingingStreams
              .filter((stream) => stream.playlist?.content?.length)
              .map((stream) => (
                <PlaylistCard
                  playlist={stream.playlist!}
                  key={"kpc" + stream.playlist?.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
          </CardCarousel>
        </VStack>
      )}
      {discovery?.recommended?.playlists?.length && (
        <VStack w="100%" align="flex-start">
          <Heading size="md" mt={4} mb={2}>
            {t("Featuring {{name}}", { name })}
          </Heading>
          <CardCarousel
            w="100%"
            height={230}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discovery.recommended.playlists.map((x) => {
              return (
                <PlaylistCard
                  playlist={x}
                  marginX={["2px", null, 1, 2]}
                  key={x.id}
                ></PlaylistCard>
              );
            })}
          </CardCarousel>
        </VStack>
      )}
      <VStack w="100%" align="flex-start">
        <Heading size="md" mt={4} mb={2}>
          {t("Discover more from {{org}}", { org: channel?.org })}
        </Heading>
        {discovery && (
          <CardCarousel
            w="100%"
            height={180}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discovery.channels?.slice(0, 10).map((c) => (
              <ChannelCard
                channel={c}
                key={c.id}
                marginX={["2px", null, 1, 2]}
              />
            ))}
          </CardCarousel>
        )}
      </VStack>
    </VStack>
  );
}
