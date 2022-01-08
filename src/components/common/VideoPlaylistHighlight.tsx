import {
  AspectRatio,
  Box,
  Flex,
  Image,
  List,
  ListIcon,
  Text,
  ListItem,
  Stack,
  HStack,
  Center,
  Button,
} from "@chakra-ui/react";
import { IoMdPlay } from "react-icons/io";
import { useStoreActions } from "../../store";
import { useDraggableSong } from "../data/DraggableSong";

export const VideoPlaylistHighlight = ({
  video,
  playlist,
}: {
  video: any;
  playlist?: PlaylistFull;
}) => {
  const next = useStoreActions((actions) => actions.playback.next);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  return (
    <Box width="100%" height="100%">
      <AspectRatio
        ratio={34 / 9}
        maxH="auto"
        borderRadius="lg"
        borderColor="brand.100"
        borderWidth="2px"
        borderStyle="solid"
        overflow="hidden"
        boxSizing="border-box"
      >
        <Flex>
          <AspectRatio
            ratio={16 / 9}
            flex={"0 1"}
            flexBasis={1600 / 34 + "%"}
            width={1600 / 34 + "%"}
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/sddefault.jpg`}
              borderRadius="md"
            />
          </AspectRatio>
          <Box flex={"1 1"} flexBasis={900 / 34 + "%"} height="100%">
            {playlist?.content ? (
              <List
                spacing={1}
                py={2}
                height="100%"
                overflowY="auto"
                scrollSnapType="block"
                scrollSnapStop="always"
                display="block"
                flexDir="column"
              >
                {playlist?.content.map((x, idx) => (
                  <HighlightListItem
                    key={"wph" + x.id}
                    song={x}
                    songClicked={() => {
                      console.log(idx);
                      if (!playlist) return;
                      setPlaylist({ playlist, startPos: idx });
                    }}
                  />
                ))}
              </List>
            ) : (
              <Center height="100%">
                {new Date(video.available_at) < new Date() ? (
                  <Box>
                    <Text>Stream is not yet tagged with any songs.</Text>
                    <Button variant="link" colorScheme={"n2"}>
                      Help us tag it on Holodex
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Text>Going Live (distance)</Text>
                    <Button variant="link" colorScheme={"n2"}>
                      Watch on Holodex
                    </Button>{" "}
                    <Button variant="link" colorScheme={"n2"}>
                      (Youtube)
                    </Button>
                  </Box>
                )}
              </Center>
            )}
          </Box>
        </Flex>
      </AspectRatio>
      <Text mt={1}>{video.title}</Text>
      <Text opacity={0.75} fontSize="sm">
        {video.channel.name}
      </Text>
    </Box>
  );
};

function HighlightListItem({
  song,
  songClicked,
}: {
  song: Song;
  songClicked: () => void;
}) {
  const dragProps = useDraggableSong(song);

  return (
    <ListItem
      key={song.id + "highlightsong"}
      scrollSnapAlign="start"
      _hover={{ bgColor: "whiteAlpha.200" }}
      pl={2}
      onClick={songClicked}
      {...dragProps}
    >
      <HStack>
        <ListIcon as={IoMdPlay} width="14px" />
        <Box>
          <Text noOfLines={0}>{song.name}</Text>
          <Text noOfLines={0} color="gray.500" fontSize="sm">
            {/* {song.channel.name} */} ({song.original_artist})
          </Text>
        </Box>
      </HStack>
    </ListItem>
  );
}
