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
} from "@chakra-ui/react";
import { IoMdPlay } from "react-icons/io";
import { MdCheckCircle, MdSettings } from "react-icons/md";

export const VideoPlaylistHighlight = ({
  video,
  playlist,
}: {
  video: any;
  playlist?: PlaylistFull;
}) => {
  return (
    <Stack>
      <AspectRatio
        ratio={34 / 9}
        maxH="400px"
        borderRadius="lg"
        borderColor="brand.100"
        borderWidth="1px"
        borderStyle="solid"
        overflow="hidden"
      >
        <Flex>
          <AspectRatio
            ratio={16 / 9}
            flex={"0 1"}
            flexBasis={1600 / 34 + "%"}
            width={1600 / 34 + "%"}
          >
            <Image src={`https://i.ytimg.com/vi/${video.id}/sddefault.jpg`} />
          </AspectRatio>
          <Box
            flex={"1 1"}
            flexBasis={900 / 34 + "%"}
            overflowY="auto"
            pl={2}
            height="100%"
          >
            {playlist?.content ? (
              <List spacing={1}>
                {playlist?.content.map((x) => (
                  <ListItem key={x.id + "highlightsong"} noOfLines={1}>
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
              <Center>
                <Text>Stream is not yet tagged with any songs.</Text>
              </Center>
            )}
          </Box>
        </Flex>
      </AspectRatio>
      <Text>{video.title}</Text>
    </Stack>
  );
};
