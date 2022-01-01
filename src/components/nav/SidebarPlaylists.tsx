import { Flex, Icon, Text } from "@chakra-ui/react";
import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import { identifyTitle } from "../../utils/PlaylistHelper";

export const SidebarPlaylists = ({
  playlistStubs,
}: {
  playlistStubs: PlaylistStub[];
}) => {
  return (
    <div>
      {playlistStubs.map((x) => {
        const title = identifyTitle(x) || "...";
        const emoji = title.match(/^\p{Emoji}/gu);
        const rest = title.match(/(?!\p{Emoji})(.*)$/gu);
        return (
          <Link to={"/playlists/" + x.id} key={"sidebar-pl" + x.id}>
            <Flex
              align="center"
              px="2"
              mx="2"
              py="2"
              my="1"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              _hover={{
                bg: "cyan.400",
                color: "white",
              }}
            >
              {emoji ? (
                <Text as="span" fontSize="16" mr="4" maxW="16px">
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
              <Text as="span" noOfLines={1}>
                {rest?.[0]}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </div>
  );
};
