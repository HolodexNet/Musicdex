import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { ChannelPhoto } from "./ChannelPhoto";

interface ChannelCardProps extends FlexProps {
  channel: Channel;
}

export function ChannelCard({ channel, ...rest }: ChannelCardProps) {
  return (
    <Flex
      minWidth="160px"
      width="160px"
      height="180px"
      justifyContent="space-between"
      alignItems="center"
      bgColor="bg.800"
      borderRadius={8}
      padding={2}
      overflow="hidden"
      flexDirection="column"
      shadow="2xl"
      {...rest}
    >
      <ChannelPhoto
        channel={channel}
        resizePhoto={128}
        width="128px"
        height="128px"
      />
      <Text noOfLines={2} fontWeight={600} fontSize="md">
        {channel.english_name || channel.name}
      </Text>
    </Flex>
  );
}
