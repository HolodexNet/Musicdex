import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BiMovie } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { FiShare2, FiYoutube } from "react-icons/fi";
import { IoMdPlay } from "react-icons/io";
import { SiApplemusic } from "react-icons/si";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { QueryStatus } from "../components/common/QueryStatus";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { SongArtwork } from "../components/song/SongArtwork";
import { SongLikeButton } from "../components/song/SongLikeButton";
import { useClipboardWithToast } from "../modules/common/clipboard";
import useNamePicker from "../modules/common/useNamePicker";
import { useSong } from "../modules/services/songs.service";
import { useStoreActions } from "../store";
import { formatSeconds } from "../utils/SongHelper";

export default function Song() {
  let params = useParams();
  let songId = params.songId!;

  const { t, i18n } = useTranslation();
  // const t = (str: string, ..._: any) => str;

  const imageSize =
    useBreakpointValue({
      sm: 200,
      base: 300,
      md: 400,
      lg: 400,
    }) || 300;

  const { data: song, ...rest } = useSong(songId);

  const queueSong = useStoreActions((actions) => actions.playback.queueSongs);
  const clip = useClipboardWithToast();
  const tn = useNamePicker();

  return (
    <PageContainer>
      <ContainerInlay>
        <QueryStatus queryStatus={rest} />
        {song && (
          <Flex wrap="wrap">
            <SongArtwork
              song={song}
              size={imageSize}
              m={4}
              style={{
                WebkitBoxReflect:
                  "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0) 80%, rgba(0,0,0,0.3))",
              }}
            />
            <Flex flexDirection="column" px={4} py={4} flex="1 1 300px">
              <Box marginTop="auto">
                <Text fontSize="3xl" fontWeight={600}>
                  {song.name}
                </Text>
                <HStack py={2}>
                  <Link to={"/channel/" + song.channel_id}>
                    <ChannelPhoto
                      channelId={song.channel_id}
                      resizePhoto={30}
                    />
                    <Text
                      fontSize="2xl"
                      color="n2.300"
                      as="span"
                      display="inline-block"
                      lineHeight="48px"
                      ml={2}
                    >
                      {tn(song.channel.english_name, song.channel.name)}
                    </Text>
                  </Link>
                </HStack>
                <Text opacity={0.75} fontSize="lg">
                  {song.original_artist}
                </Text>
                <Text fontSize="md" opacity={0.75}>
                  {formatSeconds(song.end - song.start)} •{" "}
                  {t("NO_TL.relativeDate", {
                    date: new Date(song.available_at),
                  })}
                  {song.is_mv && (
                    <Icon mb="-3px" ml={3} as={BiMovie} title="MV"></Icon>
                  )}
                </Text>
              </Box>

              <HStack spacing={2} mt={4}>
                <Button
                  onClick={() => {
                    queueSong({ songs: [song], immediatelyPlay: true });
                  }}
                  marginTop="auto"
                  // maxWidth="200px"
                  // minW="120px"
                  size="lg"
                  title="Play"
                  rightIcon={<FaPlay style={{ scale: "1" }} />}
                >
                  Play
                </Button>
                <Button
                  variant="ghost"
                  aria-label="share link"
                  size="md"
                  onClick={() => clip(window.location.toString(), false)}
                  colorScheme="n2"
                  title="Copy Song Link"
                >
                  <FiShare2 />
                </Button>
                <Button
                  variant="ghost"
                  aria-label="youtube"
                  size="md"
                  onClick={() =>
                    window.open(
                      `https://youtu.be/${song.video_id}?t=${song.start}`,
                      "_blank"
                    )
                  }
                  colorScheme="n2"
                  title="Open Youtube"
                >
                  <FiYoutube />
                </Button>

                <SongLikeButton song={song}></SongLikeButton>
                {song.amUrl && (
                  <Button
                    as="a"
                    href={song.amUrl}
                    target="_blank"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<SiApplemusic style={{ scale: "1.5" }} />}
                  >
                    Listen to original on Apple Music
                  </Button>
                )}
              </HStack>
            </Flex>
          </Flex>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
