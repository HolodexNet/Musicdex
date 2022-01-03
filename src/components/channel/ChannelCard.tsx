import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChannelPhoto } from "./ChannelPhoto";

interface ChannelCardProps extends FlexProps {
  channel: Channel;
}

export function ChannelCard({ channel, ...rest }: ChannelCardProps) {
  return (
    <Flex
      minWidth="160px"
      width="160px"
      height="190px"
      justifyContent="space-between"
      alignItems="center"
      bgColor="bg.800"
      borderRadius={8}
      padding={2}
      overflow="hidden"
      flexDirection="column"
      shadow="2xl"
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
