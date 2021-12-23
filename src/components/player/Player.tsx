import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState } from "../../store";
import throttle from "lodash-es/throttle";

export function Player() {
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  // PlayerState
  const [playerState, setPlayerState] = useState(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const buffering = useMemo(() => playerState === 3, [playerState]);

  // const [seconds, setSeconds] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [seekAhead, setSeekAhead] = useState<number>(0);

  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong]
  );

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hovering, setHovering] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (playerState === 1 || playerState === 2) setIsPlaying(playerState === 1);
  }, [playerState]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player && currentSong) {
      timer = setInterval(() => {
        const s = player.getCurrentTime();
        // setSeconds(s);
        setProgress(getPlayerProgress(s));
      }, 200);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player, currentSong]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  function onStateChange(e: { data: number }) {
    setPlayerState(e.data);
  }
  // controls
  function togglePlay() {
    setIsPlaying((prev) => !prev);
    if (player) {
      isPlaying ? player.pauseVideo() : player.playVideo();
    }
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

  function onChange(e: any) {
    seekToProgress(e);
    setSeekAhead(e);
    setChanging(true);
  }

  function onChangeEnd() {
    setChanging(false);
  }

  function getPlayerProgress(seconds: number) {
    if (currentSong) {
      const shiftedStart = seconds - currentSong.start;
      return Math.min(Math.max(shiftedStart / totalDuration, 0), 1) * 100;
    }
    return 0;
  }

  const seekToProgress = throttle((percent: number) => {
    if (player && currentSong) {
      player.seekTo(currentSong.start + (percent / 100) * totalDuration, true);
    }
  }, 100);

  function sliderTime() {
    const p = buffering || changing ? seekAhead : progress;
    return `${Math.round((p / 100) * totalDuration)}s`;
  }

  return (
    <Container visible={true}>
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
          onStateChange={onStateChange}
        />
      )}

      <Slider
        defaultValue={0}
        step={0.1}
        min={0}
        max={100}
        value={buffering || changing ? seekAhead : progress}
        className="progress-slider"
        colorScheme="blue"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
      >
        <SliderTrack height={hovering ? "8px" : "6px"}>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={hovering}
          label={sliderTime()}
        >
          <SliderThumb visibility={hovering ? "visible" : "hidden"} />
        </Tooltip>
      </Slider>

      <Box padding="0px 20px" flex="1">
        <IconButton
          aria-label="Play"
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          variant="outline"
          onClick={togglePlay}
        />
      </Box>
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
    top: -3px;
    width: 100%;
  }
`;
