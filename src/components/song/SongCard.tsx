import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { ChannelPhoto } from "../channel/ChannelPhoto";
import { useDraggableSong } from "../data/DraggableSong";
import { SongArtwork } from "./SongArtwork";

interface SongCardProps extends FlexProps {
  song: Song;
}
export const SongCard = ({ song, ...rest }: SongCardProps) => {
  const dragSongProps = useDraggableSong(song);
  return (
    <Flex {...rest} minWidth="128px" direction="column">
      <Flex position="relative">
        <SongArtwork song={song} size={128} rounded="md" />
        <ChannelPhoto
          channel={{ id: song.channel_id, ...song.channel }}
          resizePhoto={24}
          width="40px"
          height="40px"
          left={1}
          bottom={1}
          position="absolute"
          boxShadow="dark-lg"
        />
      </Flex>
      <Text noOfLines={2} height="44px" fontSize={14} my={1} {...dragSongProps}>
        {song.name}
      </Text>
    </Flex>
  );
};
