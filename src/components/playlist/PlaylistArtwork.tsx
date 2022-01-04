import { Box, Flex, FlexProps, Image, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useMemo } from "react";
import {
  identifyTitle,
  identifyDescription,
  identifyPlaylistChannelImage,
} from "../../utils/PlaylistHelper";
import {
  extractUsingFn,
  isSGPPlaylist,
  parsePlaylistID,
  SGPDefinitions,
} from "../../utils/SGPFunctions";
import { getVideoThumbnails } from "../../utils/SongHelper";

interface PlaylistArtworkProps extends FlexProps {
  playlist: Partial<PlaylistFull>;
  renderType?: "dropShadowText" | "auto";
}

export function PlaylistArtwork({
  playlist,
  renderType = "auto",
  ...rest
}: PlaylistArtworkProps) {
  const { title, description, type, params } = useMemo(() => {
    if (isSGPPlaylist(playlist.id!)) {
      const { type, params } = parsePlaylistID(playlist.id!);
      const desc = (
        playlist?.description
          ? SGPDefinitions[type].descParser(playlist?.description)
          : undefined
      ) as any;
      return {
        title: identifyTitle(playlist),
        type,
        params,
        description: desc,
      };
    }
    return {
      title: identifyTitle(playlist),
      description: identifyDescription(playlist),
    };
  }, [playlist]);
  console.log(title, type, params);

  const channelImg = identifyPlaylistChannelImage(playlist);
  const thumbnail = useMemo(() => {
    const videoIds: string[] = (playlist as any).videoids;
    if (videoIds.length) return getVideoThumbnails(videoIds[0]).medium;
    return null;
  }, [playlist]);

  return (
    <Flex
      position="relative"
      {...rest}
      flexBasis="148px"
      width="100%"
      flexDirection="column"
    >
      {type === ":dailyrandom" && (
        <StackedTextArt
          typeText="Daily Mix"
          titleText={
            description?.channel?.english_name || description?.channel.name
          }
          imageUrl={thumbnail || ""}
        />
      )}
      {type !== ":dailyrandom" && (
        <OverlayTextArt
          titleText={playlist.title || ""}
          imageUrl={channelImg || ""}
        />
      )}
    </Flex>
  );
}

function OverlayTextArt({
  titleText,
  imageUrl,
}: {
  titleText: string;
  imageUrl: string;
}) {
  return (
    <>
      <BrandColorGradientText />
      <Box p={2} position="absolute" mt={3} width="100%">
        <Text fontSize={20} fontWeight={600} textAlign="center" noOfLines={2}>
          {titleText}
        </Text>
      </Box>

      <Image src={imageUrl} alt="Playlist art" />
    </>
  );
}

function StackedTextArt({
  typeText,
  titleText,
  imageUrl,
}: {
  typeText: string;
  titleText: string;
  imageUrl: string;
}) {
  return (
    <>
      <Flex p={2} bgColor="n2.200" height="33%">
        <Box lineHeight={1.1}>
          <Text
            fontSize={12}
            fontWeight={800}
            color="gray.800"
            textTransform="uppercase"
          >
            {typeText}
          </Text>
          <Text
            noOfLines={1}
            fontSize="1.2rem"
            fontWeight={500}
            color="gray.800"
          >
            {/* {desc?.channel?.english_name || desc?.channel.name} */}
            {titleText}
          </Text>
        </Box>
      </Flex>

      <Flex
        bgImage={imageUrl}
        flexGrow={1}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgSize="120% auto"
      ></Flex>
    </>
  );
}

const BrandColorGradientText = styled.div`
  mix-blend-mode: multiply;
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: var(--chakra-colors-brand-600);
  opacity: 0.7;

  &::after {
    background-image: linear-gradient(
      to bottom,
      #000000 0%,
      rgba(0, 0, 0, 0) 100%
    );
    z-index: 1;
    position: absolute;
    height: 100%;
    width: 100%;
    content: "";
    opacity: 0.7;
  }
`;
