import {
  Box,
  useColorModeValue,
  Text,
  Stack,
  Heading,
  Image,
  Flex,
  AspectRatio,
} from "@chakra-ui/react";
import {
  identifyDescription,
  identifyPlaylistBannerImage,
  identifyPlaylistChannelImage,
  identifyTitle,
} from "../../utils/PlaylistHelper";

export const PlaylistCard = ({
  playlist,
}: {
  playlist: Partial<PlaylistFull>;
}) => {
  const IMAGE =
    identifyPlaylistChannelImage(playlist) ||
    identifyPlaylistBannerImage(playlist);
  const title = identifyTitle(playlist);
  const description = identifyDescription(playlist);
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      maxW="xs"
      rounded="lg"
      shadow="lg"
      position="relative"
    >
      <AspectRatio
        ratio={16 / 9}
        minW="xs"
        boxSizing="content-box"
        _after={{
          transition: "all .3s ease",
          content: '""',
          w: "full",
          h: "full",
          pos: "absolute",
          top: 0,
          left: 0,
          backgroundImage: `url(${IMAGE})`,
          filter: "blur(15px)",
          opacity: 0.4,
        }}
      >
        <Image
          src={IMAGE}
          alt={`Playlist art`}
          roundedTop="lg"
          objectFit="cover"
          minW="xs"
          zIndex={1}
        />
      </AspectRatio>

      <Box p="6">
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {title}
          </Box>
        </Flex>

        {/* <Flex justifyContent="space-between" alignContent="center">
        <Rating rating={data.rating} numReviews={data.numReviews} />
      </Flex> */}
      </Box>
    </Box>
  );
};
