import { Button } from "@chakra-ui/button";
import { Container } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useStoreState, useStoreActions } from "../../store";
import { SongTable } from "../data/SongTable";
import { Text } from "@chakra-ui/react";

export function PlayerOverlay({ visible }: { visible: boolean }) {
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const queue = useStoreState((state) => state.playback.queue);
  const clearAll = useStoreActions((actions) => actions.playback.clearAll);
  //   const currentlyPlaying = useStoreState(
  //     (state) => state.playback.currentlyPlaying
  //   );
  if (!visible) return <div />;
  return (
    <Overlay>
      <Container alignContent="stretch" maxW={{ lg: "5xl" }} paddingTop="20px">
        <Button onClick={() => clearAll()}>Clear All</Button>
        <Text fontSize="3xl">Queue</Text>
        <Divider />
        <br />
        <SongTable songs={queue} />
        <br />
        <Text fontSize="3xl">Playlist</Text>
        <Divider />
        <br />
        <SongTable songs={playlistQueue} />
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: absolute;
  top: 64px;
  background: black;
  width: 100%;
  height: calc(100% - 64px - 80px);
  overflow: auto;
`;
