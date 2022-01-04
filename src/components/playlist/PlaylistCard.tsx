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

export const PlaylistCard = ({
  playlist,
  ...rest
}: {
  playlist: Partial<PlaylistFull>;
} & FlexProps) => {
  const IMAGE =
    identifyPlaylistChannelImage(playlist) ||
    identifyPlaylistBannerImage(playlist);
  const title = identifyTitle(playlist);
  const description = identifyDescription(playlist);
  return (
    <Flex
      maxW="280px"
      // width="280px"
      height="250px"
      justifyContent="space-between"
      marginX="10px"
      alignItems="center"
      bgColor="bg.800"
      _hover={{ backgroundColor: "bg.700" }}
      borderRadius="lg"
      overflow="hidden"
      flexDirection="column"
      shadow="2xl"
      as={Link}
      to={`/playlists/${playlist.id}/`}
      {...rest}
    >
      <AspectRatio
        ratio={16 / 9}
        width="280px"
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
          zIndex={1}
        />
      </AspectRatio>
      <Box p="4">
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="2xl"
            fontWeight="500"
            as="h4"
            lineHeight="tight"
            isTruncated
            noOfLines={2}
          >
            {title}
          </Box>
        </Flex>

        {/* <Flex justifyContent="space-between" alignContent="center">
        <Rating rating={data.rating} numReviews={data.numReviews} />
      </Flex> */}
      </Box>
    </Flex>
  );
};
