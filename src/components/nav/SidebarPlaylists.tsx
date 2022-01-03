import { Flex, Icon, Text, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import { usePlaylistUpdater } from "../../modules/services/playlist.service";
import { identifyTitle } from "../../utils/PlaylistHelper";

export const SidebarPlaylists = ({
  playlistStubs,
  vibe = false,
}: {
  playlistStubs: PlaylistStub[];
  vibe?: boolean;
}) => {
  const { mutateAsync } = usePlaylistUpdater();
  const toast = useToast();

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
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnter={(e) => {
                (e.target as any).style.textShadow =
                  "1px 1px 1px var(--chakra-colors-n2-500)";
              }}
              onDragLeave={(e) => {
                (e.target as any).style.textShadow = "";
              }}
              onDrop={(e) => {
                const s = e.dataTransfer.getData("song");
                console.log("huh");
                (e.target as any).style.textShadow = "";
                if (s) {
                  e.preventDefault();
                  const song = JSON.parse(s);
                  console.log(song);
                  mutateAsync({
                    action: "add",
                    playlistId: x.id,
                    song: song.id,
                  }).then(
                    () => {
                      toast({
                        status: "success",
                        position: "top-right",
                        title: "Added",
                      });
                    },
                    () => {
                      toast({
                        status: "warning",
                        position: "top-right",
                        title: "Something went wrong",
                      });
                    }
                  );
                }
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
              <Text as={VibeText} noOfLines={1} vibe={vibe}>
                {rest?.[0]}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </div>
  );
};

const VibeText = styled.span<{ vibe: boolean }>`
  animation: ${({ vibe }) => (vibe ? "vibe 0.3s linear infinite both" : "")};

  @keyframes vibe {
    ${() => {
      return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        .map((x) => {
          const r1 = Math.random() * 1.6 - 0.8;
          const r2 = Math.random() * 1.6 - 0.8;
          const r = `translate(${r1.toFixed(1)}px, ${r2.toFixed(
            1
          )}px) rotate(${r1}deg);`;
          return `${x}% { 
          -webkit-transform: ${r}
          transform: ${r}
         }`;
        })
        .join("\n");
    }}
  }
`;
