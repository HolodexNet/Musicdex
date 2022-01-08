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
import { MdCheckCircle, MdSettings } from "react-icons/md";
import { useStoreActions } from "../../store";

export const VideoPlaylistHighlight = ({
  video,
  playlist,
}: {
  video: any;
  playlist?: PlaylistFull;
}) => {
  const setDragging = useStoreActions((a) => a.contextMenu.setDragging);

  return (
    <Stack width="100%" height="100%">
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
          <Box flex={"1 1"} flexBasis={900 / 34 + "%"} pl={2} height="100%">
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
                {playlist?.content.map((x) => (
                  <ListItem
                    key={x.id + "highlightsong"}
                    scrollSnapAlign="start"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "text/plain",
                        `${window.location.origin}/song/${x.id}`
                      );
                      e.dataTransfer.setData(
                        "text/uri-list",
                        `${window.location.origin}/song/${x.id}`
                      );
                      e.dataTransfer.setData("song", JSON.stringify(x));
                      setDragging(true);
                    }}
                    onDragEnd={(e) => {
                      setDragging(false);
                    }}
                  >
                    <HStack>
                      <ListIcon as={IoMdPlay} width="14px" />
                      <Box>
                        <Text noOfLines={0}>{x.name}</Text>
                        <Text noOfLines={0} color="gray.500" fontSize="sm">
                          {x.channel.name} ({x.original_artist})
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>
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
      <Text>{video.title}</Text>
    </Stack>
  );
};
