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
  const copy = useClipboardWithToast();

  if (!channelStatus.isSuccess)
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

      <HStack mx={6} my={6}>
        <ChannelPhoto
          channelId={channel.id}
          resizePhoto={150}
          size="2xl"
          borderRadius={4}
          mr={6}
          shadow="lg"
        ></ChannelPhoto>
        <PlaylistHeading
          title={name}
          description={channel.org + " — " + channel?.suborg?.slice(2)}
          canEdit={false}
          editMode={false}
          count={0}
          max={0}
          textShadow="1px 1px 5px var(--chakra-colors-bgAlpha-500);"
        />
        <Spacer />
        <SimpleGrid spacing={2} columns={2}>
          <IconButton
            colorScheme="bgAlpha"
            icon={<FiShare2 />}
            onClick={() => {
              copy(window.location.toString());
            }}
            aria-label="Copy URL"
            title="Copy Share URL"
          />
          <IconButton
            colorScheme="bgAlpha"
            icon={<MTHolodexIcon width="18px" />}
            aria-label="Holodex"
            title="Open In Holodex"
            as="a"
            href={"https://holodex.net/channel/" + channel.id}
            target="_blank"
          />
          <IconButton
            colorScheme="bgAlpha"
            icon={<FiYoutube />}
            aria-label="Youtube"
            title="Youtube"
            as="a"
            href={"https://youtube.com/channel/" + channel.id}
            target="_blank"
          />
          {channel.twitter && (
            <IconButton
              colorScheme="bgAlpha"
              icon={<FiTwitter />}
              aria-label="Twitter"
              title="Twitter"
              as="a"
              href={"https://twitter.com/" + channel.twitter}
              target="_blank"
            />
          )}
        </SimpleGrid>
      </HStack>
      <ContainerInlay>
        <Routes>
          <Route
            path="/"
            element={channelContent(
              discovery,
              trending,
              queueSongs,
              name,
              channel
            )}
          ></Route>
          <Route path="/songs" element={<ChannelSongs />}></Route>
        </Routes>
      </ContainerInlay>
    </PageContainer>
  );
}
function channelContent(
  discovery: any,
  trending: Song[] | undefined,
  queueSongs: (_: { songs: Song[]; immediatelyPlay: boolean }) => void,
  name: any,
  channel: any
) {
  return (
    <>
      <Flex flexWrap="wrap" flexDirection="row">
        {discovery?.recentSingingStream && (
          <Box flex="1.3 0 580px" minWidth="480px" mr={4}>
            <Heading size="md" marginBottom={2}>
              Latest Stream:
            </Heading>
            <VideoPlaylistCard
              video={discovery?.recentSingingStream?.video}
              playlist={discovery?.recentSingingStream?.playlist}
            />
          </Box>
        )}
        {trending && (
          <Box flex="1 1 140px" minWidth="300px">
            <Heading size="md" marginBottom={2}>
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
              {trending?.map((x) => (
                <SongItem song={x}></SongItem>
              ))}
            </Box>
          </Box>
        )}
      </Flex>
      <Heading size="md" my={2}>
        Playlists with {name}
      </Heading>
      <CardCarousel height={250} width={160} scrollMultiplier={1}>
        {discovery &&
          discovery.recommended.playlists.map((x: any) => {
            return <PlaylistCard playlist={x} marginX={2}></PlaylistCard>;
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
      <Heading size="md" my={2}>
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
