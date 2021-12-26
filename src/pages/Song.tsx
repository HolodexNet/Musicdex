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
import { SongArtwork } from "../components/song/SongArtwork";
import { useSong } from "../modules/services/songs.service";
import { resizeArtwork } from "../modules/songs/utils";
import { useStoreActions } from "../store";

export function Song() {
  let params = useParams();
  let songId = params.songId!;

  // const { t, i18n } = useTranslation();
  const t = (str: string, ..._: any) => str;

  const imageSize =
    useBreakpointValue({
      sm: 200,
      base: 300,
      md: 400,
      lg: 400,
    }) || 300;

  const { data: song, isLoading, isFetching, error, isError } = useSong(songId);

  const queueSong = useStoreActions((actions) => actions.playback.queueSongs);

  return (
    <PageContainer>
      {isLoading && <Loading />}
      {song && (
        <Flex wrap="wrap">
          <SongArtwork song={song} size={imageSize} p={3} />
          <Flex flexDirection="column" px={3} py={5} flex="1 1 300px">
            <Box marginTop="auto">
              <Text fontSize="3xl" fontWeight={600}>
                {song.name}
              </Text>
              <HStack py={2}>
                <ChannelPhoto channelId={song.channel_id} resizePhoto={30} />
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
