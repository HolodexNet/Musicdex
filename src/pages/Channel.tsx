import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { FiList, FiShare2, FiTwitter, FiYoutube } from "react-icons/fi";
import { useQuery } from "react-query";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { BGImg, BGImgContainer } from "../components/common/BGImgContainer";
import { CardCarousel } from "../components/common/CardCarousel";
import { MTHolodexIcon } from "../components/common/MTHolodex";
import { QueryStatus } from "../components/common/QueryStatus";
import { VideoPlaylistCard } from "../components/common/VideoPlaylistCard";
import { SongTable, SongTableCol } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClipboardWithToast } from "../modules/common/clipboard";
import useNamePicker from "../modules/common/useNamePicker";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { useDiscoveryChannel } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreActions } from "../store";
import ChannelSongs from "./ChannelSongs";

export default function Channel() {
  // const history = useStoreState((store) => store.playback.history);
  let params = useParams();
  let channelId = params.id!;

  const { data: channel, ...channelStatus } = useQuery(
    ["channel", channelId],
    async (q) => {
      return (await axios.get("/api/v2/channels/" + q.queryKey[1])).data;
    },
    { ...DEFAULT_FETCH_CONFIG, cacheTime: 600000 /* 10 mins */ }
  );

  const { data: discovery, ...discoveryStatus } =
    useDiscoveryChannel(channelId);

  const { data: trending, ...trendingStatus } = useTrendingSongs({
    channel_id: channelId,
  });

  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const tn = useNamePicker();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (
    channelStatus.isLoading ||
    discoveryStatus.isLoading ||
    trendingStatus.isLoading
  )
    return <QueryStatus queryStatus={channelStatus} />;

  const name = tn(channel.english_name, channel.name);

  return (
    <PageContainer>
      <BGImgContainer height="60vh">
        <BGImg
          banner_url={`https://i.ytimg.com/vi/${discovery?.recentSingingStream?.video.id}/sddefault.jpg`}
          height="33vh"
          blur
        ></BGImg>
      </BGImgContainer>

      <HStack
        mx={isMobile ? 2 : 6}
        my={6}
        flexWrap={isMobile ? "wrap" : "unset"}
      >
        <HStack>
          <ChannelPhoto
            channelId={channel.id}
            resizePhoto={isMobile ? 100 : 150}
            size={isMobile ? "xl" : "2xl"}
            borderRadius={4}
            mr={isMobile ? 2 : 6}
            shadow="lg"
          ></ChannelPhoto>
          <PlaylistHeading
            title={name}
            description={
              channel.org +
              (channel?.suborg?.slice(2)
                ? " — " + channel?.suborg?.slice(2)
                : "")
            }
            canEdit={false}
            editMode={false}
            count={0}
            max={0}
            textShadow="1px 1px 5px var(--chakra-colors-bgAlpha-500);"
          />
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
  channel: any;
}) {
  const copy = useClipboardWithToast();

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
    <SimpleGrid
      spacing={isMobile ? 4 : 2}
      columns={isMobile ? 4 : 2}
      {...(isMobile ? { pt: 2, mb: -2, width: "100%", pr: "0.5rem" } : {})}
    >
      <IconButton
        {...style}
        icon={<FiShare2 />}
        onClick={() => {
          copy(window.location.toString());
        }}
        aria-label="Copy URL"
        title="Copy Share URL"
      />
      <IconButton
        {...style}
        icon={<MTHolodexIcon width="18px" back="#eee" />}
        aria-label="Holodex"
        title="Open In Holodex"
        as="a"
        href={"https://holodex.net/channel/" + channel.id}
        target="_blank"
      />
      <IconButton
        {...style}
        icon={<FiYoutube />}
        color="red.100"
        aria-label="Youtube"
        title="Youtube"
        as="a"
        href={"https://youtube.com/channel/" + channel.id}
        target="_blank"
      />
      {channel.twitter && (
        <IconButton
          {...style}
          color="twitter.100"
          icon={<FiTwitter />}
          aria-label="Twitter"
          title="Twitter"
          as="a"
          href={"https://twitter.com/" + channel.twitter}
          target="_blank"
        />
      )}
    </SimpleGrid>
  );
}

function ChannelContent({
  discovery,
  trending,
  queueSongs,
  name,
  channel,
}: {
  discovery: any;
  trending: Song[] | undefined;
  queueSongs: (_: { songs: Song[]; immediatelyPlay: boolean }) => void;
  name: any;
  channel: any;
}) {
  const hideCol = useBreakpointValue<SongTableCol[] | undefined>(
    {
      base: ["idx", "og_artist", "sang_on", "duration"],
      sm: ["idx", "og_artist", "sang_on"],
      md: ["idx", "og_artist"],
      lg: [],
      xl: [],
    },
    "xl"
  );
  return (
    <>
      <Flex flexWrap="wrap" flexDirection="column">
        {trending && (
          <Box flex="1 1 140px" minWidth="300px">
            <Heading size="md" my={4} ml={2}>
              Popular
              <Button
                variant="ghost"
                size="sm"
                py={0}
                // my={-2}
                colorScheme="n2"
                float="right"
                onClick={() => {
                  queueSongs({ songs: trending, immediatelyPlay: false });
                }}
              >
                Queue ({trending.length})
              </Button>
            </Heading>
            <SongTable
              songs={trending.slice(0, 10)}
              rowProps={{
                // hideCol: ["og_artist", "menu"],
                flipNames: true,
                showArtwork: true,
              }}
              limit={5}
              appendRight={
                <Button
                  variant="ghost"
                  size="md"
                  colorScheme="n2"
                  leftIcon={<FiList />}
                  as={Link}
                  to={"/channel/" + channel.id + "/songs"}
                  float="right"
                >
                  See All Songs
                </Button>
              }
            />
          </Box>
        )}
      </Flex>
      {discovery?.recentSingingStream?.playlist && (
        <>
          <Heading size="md" mt={4}>
            Latest Streams
          </Heading>
          <CardCarousel height={250} width={160} scrollMultiplier={1}>
            {/* TODO: Fetch more recent streams */}
            <PlaylistCard
              playlist={discovery?.recentSingingStream?.playlist}
              key={"kpc" + discovery?.recentSingingStream?.playlist.id}
            />
          </CardCarousel>
        </>
      )}
      <Heading size="md" mt={4}>
        Featuring {name}
      </Heading>
      <CardCarousel height={250} width={160} scrollMultiplier={1}>
        {discovery &&
          discovery.recommended.playlists.map((x: any) => {
            return (
              <PlaylistCard playlist={x} marginX={2} key={x.id}></PlaylistCard>
            );
          })}
      </CardCarousel>
      <Heading size="md" mt={4}>
        Discover more from {channel.org}
      </Heading>
      {discovery && (
        <CardCarousel height={210} width={160} scrollMultiplier={2}>
          {discovery.channels.map((c: Channel) => (
            <ChannelCard channel={c} key={c.id} marginX={2} />
          ))}
        </CardCarousel>
      )}
    </>
  );
}
