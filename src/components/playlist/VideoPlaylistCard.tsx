import {
  AspectRatio,
  Box,
  Flex,
  Image,
  Text,
  Center,
  Button,
  Icon,
} from "@chakra-ui/react";
import React, { Suspense } from "react";
import { FaPlay } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import useNamePicker from "../../modules/common/useNamePicker";
import { useStoreActions } from "../../store";
import { SongTable } from "../data/SongTable";
import { MotionBox } from "../common/MotionBox";
import { QueryStatus } from "../common/QueryStatus";
import { useTranslation } from "react-i18next";

export const VideoPlaylistCard = React.memo(
  ({ video, playlist }: { video: any; playlist?: PlaylistFull }) => {
    const { t } = useTranslation();
    const setPlaylist = useStoreActions(
      (actions) => actions.playback.setPlaylist
    );

    function openVideo() {
      if (playlist?.content) setPlaylist({ playlist });
      else window.open(`https://holodex.net/watch/${video.id}`, "_blank");
    }
    const tn = useNamePicker();

    return (
      <Box
        width="100%"
        height="100%"
        borderRadius="lg"
        overflow="hidden"
        shadow="lg"
        bgColor="bg.800"
        _hover={{ backgroundColor: "bg.700" }}
        transition="0.3s"
        p={2}
      >
        <AspectRatio
          ratio={34 / 9}
          maxH="auto"
          borderColor="bg.4 00"
          borderBottomWidth="1px"
          borderBottomStyle="solid"
          borderRadius="md"
          overflow="hidden"
          boxSizing="border-box"
        >
          <Flex>
            <AspectRatio
              ratio={16 / 9}
              flex={"0 1"}
              flexBasis={1600 / 34 + "%"}
              width={1600 / 34 + "%"}
            >
              <div>
                <MotionBox
                  position="absolute"
                  width="100%"
                  height="100%"
                  display="flex"
                  top="0"
                  justifyContent="center"
                  alignItems="center"
                  whileHover={{
                    backgroundColor: "rgba(0,0,0,0.4)",
                    opacity: 1,
                  }}
                  opacity={0}
                  transition={{
                    duration: 0.3,
                  }}
                  onClick={openVideo}
                  cursor="pointer"
                >
                  <MotionBox
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    // onClick={() => playSong()}
                  >
                    <Icon
                      as={playlist?.content ? FaPlay : FiExternalLink}
                      w={8}
                      h={8}
                      color="brand.50"
                      textShadow="2xl"
                    />
                  </MotionBox>
                </MotionBox>

                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/sddefault.jpg`}
                  borderRadius="md"
                  loading="lazy"
                />
              </div>
            </AspectRatio>
            <Box
              flex={"1 1"}
              flexBasis={900 / 34 + "%"}
              height="100%"
              bgColor="bgAlpha.800"
              overflowY="scroll"
            >
              {playlist?.content ? (
                <Suspense
                  fallback={<QueryStatus queryStatus={{ isLoading: true }} />}
                >
                  <SongTable
                    playlist={playlist}
                    rowProps={{
                      hideCol: ["og_artist", "duration", "sang_on", "menu"],
                      // flipNames: true,
                    }}
                  />
                </Suspense>
              ) : (
                <Center height="100%">
                  {new Date(video.available_at) < new Date() ? (
                    <Box>
                      <Text>
                        {t("This stream has not been tagged with songs")}
                      </Text>
                      <Button
                        variant="link"
                        colorScheme={"n2"}
                        as="a"
                        href={`https://holodex.net/edit/video/${video.id}/music`}
                        target="_blank"
                      >
                        {t("Help us tag it on Holodex")}
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Text>Going Live (distance)</Text>
                      <Button variant="link" colorScheme={"n2"}>
                        {t("Watch on Holodex")}
                      </Button>
                      <Button variant="link" colorScheme={"n2"}>
                        {t("(YouTube)")}
                      </Button>
                    </Box>
                  )}
                </Center>
              )}
            </Box>
          </Flex>
        </AspectRatio>
        <Text
          mt={2}
          as={Link}
          display="block"
          to={`/video/${video.id}`}
          _hover={{ color: "whiteAlpha.700" }}
        >
          {video.title}
        </Text>
        <Text
          opacity={0.75}
          fontSize="sm"
          display="block"
          as={Link}
          to={`/channel/${video.channel_id || video.channel.id}`}
          _hover={{ color: "whiteAlpha.700" }}
        >
          {tn(video.channel.english_name, video.channel.name)}
        </Text>
      </Box>
    );
  }
);
