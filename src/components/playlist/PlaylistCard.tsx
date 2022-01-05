import {
  useColorModeValue,
  Text,
  Flex,
  FlexProps,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useClient } from "../../modules/client";
import { useStoreActions } from "../../store";
import { identifyDescription, identifyTitle } from "../../utils/PlaylistHelper";
import { MotionBox } from "../common/MotionBox";
import { PlaylistArtwork } from "./PlaylistArtwork";

export const PlaylistCard = ({
  playlist,
  ...rest
}: {
  playlist: Partial<PlaylistFull>;
} & FlexProps) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const bgHover = useColorModeValue("bg.200", "bg.700");
  const [isHovering, setIsHovering] = useState(false);

  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();
  const setPlaylist = useStoreActions((action) => action.playback.setPlaylist);
  const toast = useToast();

  if (!playlist) return <div>{playlist}???</div>;
  const title = identifyTitle(playlist);
  const description = identifyDescription(playlist);
  async function handlePlayClick() {
    const cached: PlaylistFull | undefined = queryClient.getQueryData([
      "playlist",
      playlist.id,
    ]);
    let p = cached;
    if (!cached) {
      p = (
        await AxiosInstance<PlaylistFull>(`/musicdex/playlist/${playlist.id}`)
      ).data;
    }
    if (p) {
      setPlaylist({ playlist: p });
    } else {
      toast({
        title: "Failed to get playlist",
        variant: "error",
      });
    }
  }
  return (
    <Flex
      minWidth="168px"
      width="168px"
      height="230px"
      padding={2}
      alignItems="center"
      bgColor={bgColor}
      transition="0.3s"
      _hover={{ backgroundColor: bgHover }}
      borderRadius={8}
      overflow="hidden"
      flexDirection="column"
      shadow="md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...rest}
    >
      <Flex
        flexDirection="column"
        position="relative"
        onClick={handlePlayClick}
        cursor="pointer"
      >
        <PlaylistArtwork playlist={playlist} />
        <MotionBox
          width="40px"
          height="40px"
          backgroundColor="rgba(0,0,0,0.7)"
          position="absolute"
          bottom={0}
          right="5%"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          opacity={0}
          animate={
            isHovering
              ? {
                  y: "-10%",
                  opacity: 1,
                  boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.6)",
                }
              : {}
          }
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Icon as={FaPlay} w={5} h={5} color="brand.400" />
        </MotionBox>
      </Flex>

      <Flex
        direction="column"
        mt={1}
        width="100%"
        as={Link}
        to={`/playlists/${playlist.id}/`}
      >
        <Text fontSize="1rem" fontWeight="500" isTruncated={true}>
          {title}
        </Text>
        <Text fontSize="0.9rem" opacity={0.7} noOfLines={2}>
          {description}
        </Text>
      </Flex>
      {/* <Flex justifyContent="space-between" alignContent="center">
        <Rating rating={data.rating} numReviews={data.numReviews} />
      </Flex> */}
    </Flex>
  );
};
