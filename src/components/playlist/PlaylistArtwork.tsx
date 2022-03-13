import { Box, Flex, FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useMemo } from "react";
import { IconType } from "react-icons";
import { BiCalendar, BiMovie } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import {
  isSGPPlaylist,
  parsePlaylistDesc,
  parsePlaylistID,
  useFormatPlaylist,
} from "../../modules/playlist/useFormatPlaylist";
import { getVideoThumbnails } from "../../utils/SongHelper";
import { LineLogo } from "../icons/LineLogo";

interface PlaylistArtworkProps extends FlexProps {
  playlist: Partial<PlaylistFull>;
  renderType?: "dropShadowText" | "auto";
  size?: string;
}

export const PlaylistArtwork = React.memo(
  ({
    playlist,
    renderType = "auto",
    size = "148px",
    ...rest
  }: PlaylistArtworkProps) => {
    const formatPlaylist = useFormatPlaylist();
    const { title, description, type } = useMemo(() => {
      let type;
      if (isSGPPlaylist(playlist.id!)) {
        const { type: t } = parsePlaylistID(playlist.id!);
        type = t;
      }
      return {
        title: formatPlaylist("title", playlist),
        description: parsePlaylistDesc(playlist),
        type,
      };
    }, [formatPlaylist, playlist]);

    const channelImg = useMemo(
      () => playlist && formatPlaylist("channelImage", playlist),
      [formatPlaylist, playlist]
    );
    const thumbnail = useMemo(() => {
      const videoIds: string[] = (playlist as any).videoids;
      if (videoIds?.length) return getVideoThumbnails(videoIds[0]).medium;
      return null;
    }, [playlist]);

    const props = useMemo(
      () => ({ width: size, height: size, flexBasis: size, ...rest }),
      [size, rest]
    );
    if (type === ":weekly") {
      return (
        <StackedTextArt
          typeText="This Week in"
          titleText={description?.org || ""}
          imageUrl={thumbnail || ""}
          reverse={true}
          {...props}
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
          {...props}
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
          {...props}
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
        showUserIcon={playlist.type === "ugp"}
        iconType={iconType}
        {...props}
      />
    );
  }
);

function OverlayTextArt({
  titleText,
  imageUrl,
  showUserIcon = false,
  iconType = undefined,
  ...rest
}: {
  titleText: string;
  imageUrl: string;
  showUserIcon: boolean;
  iconType?: IconType;
} & FlexProps) {
  const bgColor =
    titleText.length % 2 === 0
      ? "var(--chakra-colors-n2-600)"
      : "var(--chakra-colors-brand-600)";

  const adjFontSize = Math.max(
    14,
    Math.round(-Math.pow(titleText.length / 15, 2) + 20)
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
      {...rest}
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
      {showUserIcon ? (
        <Icon
          as={FaUser}
          w={6}
          h={6}
          position="absolute"
          left="4px"
          bottom="4px"
          opacity={0.4}
        ></Icon>
      ) : (
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
  ...rest
}: {
  typeText: string;
  titleText: string;
  imageUrl: string;
  reverse?: boolean;
  hideLogo?: boolean;
} & FlexProps) {
  // Random between color based on last character of title
  const bgColor = titleText.length % 2 === 0 ? "brand.100" : "n2.100";
  // Do some fancy math to adjust font size so it can fit longer text
  const adjFontSize = Math.max(
    14,
    Math.round(-Math.pow(titleText.length / 15, 2) + 18)
  );
  return (
    <Flex
      position="relative"
      minWidth="148px"
      width="148px"
      height="148px"
      flexDirection={reverse ? "column-reverse" : "column"}
      {...rest}
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
          fontSize={14}
          fontWeight={600}
          letterSpacing=".05rem"
          textTransform="uppercase"
          zIndex={1}
        >
          {typeText}
        </Text>
        <Heading isTruncated={true} fontSize={adjFontSize} my="auto" zIndex={1}>
          {titleText}
        </Heading>
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
