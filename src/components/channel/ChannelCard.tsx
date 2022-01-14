import { Flex, FlexProps, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useNamePicker from "../../modules/common/useNamePicker";
import { ChannelPhoto } from "./ChannelPhoto";

interface ChannelCardProps extends FlexProps {
  channel: Channel;
}

export function ChannelCard({ channel, ...rest }: ChannelCardProps) {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const bgHover = useColorModeValue("bg.200", "bg.700");
  const tn = useNamePicker();

  return (
    <Flex
      minWidth="168px"
      width="168px"
      height="180px"
      justifyContent="space-between"
      alignItems="center"
      bgColor={bgColor}
      _hover={{ backgroundColor: bgHover }}
      borderRadius={8}
      padding={2}
      overflow="hidden"
      flexDirection="column"
      shadow="md"
      transition="0.3s"
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
        boxShadow="0 8px 24px rgba(0,0,0,0.5)"
      />
      <Text
        isTruncated
        fontWeight={500}
        fontSize="md"
        textAlign="center"
        maxWidth="100%"
      >
        {tn(channel.english_name, channel.name)}
      </Text>
    </Flex>
  );
}
