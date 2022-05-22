import { Box, BoxProps, Text, useColorModeValue } from "@chakra-ui/react";
import { intervalToDuration } from "date-fns";
import { useMemo } from "react";

type PlaylistHeadingProps = {
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
    <Box as={"header"} mb="2" position="relative" {...props}>
      <Text
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
        as={"div"}
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
        <Text color="bg.200" float="right" fontSize={"xl"}>
          {count > 0 ? `${count} songs` : ""}
          {durationString ? ` • ${durationString}` : ""}
        </Text>
      </Text>
    </Box>
  );
}
