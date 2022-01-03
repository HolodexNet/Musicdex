import { Button } from "@chakra-ui/button";
import { Container } from "@chakra-ui/layout";
import {
  Divider,
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
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";

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

  const next = useStoreActions((actions) => actions.playback.next);

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
                <Text fontSize="3xl">Queue</Text>
                <Divider />
                <br />
                <SongTable
                  songs={currentQueue}
                  songClicked={(e, s) =>
                    next({ count: (s as any).idx - 1, userSkipped: true })
                  }
                  songDropdownMenuRenderer={OverlayDropDownMenu}
                />
              </React.Fragment>
            )}
            <br />
            <Text fontSize="3xl">Playlist</Text>
            <Divider />
            <br />
            <SongTable
              songs={playlistTotalQueue}
              songClicked={(e, s) =>
                next({ count: (s as any).idx - 1, userSkipped: true })
              }
            />
          </Container>
        )}
      </div>
    </OverlayWrapper>
  );
}

const OverlayWrapper = styled.div<{ visible: boolean }>`
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: ${({ visible }) => (visible ? "scroll" : "hidden")};
  position: absolute;
  top: 0;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};

  .overlay {
    position: relative;
    top: ${({ visible }) => (visible ? "64px" : "100vh")};
    visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
    height: calc(100% - 64px - 80px);
    transition: top 0.4s ease, opacity 0.5s ease;
    width: 100%;
    z-index: 5;
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
