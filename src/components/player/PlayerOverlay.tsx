import { Button } from "@chakra-ui/button";
import { Box, Container, Heading, HStack } from "@chakra-ui/layout";
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
import React, { Suspense, useMemo } from "react";
import { FiLink2, FiMoreHorizontal, FiTrash } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { identifyLink, identifyTitle } from "../../utils/PlaylistHelper";
import { Link } from "react-router-dom";

export const PlayerOverlay = React.memo(() => {
  const expanded = useStoreState((state) => state.player.showUpcomingOverlay);
  const setExpanded = useStoreActions(
    (actions) => actions.player.setShowUpcomingOverlay
  );

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

  const location = useLocation();

  React.useEffect(() => {
    // runs on location, i.e. route, change
    setExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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

  const urlLinkToPlaylist = useMemo(
    () => currentPlaylist && identifyLink(currentPlaylist),
    [currentPlaylist]
  );

  return (
    <OverlayWrapper visible={expanded}>
      <div className="bgOver"></div>
      <div className="overlay">
        {expanded && (
          <Container
            alignContent="stretch"
            maxW={{ lg: "5xl" }}
            paddingTop="20px"
          >
            <HStack alignItems={"center"}>
              <Button
                marginRight="auto"
                marginLeft="auto"
                leftIcon={<FiTrash />}
                colorScheme="red"
                onClick={() => {
                  clearAll();
                  setExpanded(false);
                }}
              >
                Clear All
              </Button>
            </HStack>
            {currentQueue.length > 0 && (
              <React.Fragment>
                <Heading mt={4}>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <SongTable
                    songs={currentQueue}
                    songClicked={(e, s) =>
                      next({ count: (s as any).idx - 1, userSkipped: true })
                    }
                    songDropdownMenuRenderer={OverlayDropDownMenu}
                  />
                </Suspense>
                <Divider />
              </React.Fragment>
            )}
            {currentlyPlaying && (
              <React.Fragment>
                <Heading mt={4}>
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
                <Text
                  fontSize="md"
                  as={Link}
                  to={urlLinkToPlaylist || "#"}
                  onClick={() => setExpanded(false)}
                  _hover={{ textDecoration: "underline" }}
                >
                  {currentTitle}
                  <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label="go to playlist"
                    icon={<FiLink2 />}
                    ml={1}
                  ></IconButton>
                </Text>
                <Suspense fallback={<div>Loading...</div>}>
                  <SongTable
                    songs={playlistTotalQueue}
                    songClicked={(e, s) =>
                      next({ count: (s as any).idx - 1, userSkipped: true })
                    }
                  />
                </Suspense>
              </React.Fragment>
            )}
            <Box height="200px"></Box>
          </Container>
        )}
      </div>
    </OverlayWrapper>
  );
});

const OverlayWrapper = styled.div<{ visible: boolean }>`
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: ${({ visible }) => (visible ? "scroll" : "hidden")};
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
  }
`;

function OverlayDropDownMenu(song: Song) {
  // const song: Song = song;
  const queueRemove = useStoreActions((store) => store.playback.queueRemove);
  const addPlaylist = useStoreActions(
    (store) => store.addPlaylist.showPlaylistAddDialog
  );
  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );
  const next = useStoreActions((s) => s.playback.next);

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
            if (
              (song as any).idx > 1 ||
              ((song as any).idx >= 1 && currentlyPlaying.from !== "queue")
            )
              // when the song you want to remove is on the queue.
              queueRemove(
                (song as any).idx -
                  1 -
                  (currentlyPlaying.from === "queue" ? 1 : 0)
              );
            else if (
              (song as any).idx === 1 &&
              currentlyPlaying.from === "queue"
            )
              // when the song you want to remove is NOW PLAYING.
              next({ count: 1, userSkipped: true });
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
