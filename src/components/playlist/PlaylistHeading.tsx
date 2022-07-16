import { Box, BoxProps, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { intervalToDuration } from "date-fns";
import { useMemo } from "react";
import { PlaylistArtwork } from "./PlaylistArtwork";

type PlaylistHeadingProps = {
  playlist?: PlaylistFull;
  title: string;
  description: string;
  count: number;
  totalLengthSecs?: number;
  max?: number;
};

export function PlaylistHeading({
  title,
  description,
  count,
  totalLengthSecs,
  playlist,
  max = 500,
  ...props
}: PlaylistHeadingProps & BoxProps) {
  const descColor = useColorModeValue("gray.800", "gray.200");

  const durationString = useMemo(() => {
    if (!totalLengthSecs) return "";
    const duration = intervalToDuration({
      start: 0,
      end: totalLengthSecs * 1000,
    });
    const hr = duration.hours ? duration.hours + "hr" : "";
    return `${hr} ${duration.minutes}m`;
  }, [totalLengthSecs]);

  return (
    <Flex
      justifyContent="center"
      alignItems={"flex-end"}
      flexWrap={"wrap"}
      mb={2}
    >
      {playlist && (
        <Box mr={2} my={2} flexBasis="148px" dropShadow="dark-lg">
          <PlaylistArtwork playlist={playlist} rounded="md" />
        </Box>
      )}
      <Flex
        as={"header"}
        mb="2"
        position="relative"
        flexDirection="column"
        flexBasis="148px"
        flexGrow={1}
        {...props}
      >
        <Text
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "4xl" }}
          as={"div"}
          noOfLines={2}
        >
          {title}
        </Text>
        <Text
          color={descColor}
          opacity={0.6}
          fontSize={{ base: "lg", md: "xl" }}
          as={"div"}
        >
          <span>{description}</span>{" "}
          <Text color="bg.200" fontSize={"md"}>
            {count > 0 ? `${count} songs` : ""}
            {durationString ? ` • ${durationString}` : ""}
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
}
