import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import { useContextMenu } from "react-contexify";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSongQueuer } from "../../utils/SongQueuerHook";
import { ChannelPhoto } from "../channel/ChannelPhoto";
import { DEFAULT_MENU_ID } from "./SongContextMenu";
import { MotionBox } from "../common/MotionBox";
import { useDraggableSong } from "../data/DraggableSong";
import { SongArtwork } from "./SongArtwork";

interface SongCardProps extends FlexProps {
  song: Song;
}
export const SongCard = ({ song, ...rest }: SongCardProps) => {
  const dragSongProps = useDraggableSong(song);
  const queueSongs = useSongQueuer();
  function playSong() {
    queueSongs({
      songs: [song],
      immediatelyPlay: true,
    });
  }

  const { show } = useContextMenu({ id: DEFAULT_MENU_ID });

  return (
    <Flex
      {...rest}
      minWidth="128px"
      width="128px"
      direction="column"
      onContextMenu={(e) => show(e, { props: song })}
      {...dragSongProps}
    >
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
        <MotionBox
          position="absolute"
          width="100%"
          height="100%"
          display="flex"
          top="0"
          justifyContent="center"
          alignItems="center"
          whileHover={{
            backgroundColor: "rgba(0,0,0,0.4)",
            opacity: 1,
          }}
          opacity={0}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <MotionBox
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => playSong()}
            onMouseDown={(e: MouseEvent) => {
              if (e.button === 1) {
                //middle mouse:
                window.open(`/song/${song.id}`, "_blank");
                e.preventDefault();
              }
            }}
            cursor="pointer"
            display="flex"
            justifyContent="center"
          >
            <Icon as={FaPlay} w={8} h={8} color="n2.200" />
          </MotionBox>
        </MotionBox>
      </Flex>
      <Text
        noOfLines={2}
        height="44px"
        fontSize={14}
        my={1}
        as={Link}
        to={`/song/${song.id}`}
        _hover={{ textDecoration: "underline" }}
      >
        {song.name}
      </Text>
    </Flex>
  );
};
