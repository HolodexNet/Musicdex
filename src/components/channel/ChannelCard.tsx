import {
  Flex,
  FlexProps,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChannelPhoto } from "./ChannelPhoto";

interface ChannelCardProps extends FlexProps {
  channel: Channel;
}

export function ChannelCard({ channel, ...rest }: ChannelCardProps) {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const bgHover = useColorModeValue("bg.200", "bg.700");
  return (
    <Flex
      minWidth="168px"
      width="168px"
      height="190px"
      justifyContent="space-between"
      alignItems="center"
      bgColor={bgColor}
      _hover={{ backgroundColor: bgHover }}
      borderRadius={8}
      padding={2}
      overflow="hidden"
      flexDirection="column"
      shadow="md"
      as={Link}
      to={`/channel/${channel.id}`}
      {...rest}
    >
      <ChannelPhoto
        channel={channel}
        resizePhoto={128}
        width="128px"
        height="128px"
        ignoreFallback
      />
      <Text noOfLines={2} fontWeight={600} fontSize="md" textAlign="center">
        {channel.english_name || channel.name}
      </Text>
    </Flex>
  );
}
