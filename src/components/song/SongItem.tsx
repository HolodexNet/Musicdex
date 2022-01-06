import { Flex, FlexProps, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChannelPhoto } from "../channel/ChannelPhoto";
import { SongArtwork } from "./SongArtwork";

interface SongItemProps extends FlexProps {
  song: Song;
}

export const SongItem = ({ song, ...rest }: SongItemProps) => {
  const bgColor = useColorModeValue("bg.200", "bg.800");
  const bgHover = useColorModeValue("bg.300", "bg.700");

  return (
    <Flex
      height="72px"
      padding={3}
      width="100%"
      minWidth="200px"
      bgColor={bgColor}
      _hover={{ backgroundColor: bgHover }}
      borderRadius={8}
      alignItems="center"
      as={Link}
      to={`/song/${song.id}`}
      {...rest}
    >
      <SongArtwork song={song} size={50} />
      <ChannelPhoto
        channelId={song.channel_id}
        marginLeft="-16px"
        border="2px"
        borderColor="gray.800"
        boxSizing="content-box"
      />
      <Text marginLeft={2} fontWeight={500} noOfLines={2}>
        {song.name}
      </Text>
    </Flex>
  );
};
