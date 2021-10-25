import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { FaExpand, FaPause, FaPlay } from "react-icons/fa";
import { FiMinimize2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreActions, useStoreState } from "../../store";

function useKeyboardEvents(
  callback: (event: KeyboardEvent) => void,
  deps: React.DependencyList = []
) {
  const onKeyPressed = useCallback(
    (event: KeyboardEvent) => {
      callback(event);
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyPressed);
    return () => document.removeEventListener("keydown", onKeyPressed);
  }, [deps, onKeyPressed]);
}

export function Player() {
  const target = useStoreState((state) => state.player.target);

  const setTarget = useStoreActions((state) => state.player.setTarget);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  // bind React state and YouTube Player's state
  useEffect(() => {
    if (!player) return;
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, player]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  // handle keyboard shortcuts
  useKeyboardEvents(
    (event) => {
      if (event.key === "Escape") {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          setTarget(null);
        }
      }
    },
    [isExpanded, setTarget]
  );

  // handle if video id is changed
  useEffect(() => {
    if (!target) {
      setIsPlaying(false);
      setPlayer(null);
      return;
    }
    setIsPlaying(true);
  }, [target, isPlaying]);

  // controls
  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function toggleExpanded() {
    setIsExpanded((prev) => !prev);
  }

  function onCloseButtonClicked() {
    setIsExpanded(false);
    setTarget(null);
  }

  function onOverlayClicked() {
    setIsExpanded(true);
  }

  return (
    <Container expanded={isExpanded} visible={target !== null}>
      <PlayerContainer>
        <PlayerOverlay enabled={!isExpanded} onClick={onOverlayClicked} />
        {target && (
          <YouTube
            containerClassName="yt-container"
            className="yt-player"
            videoId={target}
            opts={{
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
              },
            }}
            onReady={onReady}
          />
        )}
      </PlayerContainer>

      <Controlls>
        <Button onClick={onCloseButtonClicked}>
          <IoMdClose />
        </Button>
        <Button onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <Button onClick={toggleExpanded}>
          {isExpanded ? <FiMinimize2 /> : <FaExpand />}
        </Button>
      </Controlls>
    </Container>
  );
}

const Controlls = styled.div`
  display: flex;
  margin: 0 30px 0 10px;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 5px;
`;

const Container = styled.div<{ expanded: boolean; visible: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
  width: ${({ expanded }) => (expanded ? "100%" : "380px")};
  height: ${({ expanded }) => (expanded ? "100%" : "100px")};
  transition: all 0.3s ease-out;
  background: #1c1c1c;
  overflow: hidden;
  margin: ${({ expanded }) => (expanded ? "0px" : "20px")};
  border-radius: ${({ expanded }) => (expanded ? "0px" : "50px")};
  flex-direction: row;
  display: flex;
  align-items: center;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  opacity: ${({ visible }) => (visible ? "1" : "0")};

  .yt-container {
    height: 100%;
    width: 100%;
  }

  .yt-player {
    width: 100%;
    height: 100%;
  }
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PlayerOverlay = styled.div<{ enabled: boolean }>`
  display: ${({ enabled }) => (enabled ? "block" : "none")};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  cursor: pointer;
`;
