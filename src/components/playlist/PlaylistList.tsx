import { Flex, Icon, Text, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";
import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import { usePlaylistUpdater } from "../../modules/services/playlist.service";
import { identifyTitle } from "../../utils/PlaylistHelper";

export const PlaylistList = ({
  playlistStubs,
  vibe = false,
  defaultIcon = FiFolder,
}: {
  playlistStubs: PlaylistStub[];
  vibe?: boolean;
  defaultIcon?: IconType;
}) => {
  const { mutateAsync } = usePlaylistUpdater();
  const toast = useToast();

  return (
    <div>
      <AnimatePresence>
        {playlistStubs.map((x) => {
          const title = identifyTitle(x) || "...";
          const emoji = title.match(/^(?!\d)\p{Emoji}/gu); // Match a emoji that's not preceeded by a number
          const rest = title.match(/(?!^(?!\d)\p{Emoji})(.*)$/gu); // a bit confusing. double negative lookahead. Match <.*> that's not preceeded by a Emoji, but the Emoji can't be a number.
          return (
            <motion.div
              key={"sidebar-pld" + x.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link to={"/playlists/" + x.id}>
                <Flex
                  align="center"
                  m="1"
                  px="2"
                  py="1"
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  _hover={{
                    bg: "brand.700",
                    color: "white",
                  }}
                  boxShadow={
                    vibe ? "inset 0 0 4px 0px var(--chakra-colors-n2-500)" : ""
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    (e.currentTarget as any).style.boxShadow =
                      "inset 0 0 4px 3px var(--chakra-colors-n2-500)";
                  }}
                  onDragEnter={(e) => {}}
                  onDragLeave={(e) => {
                    (e.target as any).style.boxShadow = "";
                  }}
                  onDrop={(e) => {
                    const s = e.dataTransfer.getData("song");
                    (e.target as any).style.boxShadow = "";
                    if (s) {
                      e.preventDefault();
                      const song = JSON.parse(s);
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
                      as={defaultIcon}
                    />
                  )}
                  <Text noOfLines={1} vibe={vibe} as={VibeText}>
                    {rest?.[0]}
                  </Text>
                </Flex>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
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
