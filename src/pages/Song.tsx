import {
  Box,
  Button,
  Image,
  useBreakpointValue,
  Text,
  Link,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { Loading } from "../components/common/Loading";
import { PageContainer } from "../components/layout/PageContainer";
import { useSong } from "../modules/services/songs.service";
import { resizeArtwork } from "../modules/songs/utils";
import { useStoreActions } from "../store";

export function Song() {
  let params = useParams();
  let songId = params.songId!;

  const { t, i18n } = useTranslation();
  const breakpoint = useBreakpointValue({
    base: 200,
    lg: 300,
  });

  const { data: song, isLoading, isFetching, error, isError } = useSong(songId);
  const resizedArt = useMemo(
    () => (song ? resizeArtwork(song.art, breakpoint) : undefined),
    [song, breakpoint]
  );

  const queueSong = useStoreActions((actions) => actions.playback.queueSongs);

  return (
    <PageContainer>
      {isLoading && <Loading />}
      {song && (
        <Flex>
          <Image p={3} src={resizedArt} alt={song.name} />
          <Flex flexDirection="column" p={3}>
            <Box marginTop="auto">
              <Text fontSize="3xl" fontWeight={600}>
                {song.name}
              </Text>

              <HStack py={2}>
                <ChannelPhoto channelId={song.channel_id} size={40} />
                <Link>
                  <Text fontSize="2xl" color="n2.300">
                    {song.channel.english_name || song.channel.name}
                  </Text>
                </Link>
              </HStack>
              <Text color="whiteAlpha.600" fontSize="lg">
                {song.original_artist}
              </Text>
              <Text fontSize="md" color="whiteAlpha.600">
                {`${song.end - song.start}s`} •{" "}
                {t("relativeDate", { date: new Date(song.available_at) })}
              </Text>
            </Box>
            <Button
              onClick={() => {
                queueSong({ songs: [song], immediatelyPlay: true });
              }}
              marginTop="auto"
              maxWidth="200px"
            >
              Play
            </Button>
          </Flex>
        </Flex>
      )}
    </PageContainer>
  );
}
