import {
  ContainerProps,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { FaExpand, FaPause, FaPlay } from "react-icons/fa";
import { FiMinimize2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreActions, useStoreState } from "../../store";
import { useKeyboardEvents } from "./PlayerKeyboardControls";

export function Player() {
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  //   const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const [seconds, setSeconds] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  // bind React state and YouTube Player's state
  useEffect(() => {
    if (!player) return;
    // isPlaying ? player.playVideo() : player.pauseVideo();
  }, [isPlaying, player]);

  //   useEffect(() => {
  //       if(currentSong) {
  //         setTimeout(() => {
  //             player?.seekTo(currentSong.start, true)
  //         }, 1000);
  //       }
  //   }, [currentSong]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player && currentSong) {
      timer = setInterval(() => {
        const s = player.getCurrentTime();
        setSeconds(s);

        const shiftedStart = s - currentSong.start;
        const totalDuration = currentSong.end - currentSong.start;
        const prog = Math.min(Math.max(shiftedStart / totalDuration, 0), 1);
        console.log(prog);
        setProgress(prog);
      }, 200);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player, currentSong]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  function onPlay() {
    setIsPlaying(true);
  }

  function onPause() {
    setIsPlaying(false);
  }

  // controls
  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function toggleExpanded() {
    setIsExpanded((prev) => !prev);
  }

  function onCloseButtonClicked() {
    setIsExpanded(false);
    // setTarget(null);
  }

  function onOverlayClicked() {
    setIsExpanded(true);
  }

  return (
    <Container visible={true}>
      {/* Time: { seconds } , { progress } */}
      {currentSong && (
        <YouTube
          containerClassName="yt-container"
          className="yt-player"
          videoId={currentSong.video_id}
          opts={{
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
              start: currentSong.start,
            },
          }}
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}

      <Slider
        defaultValue={0}
        min={0}
        max={1}
        value={progress}
        className="progress-slider"
        colorScheme="blue"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Container>
  );
}

const Container = styled.div<{ visible: boolean }>`
  width: 100%;
  height: 80px;
  flex-basis: 1;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease-out;
  background: #1c1c1c;
  /* overflow: hidden; */
  flex-direction: row;
  display: flex;
  align-items: center;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  opacity: ${({ visible }) => (visible ? "1" : "0")};

  .yt-container {
    width: 600px;
    height: 300px;
    position: absolute;
    bottom: 100px;
  }

  .yt-player {
    width: 100%;
    height: 100%;
  }

  .progress-slider,
  .chakra-slider {
    position: absolute !important;
    top: 0;
    transform: translateY(-50%);
    width: 100%;
  }
`;
