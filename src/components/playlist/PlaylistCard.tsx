import {
  useColorModeValue,
  Text,
  Flex,
  FlexProps,
  Icon,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useClient } from "../../modules/client";
import { usePlaylistTitleDesc } from "../../modules/playlist/useFormatPlaylist";
import { useStoreActions } from "../../store";
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
  // Fixes double tap to trigger (https://stackoverflow.com/questions/17710893/why-when-do-i-have-to-tap-twice-to-trigger-click-on-ios)
  const hoverListeners = useBreakpointValue([
    undefined,
    undefined,
    {
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
    },
  ]);

  const { AxiosInstance } = useClient();
  const queryClient = useQueryClient();
  const setPlaylist = useStoreActions((action) => action.playback.setPlaylist);
  const toast = useToast();
  const { title, description } = usePlaylistTitleDesc(playlist);
  const { inView, ref } = useInView();
  if (!playlist) return <div>Playlist doko...</div>;
  async function handlePlayClick(e: any) {
    e.stopPropagation();
    e.preventDefault();
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
      as={Link}
      to={`/playlists/${playlist.id}/`}
      ref={ref}
      {...hoverListeners}
      {...rest}
    >
      {inView && (
        <>
          <Flex flexDirection="column" position="relative" cursor="pointer">
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
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayClick}
            >
              <Icon as={FaPlay} w={5} h={5} color="brand.400" />
            </MotionBox>
          </Flex>
          <Flex direction="column" mt={1} width="100%">
            <Text fontSize="1rem" fontWeight="500" isTruncated={true}>
              {title}
            </Text>
            <Text fontSize="0.9rem" opacity={0.7} noOfLines={2}>
              {description}
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};
