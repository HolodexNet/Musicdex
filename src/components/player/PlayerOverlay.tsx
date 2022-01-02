import { Button } from "@chakra-ui/button";
import { Container } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useStoreState, useStoreActions } from "../../store";
import { SongTable } from "../data/SongTable";
import { Text } from "@chakra-ui/react";
import React, { useMemo } from "react";

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
                <SongTable songs={currentQueue} />
              </React.Fragment>
            )}
            <br />
            <Text fontSize="3xl">Playlist</Text>
            <Divider />
            <br />
            <SongTable songs={playlistTotalQueue} />
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
  overflow-y: scroll;
  position: absolute;
  top: 0;
  pointer-events: ${({ visible }) => (visible ? "" : "none")};

  .overlay {
    position: relative;
    top: ${({ visible }) => (visible ? "64px" : "100vh")};
    opacity: ${({ visible }) => (visible ? "1" : "0")};
    height: calc(100% - 64px - 80px);
    transition: top 0.4s ease, opacity 0.5s ease;
    width: 100%;
    z-index: 5;
  }
  .bgOver {
    top: ${({ visible }) => (visible ? "64px" : "100vh")};
    opacity: ${({ visible }) => (visible ? "1" : "0")};
    height: calc(100% - 64px - 80px);
    transition: top 0.4s ease, opacity 0.5s ease;

    background: black;
    position: fixed;
    width: 100%;
    z-index: 4;
  }
`;
