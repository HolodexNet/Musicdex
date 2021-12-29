import {
  Flex,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  Text,
  HStack,
  Box,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState, useStoreActions } from "../../store";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { SongArtwork } from "../song/SongArtwork";

export function PlayerBar() {
  // Current song
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  const repeat = useStoreState(
    (state) => state.playback.currentlyPlaying.repeat
  );
  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong]
  );

  // PlayerState
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playerState, setPlayerState] = useState(-1);
  const buffering = useMemo(() => playerState === 3, [playerState]);

  // Internal state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);

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

  const isExpanded = useStoreState((state) => state.player.isExpanded);
  const toggleExpanded = useStoreActions(
    (actions) => actions.player.toggledExpanded
  );

  // Set start time when song/repeat/player changes
  useEffect(() => {
    setProgress(0);
  }, [currentSong, repeat, player]);

  /**
   * Internal timer to increment progress if playing
   */
  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    // Increase progress by 200ms if it fufills the conditions
    if (player && currentSong && isPlaying && !buffering) {
      timer = setInterval(() => {
        setProgress((prev) => {
          // const s = ((prev/100) * totalDuration);
          // return (((s + .2) / totalDuration) * 100);
          return prev + (0.2 * 100) / totalDuration;
        });
      }, 200);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player, currentSong, isPlaying, totalDuration, buffering]);

  /**
   * Sync player state with internal values
   */
  const SYNC_THRESHOLD_SECONDS = 0.5;
  useEffect(() => {
    if (!player || !currentSong) return;
    const playerTime = player.getCurrentTime();
    const expectedTime = currentSong.start + (progress / 100) * totalDuration;

    // Sync progress with player time, when it desyncs by a threshold
    if (Math.abs(playerTime - expectedTime) > SYNC_THRESHOLD_SECONDS) {
      player.seekTo(expectedTime, true);
    }

    // Sync isPlaying state
    if ((playerState === 1 && !isPlaying) || (playerState === 2 && isPlaying)) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }

    // Proceeed to next song
    if (progress >= 100) {
      setProgress(0);
      next({ count: 1, userSkipped: false });
      return;
    }
  }, [
    player,
    isPlaying,
    progress,
    totalDuration,
    currentSong,
    playerState,
    next,
  ]);

  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  function onStateChange(e: { data: number }) {
    setPlayerState(e.data);
  }
  // controls
  function togglePlay() {
    if (player) isPlaying ? player.pauseVideo() : player.playVideo();
    setIsPlaying((prev) => !prev);
  }

  function onChange(e: any) {
    setProgress(e);
  }

  function SliderLabel() {
    return <span>{`${Math.round((progress / 100) * totalDuration)}s`}</span>;
  }

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

  return (
    <PlayerContainer>
      <Flex
        className="yt-container"
        visibility={currentSong ? "visible" : "hidden"}
      >
        <YouTube
          className="yt-player"
          videoId={currentSong?.video_id}
          opts={{
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 0,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </Flex>

      <Slider
        defaultValue={0}
        step={0.1}
        min={0}
        max={100}
        value={progress}
        className="progress-slider"
        colorScheme="blue"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onChange={onChange}
      >
        <SliderTrack height={hovering ? "10px" : "6px"}>
          <SliderFilledTrack
            background={`linear-gradient(to right, var(--chakra-colors-brand-400), var(--chakra-colors-n2-400))`}
          />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={hovering}
          label={<SliderLabel />}
        >
          <SliderThumb visibility={hovering ? "visible" : "hidden"} />
        </Tooltip>
      </Slider>
      <PlayerMain>
        <div className="left">
          <span>
            {!!currentSong && (
              <HStack>
                <SongArtwork song={currentSong} size={70} marginRight={2} />
                <Box>
                  <Text noOfLines={1}>{currentSong.name}</Text>
                  <Text noOfLines={1} color="whiteAlpha.600">
                    {currentSong.channel.english_name ||
                      currentSong.channel.name}
                  </Text>
                </Box>
              </HStack>
            )}
          </span>
        </div>
        <div className="center">
          <IconButton
            aria-label="Previous Song"
            icon={<FaStepBackward />}
            variant="ghost"
            onClick={() => previous()}
          />
          <IconButton
            size="lg"
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
              onClick={() => toggleExpanded()}
            />
          </span>
        </div>
      </PlayerMain>
    </PlayerContainer>
  );
}

const PlayerContainer = styled.div`
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
  z-index: 10;

  .yt-container {
    width: 400px;
    height: 225px;
    position: absolute;
    bottom: 90px;
    z-index: 10;
  }

  .yt-container * {
    width: 100%;
    height: 100%;
  }

  .progress-slider,
  .chakra-slider {
    position: absolute !important;
    top: -3px;
    width: 100%;
    overflow: hidden;
  }
`;

const PlayerMain = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  padding-top: 5px;

  .left > span {
    margin-right: auto;
    padding-left: 20px;
    margin-top: auto;
    bottom: 0px;
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
