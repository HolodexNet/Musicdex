import { Flex, Icon } from "@chakra-ui/react";
import { FiFolder } from "react-icons/fi";

export const SidebarPlaylists = ({
  playlistStubs,
}: {
  playlistStubs: PlaylistStub[];
}) => {
  return (
    <div>
      {playlistStubs.map((x) => {
        return (
          <Flex
            align="center"
            px="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              bg: "cyan.400",
              color: "white",
            }}
          >
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={FiFolder}
            />
            {x.title}
          </Flex>
        );
      })}
    </div>
  );
};
