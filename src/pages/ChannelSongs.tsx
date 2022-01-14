import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiList,
  FiShare2,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { CardCarousel } from "../components/common/CardCarousel";
import { MTHolodexIcon } from "../components/common/MTHolodex";
import { QueryStatus } from "../components/common/QueryStatus";
import { VideoPlaylistCard } from "../components/common/VideoPlaylistCard";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { useDiscoveryChannel } from "../modules/services/discovery.service";
import { useHistory } from "../modules/services/history.service";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { BGImgContainer, BGImg } from "../components/common/BGImgContainer";
import {
  useSongAPI,
  useTrendingSongs,
} from "../modules/services/songs.service";
import { SongCard } from "../components/song/SongCard";
import { SongItem } from "../components/song/SongItem";
import useNamePicker from "../modules/common/useNamePicker";
import { useClipboardWithToast } from "../modules/common/clipboard";
const PERPAGE = 10;
export default function ChannelSongs() {
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

  const [offset, setOffset] = useState(0);
  const { data, ...trendingStatus } = useSongAPI({
    channel_id: channelId,
    paginated: true,
    limit: PERPAGE,
    offset: offset,
  });

  const { items: latest, total } = useMemo(
    () => (data as any) || { items: undefined, total: 0 },
    [data]
  );
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const tn = useNamePicker();
  const copy = useClipboardWithToast();
  const navigate = useNavigate();

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
          onClick={(e) => {
            e.preventDefault();
            navigate("/channel/" + channel.id);
          }}
          cursor="pointer"
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
        <Button
          variant="solid"
          width="35px"
          height="35px"
          size="40px"
          left="10px"
          borderRadius="full"
          position="relative"
          as="a"
          href={"/channel/" + channel.id}
          onClick={(e) => {
            e.preventDefault();
            navigate("/channel/" + channel.id);
          }}
        >
          <FiArrowLeft />
        </Button>

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
        {/* <Box>{JSON.stringify(discovery)}</Box> */}

        {latest && (
          <Box flex="1 1 140px" minWidth="300px">
            <Heading size="md" marginBottom={2}>
              All Songs ({offset} - {offset + latest.length} of {total}):{" "}
              <Button
                variant="ghost"
                size="sm"
                py={0}
                my={-2}
                colorScheme="n2"
                onClick={() => {
                  queueSongs({ songs: latest, immediatelyPlay: false });
                }}
              >
                Queue All ({latest.length})
              </Button>
            </Heading>
            <Box overflow="auto" maxH="62vh">
              <Suspense fallback={<div>Loading...</div>}>
                <SongTable songs={latest}></SongTable>
              </Suspense>
            </Box>
            <ButtonGroup colorScheme="brand" mt="3" spacing="5">
              <Button
                onClick={() =>
                  setOffset((e) =>
                    Math.max(
                      Math.min(
                        Math.floor(total / PERPAGE) * PERPAGE,
                        e - PERPAGE
                      ),
                      0
                    )
                  )
                }
              >
                <FiArrowLeft />
              </Button>
              <Editable
                key={offset}
                defaultValue={String(Math.floor(offset / PERPAGE) + 1)}
                fontSize="xl"
                onSubmit={(e) => {
                  const n = Number.parseInt(e);
                  setOffset(
                    Math.max(
                      Math.min(
                        Math.floor(total / PERPAGE) * PERPAGE,
                        (n - 1) * PERPAGE
                      ),
                      0
                    )
                  );
                }}
              >
                <EditablePreview />
                <EditableInput
                  width="30px"
                  type="number"
                  min="1"
                  max={Math.ceil(total / PERPAGE)}
                />
              </Editable>
              <Button
                onClick={() =>
                  setOffset((e) =>
                    Math.max(
                      Math.min(
                        Math.floor(total / PERPAGE) * PERPAGE,
                        e + PERPAGE
                      ),
                      0
                    )
                  )
                }
              >
                <FiArrowRight />
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
