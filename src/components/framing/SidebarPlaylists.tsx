import { Flex, Icon } from "@chakra-ui/react";
import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";

export const SidebarPlaylists = ({
  playlistStubs,
}: {
  playlistStubs: PlaylistStub[];
}) => {
  return (
    <div>
      {playlistStubs.map((x) => {
        return (
          <Link to={"/playlists/" + x.id}>
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
              key={"sidebar" + x.id}
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
          </Link>
        );
      })}
    </div>
  );
};
