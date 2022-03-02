import { Flex, Heading, Spacer } from "@chakra-ui/layout";
import { IconButton, Text } from "@chakra-ui/react";
import React, { Suspense, useMemo } from "react";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { DEFAULT_MENU_ID } from "../components/common/CommonContext";
import {
  QueueContextMenu,
  QUEUE_MENU_ID,
} from "../components/common/QueueContext";
import { SongTable } from "../components/data/SongTable";
import { SongRow } from "../components/data/SongTable/SongRow";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useFormatPlaylist } from "../modules/playlist/useFormatPlaylist";
import { useStoreActions, useStoreState } from "../store";

export const Queue = React.memo(() => {
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const playedPlaylistQueue = useStoreState(
    (state) => state.playback.playedPlaylistQueue
  );

  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );

  const currentPlaylist = useStoreState((s) => s.playback.currentPlaylist);

  const playlistTotalQueue = useMemo(() => {
    return [...playlistQueue, ...playedPlaylistQueue];
  }, [playedPlaylistQueue, playlistQueue]);

  const queue = useStoreState((state) => state.playback.queue);

  // const clearAll = useStoreActions((actions) => actions.playback.clearAll);
  const clearQueue = useStoreActions((actions) => actions.playback._queueClear);

  const clearPlaylist = useStoreActions(
    (actions) => actions.playback.clearPlaylist
  );

  const next = useStoreActions((actions) => actions.playback.next);
  const formatPlaylist = useFormatPlaylist();
  const { currentTitle, urlLinkToPlaylist } = useMemo(
    () => ({
      currentTitle: currentPlaylist && formatPlaylist("title", currentPlaylist),
      urlLinkToPlaylist:
        currentPlaylist && formatPlaylist("link", currentPlaylist),
    }),
    [currentPlaylist, formatPlaylist]
  );

  return (
    <PageContainer>
      <div className="bgOver"></div>
      <QueueContextMenu />
      <ContainerInlay>
        <Heading size="lg">Now Playing</Heading>
        {currentlyPlaying.song ? (
          <SongRow
            index={0}
            style={{ borderTop: "none" }}
            data={{
              songList: [currentlyPlaying.song],
              menuId: DEFAULT_MENU_ID,
              rowProps: {
                showArtwork: true,
              },
            }}
          />
        ) : (
          <Text fontSize="lg" opacity={0.66}>
            Nothing to play...
          </Text>
        )}

        {queue.length > 0 && (
          <React.Fragment>
            <Flex mt={4} alignItems="center">
              <Text fontSize="lg">
                <Text opacity={0.66} as={"span"}>
                  Queue:
                </Text>
              </Text>
              <Spacer />
              <IconButton
                aria-label="clear playlist"
                icon={<FiTrash />}
                colorScheme="red"
                variant="ghost"
                onClick={() => clearQueue()}
              ></IconButton>
            </Flex>
            <Suspense fallback={<div>Loading...</div>}>
              <SongTable
                songs={queue}
                menuId={QUEUE_MENU_ID}
                rowProps={{
                  songClicked: (e, s) =>
                    next({ count: (s as any).idx - 1, userSkipped: true }),
                }}
                limit={10}
              />
            </Suspense>
          </React.Fragment>
        )}
        {currentPlaylist && (
          <React.Fragment>
            <Flex mt={4} alignItems="center">
              <Text fontSize="lg">
                <Text opacity={0.66} as={"span"}>
                  Playlist:{" "}
                </Text>
                <Text
                  fontWeight={600}
                  as={Link}
                  to={urlLinkToPlaylist || "#"}
                  _hover={{ textDecoration: "underline" }}
                  isTruncated
                >
                  {currentTitle}
                </Text>
              </Text>
              <Spacer />
              <IconButton
                aria-label="clear playlist"
                icon={<FiTrash />}
                colorScheme="red"
                variant="ghost"
                onClick={() => clearPlaylist()}
              ></IconButton>
            </Flex>
            <Suspense fallback={<div>Loading...</div>}>
              <SongTable
                songs={playlistTotalQueue}
                rowProps={{
                  songClicked: (e, s) =>
                    next({ count: (s as any).idx - 1, userSkipped: true }),
                }}
                limit={10}
              />
            </Suspense>
          </React.Fragment>
        )}
      </ContainerInlay>
    </PageContainer>
  );
});
