import {
  Box,
  Button,
  Container,
  Image,
  useBreakpointValue,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Loading } from "../components/common/Loading";
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
    <Container
      alignContent="stretch"
      maxW={{ lg: "7xl" }}
      p={{ base: 0, xl: 4 }}
    >
      {isLoading && <Loading />}
      {song && (
        <Flex>
          <Image p={3} src={resizedArt} alt={song.name} />
          <Flex flexDirection="column" p={3}>
            <Box marginTop="auto">
              <Text fontSize="3xl" fontWeight={600}>
                {song.name}
              </Text>
              <Link>
                <Text fontSize="2xl" color="n2.300">
                  {song.channel.english_name || song.channel.name}
                </Text>
              </Link>
              <Text color="whiteAlpha.600">{song.original_artist}</Text>
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
    </Container>
  );
}
