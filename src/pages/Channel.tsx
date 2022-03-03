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
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { SongItem } from "../components/song/SongItem";
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
          height="66vh"
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
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Flex flexWrap="wrap" flexDirection="row">
        {discovery?.recentSingingStream &&
          (!isMobile ? (
            <Box flex="1.3 0 580px" minWidth="480px" mr={4}>
              <Heading size="md" marginBottom={2} ml={2}>
                Latest Stream:
              </Heading>
              <VideoPlaylistCard
                video={discovery?.recentSingingStream?.video}
                playlist={discovery?.recentSingingStream?.playlist}
              />
            </Box>
          ) : (
            discovery?.recentSingingStream?.playlist && (
              <Box mb={4}>
                <Heading size="md" marginBottom={2} ml={2}>
                  Latest Stream:
                </Heading>

                <PlaylistCard
                  playlist={discovery?.recentSingingStream?.playlist}
                  key={"kpc" + discovery?.recentSingingStream?.playlist.id}
                />
              </Box>
            )
          ))}
        {trending && (
          <Box flex="1 1 140px" minWidth="300px">
            <Heading size="md" marginBottom={2} ml={2}>
              Popular Songs:{" "}
              <Button
                variant="ghost"
                size="sm"
                py={0}
                my={-2}
                colorScheme="n2"
                onClick={() => {
                  queueSongs({ songs: trending, immediatelyPlay: false });
                }}
              >
                Queue All ({trending.length})
              </Button>
            </Heading>
            <Box overflow="auto" height="300px">
              {/* {trending?.map((x) => (
                <SongItem song={x} key={"l-t-" + x.id}></SongItem>
              ))} */}
              <SongTable
                songs={trending}
                rowProps={{
                  hideCol: ["idx", "og_artist", "duration", "menu", "sang_on"],
                  flipNames: true,
                  showArtwork: true,
                }}
              />
            </Box>
          </Box>
        )}
      </Flex>
      <Heading size="md" mt={2} ml={2}>
        Playlists with {name}
      </Heading>
      <CardCarousel height={250} width={160} scrollMultiplier={1}>
        {discovery &&
          discovery.recommended.playlists.map((x: any) => {
            return (
              <PlaylistCard playlist={x} marginX={2} key={x.id}></PlaylistCard>
            );
          })}
      </CardCarousel>
      <ContainerInlay width="100%" pt={0}>
        <Center>
          <Button
            variant="ghost"
            size="lg"
            my={4}
            width="100%"
            height="50px"
            colorScheme="n2"
            leftIcon={<FiList />}
            as={Link}
            to={"/channel/" + channel.id + "/songs"}
          >
            See All Songs
          </Button>
        </Center>
      </ContainerInlay>
      <Heading size="md" mt={2} ml={2}>
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
