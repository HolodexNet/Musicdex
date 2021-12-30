import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { ChannelPhoto } from "../channel/ChannelPhoto";
import { SongArtwork } from "./SongArtwork";

interface SongItemProps extends FlexProps {
  song: Song;
}

export const SongItem = ({ song, ...rest }: SongItemProps) => {
  return (
    <Flex
      height="72px"
      padding={3}
      width={310}
      minWidth={200}
      background="gray.800"
      borderRadius="lg"
      alignItems="center"
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
      <Text marginLeft={2} fontWeight="600" noOfLines={2}>
        {song.name}
      </Text>
    </Flex>
  );
};
