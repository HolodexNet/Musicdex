import { Flex, Icon, Text } from "@chakra-ui/react";
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
        const emoji = x.title.match(/^\p{Emoji}/gu);
        const rest = x.title.match(/(?!\p{Emoji})(.*)$/gu);
        return (
          <Link to={"/playlists/" + x.id} key={"sidebar-pl" + x.id}>
            <Flex
              align="center"
              px="4"
              mx="4"
              py="2"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              _hover={{
                bg: "cyan.400",
                color: "white",
              }}
            >
              {emoji ? (
                <Text fontSize="16" mr="4" maxW="16px">
                  {emoji?.[0] || ""}
                </Text>
              ) : (
                <Icon
                  mr="4"
                  fontSize="16"
                  _groupHover={{
                    color: "white",
                  }}
                  as={FiFolder}
                />
              )}
              {rest?.[0]}
            </Flex>
          </Link>
        );
      })}
    </div>
  );
};
