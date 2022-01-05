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

  const channelImg = useMemo(
    () => playlist && identifyPlaylistChannelImage(playlist),
    [playlist]
  );
  const thumbnail = useMemo(() => {
    const videoIds: string[] = (playlist as any).videoids;
    if (videoIds?.length) return getVideoThumbnails(videoIds[0]).medium;
    return null;
  }, [playlist]);

  if (type === ":weekly") {
    return (
      <StackedTextArt
        typeText="This Week in"
        titleText={description?.org || ""}
        imageUrl={thumbnail || ""}
        reverse={true}
      />
    );
  }
  if (type === ":dailyrandom") {
    return (
      <StackedTextArt
        typeText="Daily Mix"
        titleText={
          description?.channel.english_name || description?.channel.name
        }
        imageUrl={thumbnail || ""}
      />
    );
  }

  if (type === ":video") {
    const image =
      (description.id && getVideoThumbnails(description.id).medium) || "";
    return (
      <StackedTextArt
        typeText="Archive Playlist"
        titleText={description?.title}
        imageUrl={image}
      />
    );
  }

  return (
    <OverlayTextArt
      titleText={playlist.title || ""}
      imageUrl={channelImg || ""}
    />
  );
}

function OverlayTextArt({
  titleText,
  imageUrl,
}: {
  titleText: string;
  imageUrl: string;
}) {
  const bgColor =
    titleText.charCodeAt(Math.round(titleText.length / 2)) % 2 === 0
      ? "var(--chakra-colors-n2-600)"
      : "var(--chakra-colors-brand-600)";
  return (
    <Flex
      position="relative"
      flexBasis="148px"
      minWidth="148px"
      width="100%"
      flexDirection={"column"}
    >
      <BrandColorGradientText bgColor={bgColor} />
      <Box p={2} position="absolute" mt={3} width="100%">
        <Text fontSize={20} fontWeight={600} textAlign="center" noOfLines={2}>
          {titleText}
        </Text>
      </Box>

      <Image src={imageUrl} alt="Playlist art" />
    </Flex>
  );
}

function StackedTextArt({
  typeText,
  titleText,
  imageUrl,
  reverse = false,
}: {
  typeText: string;
  titleText: string;
  imageUrl: string;
  reverse?: boolean;
}) {
  // Random between color based on last character of title
  const bgColor =
    titleText.charCodeAt(Math.round(titleText.length / 2)) % 2 === 0
      ? "brand.100"
      : "n2.100";
  return (
    <Flex
      position="relative"
      flexBasis="148px"
      minWidth="148px"
      width="100%"
      flexDirection={reverse ? "column-reverse" : "column"}
    >
      <Flex p={2} bgColor={bgColor} height="33%">
        <Box lineHeight={1.1} maxWidth="100%">
          <Text
            fontSize={12}
            fontWeight={800}
            letterSpacing={1.2}
            color="gray.800"
            textTransform="uppercase"
          >
            {typeText}
          </Text>
          <Text
            isTruncated={true}
            fontSize="1.2rem"
            fontWeight={600}
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
    </Flex>
  );
}

const BrandColorGradientText = styled.div<{ bgColor: string }>`
  mix-blend-mode: multiply;
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${({ bgColor }) => bgColor};
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
