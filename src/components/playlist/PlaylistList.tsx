import {
  Box,
  Flex,
  HStack,
  Icon,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { DragEvent, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FiFolder, FiMenu, FiRadio } from "react-icons/fi";
import { MdDragHandle } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFormatPlaylist } from "../../modules/playlist/useFormatPlaylist";
import { splitPlaylistEmoji } from "../../modules/playlist/utils";
import { usePlaylistUpdater } from "../../modules/services/playlist.service";
import { useStoreActions, useStoreState } from "../../store";
import { useRaisedShadow } from "../settings/OrgManagement";

function getIcon(type: string, defaultIcon: IconType) {
  if (type.indexOf("radio/") === 0) {
    return FiRadio;
  }
  return defaultIcon;
}
export const PlaylistList = ({
  playlistStubs,
  vibe = false,
  editable = false,
  defaultIcon,
  editMode,
}: {
  playlistStubs: PlaylistStub[];
  vibe?: boolean;
  editable?: boolean;
  defaultIcon?: IconType;
  editMode?: boolean;
}) => {
  const playlistList = useStoreState((state) => state.playlist.playlistList);
  const setPlaylistList = useStoreActions(
    (action) => action.playlist.setPlaylistList,
  );
  const sorted = useMemo(
    () => [
      ...playlistList.flatMap(
        (playlistId) =>
          playlistStubs.find((playlist) => playlistId === playlist.id) ?? [],
      ),
      ...playlistStubs.filter((playlist) =>
        playlistList.every((playlistId) => playlistId !== playlist.id),
      ),
    ],
    [playlistList, playlistStubs],
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const items = [...sorted];
      const reorderedItem = items.splice(result.source.index, 1)[0];
      items.splice(result.destination?.index ?? items.length, 0, reorderedItem);
      setPlaylistList(items.map((playlist) => playlist.id));
    },
    [sorted, setPlaylistList],
  );

  return (
    <div>
      <AnimatePresence>
        {editMode ? (
          <Reorder.Group
            axis="y"
            values={sorted}
            onReorder={(playlists: PlaylistStub[]) =>
              setPlaylistList(playlists.map((playlist) => playlist.id))
            }
          >
            <VStack align="stretch" spacing={0} userSelect="none">
              {sorted.map((playlist, index) => (
                <PlaylistButton
                  key={playlist.id}
                  playlist={playlist}
                  vibe={vibe}
                  editable={editable}
                  defaultIcon={defaultIcon}
                  editMode={editMode}
                />
              ))}
            </VStack>
          </Reorder.Group>
        ) : (
          <VStack spacing={0} align="stretch">
            {sorted.map((playlist) => (
              <PlaylistButton
                key={playlist.id}
                playlist={playlist}
                vibe={vibe}
                editable={editable}
                defaultIcon={defaultIcon}
                editMode={editMode}
              />
            ))}
          </VStack>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlaylistButton = ({
  playlist,
  editMode,
  vibe,
  editable,
  defaultIcon = FiFolder,
}: {
  playlist: PlaylistStub;
  editMode?: boolean;
  vibe?: boolean;
  editable?: boolean;
  defaultIcon?: IconType;
}) => {
  const { t } = useTranslation();
  const { mutateAsync } = usePlaylistUpdater();
  const toast = useToast();
  const formatPlaylist = useFormatPlaylist();
  const controls = useDragControls();
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const title = formatPlaylist("title", playlist) || "Untitled";
  const { rest, emoji } = splitPlaylistEmoji(title);
  return editMode ? (
    <Reorder.Item
      value={playlist}
      id={playlist.id}
      dragListener={false}
      dragControls={controls}
      style={{
        boxShadow,
      }}
    >
      <HStack
        spacing={0}
        mx="2"
        px="2"
        py="2"
        borderRadius="lg"
        role="group"
        transition={"all 0.2s ease-out"}
        _hover={{
          bg: "bg.700",
          color: "white",
        }}
      >
        <Flex mr="4" fontSize=".85rem">
          {emoji || (
            <Icon
              width="1.15rem"
              height="24px"
              _groupHover={{
                color: "white",
              }}
              as={getIcon(playlist.type, defaultIcon)}
            />
          )}
        </Flex>
        <Text noOfLines={1}>{rest}</Text>
        <Spacer />
        <Icon
          as={MdDragHandle}
          w={6}
          h={6}
          cursor="move"
          onPointerDown={(e) => controls.start(e)}
          onTouchStart={(e) => controls.start(e)}
        />
      </HStack>
    </Reorder.Item>
  ) : (
    <motion.div
      key={"p-sb-" + playlist.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Link to={formatPlaylist("link", playlist) || "#"}>
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
          onDragOver={(e: DragEvent) => {
            if (editable && vibe) {
              e.preventDefault();
              (e.currentTarget as any).style.boxShadow =
                "inset 0 0 4px 3px var(--chakra-colors-n2-500)";
            }
          }}
          onDragEnter={(e: DragEvent) => {}}
          onDragLeave={(e: DragEvent) => {
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
                playlistId: playlist.id,
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
                },
              );
            }
          }}
        >
          <Flex mr="4" fontSize=".85rem">
            {emoji || (
              <Icon
                width="1.15rem"
                height="24px"
                _groupHover={{
                  color: "white",
                }}
                as={getIcon(playlist.type, defaultIcon)}
              />
            )}
          </Flex>
          <Text noOfLines={1}>{rest}</Text>
        </Flex>
      </Link>
    </motion.div>
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
