import {
  Box,
  useColorModeValue,
  Text,
  Stack,
  Heading,
  Image,
  Flex,
  AspectRatio,
  FlexProps,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  identifyDescription,
  identifyPlaylistBannerImage,
  identifyPlaylistChannelImage,
  identifyTitle,
} from "../../utils/PlaylistHelper";
import { PlaylistArtwork } from "./PlaylistArtwork";

export const PlaylistCard = ({
  playlist,
  ...rest
}: {
  playlist: Partial<PlaylistFull>;
} & FlexProps) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const bgHover = useColorModeValue("bg.200", "bg.700");

  if (!playlist) return <div>{playlist}???</div>;

  const title = identifyTitle(playlist);
  const description = identifyDescription(playlist);

  return (
    <Flex
      minWidth="168px"
      width="168px"
      height="230px"
      // justifyContent="space-between"
      padding={2}
      alignItems="center"
      bgColor={bgColor}
      _hover={{ backgroundColor: bgHover }}
      borderRadius={8}
      overflow="hidden"
      flexDirection="column"
      shadow="md"
      as={Link}
      to={`/playlists/${playlist.id}/`}
      {...rest}
    >
      <PlaylistArtwork playlist={playlist} />

      <Flex direction="column" mt={1} width="100%">
        <Text fontSize="1rem" fontWeight="500" noOfLines={1}>
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
