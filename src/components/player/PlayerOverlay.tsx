import { Button } from "@chakra-ui/button";
import { Box, Container, Heading } from "@chakra-ui/layout";
import {
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useStoreState, useStoreActions } from "../../store";
import { SongTable } from "../data/SongTable";
import { Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FiMoreHorizontal, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { identifyTitle } from "../../utils/PlaylistHelper";

export function PlayerOverlay({
  isExpanded,
  toggleExpanded,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const playedPlaylistQueue = useStoreState(
    (state) => state.playback.playedPlaylistQueue
  );

  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );

  const currentPlaylist = useStoreState((s) => s.playback.currentPlaylist);

  const playlistTotalQueue = useMemo(() => {
    const now =
      currentlyPlaying.from === "playlist" ? [currentlyPlaying.song!] : [];
    return [...now, ...playlistQueue, ...playedPlaylistQueue];
  }, [
    currentlyPlaying.from,
    currentlyPlaying.song,
    playedPlaylistQueue,
    playlistQueue,
  ]);

  const queue = useStoreState((state) => state.playback.queue);

  const currentQueue = useMemo(() => {
    const now =
      currentlyPlaying.from === "queue" ? [currentlyPlaying.song!] : [];

    return [...now, ...queue];
  }, [currentlyPlaying.from, currentlyPlaying.song, queue]);

  const clearAll = useStoreActions((actions) => actions.playback.clearAll);
  const clearQueue = useStoreActions((actions) => actions.playback._queueClear);

  const clearPlaylist = useStoreActions(
    (actions) => actions.playback.clearPlaylist
  );

  const next = useStoreActions((actions) => actions.playback.next);

  const currentTitle = useMemo(
    () => currentPlaylist && identifyTitle(currentPlaylist),
    [currentPlaylist]
  );

  return (
    <OverlayWrapper visible={isExpanded}>
      <div className="bgOver"></div>
      <div className="overlay">
        {isExpanded && (
          <Container
            alignContent="stretch"
            maxW={{ lg: "5xl" }}
            paddingTop="20px"
          >
            <Button onClick={() => clearAll()}>Clear All</Button>
            {currentQueue.length > 0 && (
              <React.Fragment>
                <Heading>
                  Queue:
                  <IconButton
                    aria-label="clear playlist"
                    icon={<FiTrash />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => clearQueue()}
                    float="right"
                  ></IconButton>
                </Heading>
                <SongTable
                  songs={currentQueue}
                  songClicked={(e, s) =>
                    next({ count: (s as any).idx - 1, userSkipped: true })
                  }
                  songDropdownMenuRenderer={OverlayDropDownMenu}
                />
                <Divider />
              </React.Fragment>
            )}
            {playlistTotalQueue.length > 0 && (
              <React.Fragment>
                <Heading>
                  Playlist:
                  <IconButton
                    aria-label="clear playlist"
                    icon={<FiTrash />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => clearPlaylist()}
                    float="right"
                  ></IconButton>
                </Heading>
                <Text fontSize="md">{currentTitle}</Text>
                <SongTable
                  songs={playlistTotalQueue}
                  songClicked={(e, s) =>
                    next({ count: (s as any).idx - 1, userSkipped: true })
                  }
                />
              </React.Fragment>
            )}
            <Box height={40}></Box>
          </Container>
        )}
      </div>
    </OverlayWrapper>
  );
}

const OverlayWrapper = styled.div<{ visible: boolean }>`
  width: 100vw;
  min-height: 100vh;
  // overflow: hidden;
  overflow: ${({ visible }) => (visible ? "scroll" : "hidden")};
  position: fixed;
  top: 0;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  z-index: 5;

  .overlay {
    position: relative;
    top: ${({ visible }) => (visible ? "64px" : "100vh")};
    visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
    transition: top 0.4s ease, opacity 0.5s ease;
    width: 100%;
    z-index: 6;
    clip-path: inset(0 0 0 0);
  }
  .bgOver {
    top: ${({ visible }) => (visible ? "64px" : "100vh")};
    visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
    height: calc(100% - 64px - 80px);
    transition: top 0.4s ease, opacity 0.5s ease;

    background: black;
    position: fixed;
    width: 100%;
    z-index: 4;
  }
`;

function OverlayDropDownMenu(cellInfo: any) {
  const song: Song = cellInfo.row.original;
  const queueRemove = useStoreActions((store) => store.playback.queueRemove);
  const addPlaylist = useStoreActions(
    (store) => store.addPlaylist.showPlaylistAddDialog
  );

  const copyToClipboard = useClipboardWithToast();
  const navigate = useNavigate();

  return (
    <Menu
      eventListeners={{ scroll: false }}
      isLazy
      boundary="scrollParent"
      computePositionOnMount={true}
      gutter={10}
      placement="left"
      closeOnBlur={true}
    >
      <MenuButton
        //   py={2}
        icon={<FiMoreHorizontal />}
        as={IconButton}
        rounded="full"
        size="sm"
        mr={-2}
        variant="ghost"
        colorScheme="n2"
        aria-label="More"
      ></MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            console.log((song as any).idx);
            if ((song as any).idx) queueRemove((song as any).idx - 1);
          }}
          color="red.400"
        >
          Remove from Queue
        </MenuItem>
        <MenuItem
          onClick={() =>
            copyToClipboard(`${window.location.origin}/song/${song.id}`)
          }
        >
          Copy Song Link
        </MenuItem>
        <MenuItem
          onClick={() => {
            addPlaylist(song);
          }}
        >
          Add To Playlist...
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            navigate("/song/" + song.id);
          }}
        >
          Go To Song Page
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/video/" + song.video_id);
          }}
        >
          Go To Video Page
        </MenuItem>
        <MenuItem>Go to Channel Page</MenuItem>
        {/* <MenuDivider /> */}
      </MenuList>
    </Menu>
  );
}
