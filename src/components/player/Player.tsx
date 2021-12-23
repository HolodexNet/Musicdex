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
  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );
  const currentSong = useMemo(() => currentlyPlaying.song, [currentlyPlaying]);
  const repeat = useMemo(() => currentlyPlaying.repeat, [currentlyPlaying]);

  // PlayerState
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
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
    if (player && currentSong) {
      player.seekTo(currentSong.start, true);
    }
  }, [currentSong, repeat, player]);

  useEffect(() => {
    if (playerState === 1 || playerState === 2) setIsPlaying(playerState === 1);
  }, [playerState]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player && currentSong && isPlaying) {
      timer = setInterval(() => {
        const s = player.getCurrentTime();
        if (s < currentSong.start || s > currentSong.end) {
          seekToProgress(0);
        }
        setProgress(getPlayerProgress(s));
      }, 200);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player, currentSong]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
    if (player && currentSong) player.seekTo(currentSong?.start, true);
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

      <PlayerMain>
        <div className="left">
          <span>
            {currentSong?.name}
            <br />
            {currentSong?.channel.english_name || currentSong?.channel.name}
          </span>
        </div>
        <div className="center">
          <IconButton
            aria-label="Play"
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            variant="outline"
            onClick={togglePlay}
          />
        </div>
        <div className="right">
          <span></span>
        </div>
      </PlayerMain>
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
    width: 400px;
    height: 225px;
    position: absolute;
    bottom: 90px;
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

const PlayerMain = styled.div`
  padding: 0px 20px;
  display: flex;
  /* flex: 1; */
  /* justify-content: center; */
  width: 100%;

  .left > span {
    margin-right: auto;
  }
  .right > span {
    margin-left: auto;
  }
  .left,
  .right,
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
  }
`;
