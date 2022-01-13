import { Flex, FlexProps, Text, useColorModeValue } from "@chakra-ui/react";
import { useContextMenu } from "react-contexify";
import { Link } from "react-router-dom";
import { ChannelPhoto } from "../channel/ChannelPhoto";
import { DEFAULT_MENU_ID } from "../common/CommonContext";
import { useDraggableSong } from "../data/DraggableSong";
import { SongArtwork } from "./SongArtwork";

interface SongItemProps extends FlexProps {
  song: Song;
  showChannelImg?: boolean;
}

export const SongItem = ({ song, showChannelImg, ...rest }: SongItemProps) => {
  const bgColor = useColorModeValue("bg.200", "bg.800");
  const bgHover = useColorModeValue("bgAlpha.300", "bgAlpha.500");
  const dragSongProps = useDraggableSong(song);
  const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
  return (
    <Flex
      // height="72px"
      padding={1}
      mt={1}
      width="100%"
      minWidth="200px"
      // bgColor={bgColor}
      _hover={{ backgroundColor: bgHover }}
      borderRadius={4}
      alignItems="center"
      as={Link}
      to={`/song/${song.id}`}
      {...rest}
      {...dragSongProps}
      onContextMenu={show}
    >
      <SongArtwork song={song} size={50} />
      {showChannelImg && (
        <ChannelPhoto
          channelId={song.channel_id}
          marginLeft="-16px"
          border="2px"
          borderColor="gray.800"
          boxSizing="content-box"
        />
      )}
      <Text marginLeft={2} fontWeight={500} noOfLines={2}>
        {song.name}
      </Text>
    </Flex>
  );
};
