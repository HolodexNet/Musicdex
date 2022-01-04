import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { CardCarousel } from "../components/common/CardCarousel";
import { QueryStatus } from "../components/common/QueryStatus";
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

export function Channel() {
  // const history = useStoreState((store) => store.playback.history);
  let params = useParams();
  let channelId = params.id!;

  //const { data: playlist, ...status } = usePlaylist(`:video[id=${channelId}]`);

  const { data: channel, ...channelStatus } = useQuery(
    ["channel", channelId],
    async (q) => {
      return (await axios.get("/api/v2/channels/" + q.queryKey[1])).data;
    },
    { ...DEFAULT_FETCH_CONFIG, cacheTime: 600000 /* 10 mins */ }
  );

  const { data: discovery, ...discoveryStatus } =
    useDiscoveryChannel(channelId);

  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  // const {description, }
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  console.log(channel);
  // useEffect(() => console.log(playlist), [playlist])

  // if (!status.isSuccess)
  //   return <QueryStatus queryStatus={status} /> ;

  if (!channelStatus.isSuccess)
    return <QueryStatus queryStatus={channelStatus} />;
  return (
    <PageContainer>
      <ContainerInlay>
        <HStack>
          <ChannelPhoto
            channelId={channel.id}
            resizePhoto={150}
            size="2xl"
            borderRadius={4}
            mr={4}
          ></ChannelPhoto>
          <PlaylistHeading
            title={channel.name}
            description={channel.org}
            canEdit={false}
            editMode={false}
            count={0}
            max={0}
          />
        </HStack>
        <Box>{JSON.stringify(discovery)}</Box>
        <Heading size="lg" marginBottom={2}>
          Discover more from {channel.org}
        </Heading>
        {discovery && (
          <CardCarousel height={210} width={160} scrollMultiplier={2}>
            {discovery.channels.map((c: Channel) => (
              <ChannelCard channel={c} key={c.id} marginX={2} />
            ))}
          </CardCarousel>
        )}
        <SimpleGrid spacing={3}>
          {discovery &&
            discovery.recommended.playlists.map((x: any) => {
              return <PlaylistCard playlist={x}></PlaylistCard>;
            })}
        </SimpleGrid>
      </ContainerInlay>
    </PageContainer>
  );
}
