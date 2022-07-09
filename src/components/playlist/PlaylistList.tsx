import { Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useFormatPlaylist } from "../../modules/playlist/useFormatPlaylist";
import { splitPlaylistEmoji } from "../../modules/playlist/utils";
import { usePlaylistUpdater } from "../../modules/services/playlist.service";

export const PlaylistList = ({
  playlistStubs,
  vibe = false,
  editable = false,
  defaultIcon = FiFolder,
}: {
  playlistStubs: PlaylistStub[];
  vibe?: boolean;
  editable?: boolean;
  defaultIcon?: IconType;
}) => {
  const { t } = useTranslation();
  const { mutateAsync } = usePlaylistUpdater();
  const toast = useToast();
  const formatPlaylist = useFormatPlaylist();
  return (
    <div>
      <AnimatePresence>
        {playlistStubs.map((x) => {
          const title = formatPlaylist("title", x) || "Untitled";
          const { rest, emoji } = splitPlaylistEmoji(title);

          return (
            <motion.div
              key={"p-sb-" + x.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link to={formatPlaylist("link", x) || "#"}>
                <Flex
                  align="center"
                  mx="2"
                  px="2"
                  py="2"
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  transition={"all 0.2s ease-out"}
                  _hover={{
                    bg: "brand.700",
                    color: "white",
                  }}
                  boxShadow={
                    vibe ? "inset 0 0 4px 0px var(--chakra-colors-n2-500)" : ""
                  }
                  onDragOver={(e) => {
                    if (editable && vibe) {
                      e.preventDefault();
                      (e.currentTarget as any).style.boxShadow =
                        "inset 0 0 4px 3px var(--chakra-colors-n2-500)";
                    }
                  }}
                  onDragEnter={(e) => {}}
                  onDragLeave={(e) => {
                    (e.currentTarget as any).style.boxShadow = "";
                  }}
                  onDrop={(e: DragEvent<HTMLDivElement>) => {
                    const s = e.dataTransfer.getData("song");
                    (e.currentTarget as any).style.boxShadow = "";
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
                            title: t("Added"),
                            duration: 1500,
                          });
                        },
                        () => {
                          toast({
                            status: "warning",
                            position: "top-right",
                            title: t("Something went wrong"),
                            isClosable: true,
                          });
                        }
                      );
                    }
                  }}
                >
                  {emoji ? (
                    <Flex mr="4" maxW="1rem">
                      {emoji}
                    </Flex>
                  ) : (
                    <Icon
                      mr="4"
                      fontSize="18"
                      width="1rem"
                      height="24px"
                      _groupHover={{
                        color: "white",
                      }}
                      as={defaultIcon}
                    />
                  )}
                  <Text noOfLines={1}>{rest}</Text>
                </Flex>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// const VibeText = styled.span<{ vibe: boolean }>`
//   animation: ${({ vibe }) => (vibe ? "vibe 0.3s linear infinite both" : "")};

//   @keyframes vibe {
//     ${() => {
//       return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
//         .map((x) => {
//           const r1 = Math.random() * 1.6 - 0.8;
//           const r2 = Math.random() * 1.6 - 0.8;
//           const r = `translate(${r1.toFixed(1)}px, ${r2.toFixed(
//             1
//           )}px) rotate(${r1}deg);`;
//           return `${x}% {
//           -webkit-transform: ${r}
//           transform: ${r}
//          }`;
//         })
//         .join("\n");
//     }}
//   }
// `;
