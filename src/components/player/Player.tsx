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
import React, { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaExpand,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState, useStoreActions } from "../../store";
import throttle from "lodash-es/throttle";
import { PlayerOverlay } from "./PlayerOverlay";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";

export function Player() {
  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );
  const currentSong = useMemo(() => currentlyPlaying.song, [currentlyPlaying]);
  const repeat = useMemo(() => currentlyPlaying.repeat, [currentlyPlaying]);

  // PlayerState
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playerState, setPlayerState] = useState(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  const next = useStoreActions((actions) => actions.playback.next);
  const previous = useStoreActions((actions) => actions.playback.previous);

  const shuffleMode = useStoreState((state) => state.playback.shuffleMode);
  const toggleShuffleMode = useStoreActions(
    (actions) => actions.playback.toggleShuffle
  );

  const repeatMode = useStoreState((state) => state.playback.repeatMode);
  const toggleRepeatMode = useStoreActions(
    (actions) => actions.playback.toggleRepeat
  );

  function RepeatIcon() {
    switch (repeatMode) {
      case "repeat":
        return <MdRepeat size={24} />;
      case "repeat-one":
        return <MdRepeatOne size={24} />;
      default:
        return <MdRepeat size={24} color="grey" />;
    }
  }
  function ShuffleIcon() {
    return <MdShuffle size={24} color={shuffleMode ? "" : "grey"} />;
  }
  useEffect(() => {
    if (player && currentSong) {
      try {
        player.seekTo(currentSong.start, true);
      } catch (e) {
        console.log("uh oh");
        console.error(e);
      }
    }
  }, [currentSong, repeat, player]);

  useEffect(() => {
    if (playerState === 1 || playerState === 2) setIsPlaying(playerState === 1);
  }, [playerState]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player && currentSong) {
      timer = setInterval(() => {
        const s = player.getCurrentTime();
        // Make sure player stays in bound
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
    <React.Fragment>
      <Container visible={true} expanded={isExpanded}>
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
              aria-label="Previous Song"
              icon={<FaStepBackward />}
              variant="ghost"
              onClick={() => {
                previous();
              }}
            />
            <IconButton
              aria-label="Play"
              icon={isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              variant="ghost"
              onClick={togglePlay}
            />
            <IconButton
              aria-label="Next Song"
              icon={<FaStepForward />}
              variant="ghost"
              onClick={() => next({ count: 1, userSkipped: true })}
            />
          </div>
          <div className="right">
            <span>
              <IconButton
                aria-label="Shuffle"
                icon={<ShuffleIcon />}
                variant="ghost"
                onClick={() => toggleShuffleMode()}
                size="lg"
              />
              <IconButton
                aria-label="Shuffle"
                icon={<RepeatIcon />}
                variant="ghost"
                onClick={() => toggleRepeatMode()}
                size="lg"
              />
              <IconButton
                aria-label="Expand"
                icon={isExpanded ? <FaChevronDown /> : <FaChevronUp />}
                variant="ghost"
                onClick={toggleExpanded}
              />
            </span>
          </div>
        </PlayerMain>
      </Container>

      <PlayerOverlay visible={isExpanded}></PlayerOverlay>
    </React.Fragment>
  );
}

const Container = styled.div<{ visible: boolean; expanded: boolean }>`
  width: 100%;
  /* height: ${({ expanded }) => (expanded ? "100%" : "80px")}; */
  height: 80px;
  flex-basis: 1;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease-out;
  background: #1c1c1c;
  /* overflow: hidden; */
  flex-direction: row;
  display: flex;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  z-index: 10;

  .yt-container {
    width: 400px;
    height: 225px;
    position: absolute;
    bottom: 90px;
    z-index: 10;
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
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;

  .left > span {
    margin-right: auto;
    padding-left: 20px;
  }
  .right > span {
    margin-left: auto;
    padding-right: 20px;
  }
  .left,
  .right,
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
