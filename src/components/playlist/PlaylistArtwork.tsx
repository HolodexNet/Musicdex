import { Box, Flex, FlexProps, Icon, Image, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useMemo } from "react";
import { IconType } from "react-icons";
import { BiCalendar, BiMovie } from "react-icons/bi";
import {
  identifyTitle,
  identifyDescription,
  identifyPlaylistChannelImage,
} from "../../utils/PlaylistHelper";
import {
  isSGPPlaylist,
  parsePlaylistID,
  SGPDefinitions,
} from "../../utils/SGPFunctions";
import { getVideoThumbnails } from "../../utils/SongHelper";
import { LineLogo } from "../icons/LineLogo";

interface PlaylistArtworkProps extends FlexProps {
  playlist: Partial<PlaylistFull>;
  renderType?: "dropShadowText" | "auto";
}

export const PlaylistArtwork = React.memo(
  ({ playlist, renderType = "auto", ...rest }: PlaylistArtworkProps) => {
    const { title, description, type, params } = useMemo(() => {
      if (isSGPPlaylist(playlist.id!)) {
        const { type, params } = parsePlaylistID(playlist.id!);
        const desc = (
          playlist?.description
            ? SGPDefinitions?.[type]?.descParser?.(playlist?.description)
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
          typeText="Setlist"
          titleText={description?.title}
          imageUrl={image}
        />
      );
    }

    let iconType = undefined;
    if (type === ":mv") {
      iconType = BiMovie;
    }
    if (type === ":latest") {
      iconType = BiCalendar;
    }

    return (
      <OverlayTextArt
        titleText={title || ""}
        imageUrl={thumbnail || channelImg || ""}
        hideLogo={playlist.type === "ugp"}
        iconType={iconType}
      />
    );
  }
);

function OverlayTextArt({
  titleText,
  imageUrl,
  hideLogo = false,
  iconType = undefined,
}: {
  titleText: string;
  imageUrl: string;
  hideLogo?: boolean;
  iconType?: IconType;
}) {
  const bgColor =
    titleText.length % 2 === 0
      ? "var(--chakra-colors-n2-600)"
      : "var(--chakra-colors-brand-600)";

  const adjFontSize = Math.max(
    14,
    Math.min(Math.round(Math.pow(70 / titleText.length, 2) + 11), 20)
  );
  return (
    <Flex
      position="relative"
      flexBasis="148px"
      minWidth="148px"
      width="100%"
      flexDirection={"column"}
      bgImage={imageUrl}
      flexGrow={1}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      bgSize="cover"
      overflow="hidden"
    >
      <BrandColorGradientText bgColor={bgColor} />
      <Box p={2} position="absolute" mt={3} width="100%">
        <Text
          fontSize={adjFontSize}
          fontWeight={600}
          textAlign="center"
          noOfLines={2}
        >
          {titleText}
        </Text>
      </Box>
      {!hideLogo && (
        <LineLogo
          position="absolute"
          w={6}
          h={6}
          left="4px"
          bottom="4px"
          zIndex={1}
        />
      )}
      {iconType && (
        <Icon
          width="80px"
          height="80px"
          opacity="0.7"
          transform={`translate(8px, 21px) rotate(${Math.floor(
            Math.random() * -30
          )}deg)`}
          blendMode="soft-light"
          as={iconType}
        ></Icon>
      )}
    </Flex>
  );
}

function StackedTextArt({
  typeText,
  titleText,
  imageUrl,
  reverse = false,
  hideLogo = false,
}: {
  typeText: string;
  titleText: string;
  imageUrl: string;
  reverse?: boolean;
  hideLogo?: boolean;
}) {
  // Random between color based on last character of title
  const bgColor = titleText.length % 2 === 0 ? "brand.100" : "n2.100";
  // Do some fancy math to adjust font size so it can fit longer text
  const adjFontSize = Math.max(
    14,
    Math.min(Math.round(Math.pow(40 / titleText.length, 2) + 11), 20)
  );
  return (
    <Flex
      position="relative"
      minWidth="148px"
      width="148px"
      height="148px"
      flexDirection={reverse ? "column-reverse" : "column"}
    >
      <Flex
        lineHeight={1.1}
        height="33%"
        bgColor={bgColor}
        minWidth={0}
        p="5px"
        flexDir="column"
        color="gray.800"
        fontWeight={600}
        overflow="hidden"
        position="relative"
      >
        <Text
          fontSize={12}
          letterSpacing=".1rem"
          textTransform="uppercase"
          zIndex={1}
        >
          {typeText}
        </Text>
        <Text
          isTruncated={true}
          letterSpacing="0px"
          fontSize={adjFontSize}
          my="auto"
          zIndex={1}
        >
          {titleText}
        </Text>
        {!hideLogo && (
          <LineLogo
            position="absolute"
            w={20}
            h={20}
            right="-8%"
            top="0"
            opacity="0.3"
          />
        )}
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
