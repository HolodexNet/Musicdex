import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useContextMenu } from "react-contexify";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { BiMovie } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import {
  FiMoreHorizontal,
  FiSearch,
  FiShare2,
  FiYoutube,
} from "react-icons/fi";
import { SiApplemusic } from "react-icons/si";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { QueryStatus } from "../components/common/QueryStatus";
import { useDraggableSong } from "../components/data/DraggableSong";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { SongArtwork } from "../components/song/SongArtwork";
import { DEFAULT_MENU_ID } from "../components/song/SongContextMenu";
import { SongLikeButton } from "../components/song/SongLikeButton";
import { useClipboardWithToast } from "../modules/common/clipboard";
import useNamePicker from "../modules/common/useNamePicker";
import { useSong } from "../modules/services/songs.service";
import { formatSeconds } from "../utils/SongHelper";
import { useSongQueuer } from "../utils/SongQueuerHook";

export default function Song() {
  let params = useParams();
  let songId = params.songId!;

  const { t } = useTranslation();

  const imageSize =
    useBreakpointValue({
      sm: 200,
      base: 200,
      md: 250,
      lg: 300,
    }) || 300;
  const { data: song, ...rest } = useSong(songId);

  const queueSongs = useSongQueuer();
  const clip = useClipboardWithToast();
  const tn = useNamePicker();
  const channelName = song && tn(song.channel.english_name, song.channel.name);
  const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
  const dragSongProps = useDraggableSong(song!);
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Helmet>
        <title>
          {song ? `${song.name} - ${channelName}` : "Unknown Song"} - Musicdex
        </title>
      </Helmet>
      <ContainerInlay>
        <QueryStatus queryStatus={rest} />
        {song && (
          <Flex
            flexDirection={["column", null, null, "row"]}
            justifyContent="start"
            alignItems={["center", null, null, "end"]}
          >
            <SongArtwork
              song={song}
              size={imageSize}
              m={4}
              style={{
                WebkitBoxReflect:
                  "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0) 80%, rgba(0,0,0,0.3))",
              }}
              {...dragSongProps}
            />
            <Flex
              flexDirection="column"
              p={4}
              alignItems={["center", null, null, "start"]}
            >
              <HStack>
                <Text fontSize="3xl" fontWeight={600}>
                  {song.name}
                </Text>
                <SongLikeButton size={24} song={song}></SongLikeButton>
              </HStack>

              <HStack py={2}>
                <Link to={"/channel/" + song.channel_id}>
                  <ChannelPhoto channelId={song.channel_id} resizePhoto={30} />
                  <Text
                    fontSize="2xl"
                    color="n2.300"
                    as="span"
                    display="inline-block"
                    lineHeight="48px"
                    ml={2}
                  >
                    {channelName}
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

              <HStack spacing={2} mt={4} flexWrap="wrap">
                <Button
                  onClick={() => {
                    queueSongs({ songs: [song], immediatelyPlay: true });
                  }}
                  marginTop="auto"
                  // bgColor="brand.100"
                  size="md"
                  title="Play"
                  flexBasis={["100%", "auto"]}
                  leftIcon={<FaPlay style={{ scale: "1" }} />}
                  colorScheme="n2"
                >
                  {t("Play")}
                </Button>
                {/* <Button
                  variant="ghost"
                  aria-label="share link"
                  size="md"
                  onClick={() => clip(window.location.toString(), false)}
                  colorScheme="n2"
                  title={t("Copy link")}
                >
                  <FiShare2 />
                </Button> */}
                {/* <Button
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
                  title={t("Open in YouTube")}
                >
                  <FiYoutube />
                </Button> */}

                <Button
                  variant="ghost"
                  aria-label="search"
                  size="md"
                  onClick={() => {
                    const search = new URLSearchParams();
                    search.set("song", JSON.stringify(song.name));
                    navigate({
                      pathname: "/search",
                      search: `?${search}`,
                    });
                  }}
                  colorScheme="n2"
                  title={t("Find similar")}
                  leftIcon={<FiSearch />}
                >
                  {t("Find similar")}
                </Button>

                {song.amUrl && (
                  <Button
                    as="a"
                    href={song.amUrl}
                    target="_blank"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<SiApplemusic style={{ scale: "1.5" }} />}
                  >
                    Apple Music
                  </Button>
                )}

                <IconButton
                  icon={<FiMoreHorizontal />}
                  size="md"
                  variant="ghost"
                  colorScheme="n2"
                  aria-label="More"
                  onClick={(e) => show(e, { props: song })}
                ></IconButton>
              </HStack>
            </Flex>
          </Flex>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
