import {
  Box,
  HStack,
  IconButton,
  Link,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { SongArtwork } from "../song/SongArtwork";
import { ChangePlayerLocationButton } from "./ChangePlayerLocationButton";
import { usePlayerMutateChangeVideo, usePlayerState } from "./player.service";

export function PlayerBar({
  isExpanded,
  toggleExpanded,
  player,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
  player: YouTubePlayer | null;
}) {
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

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    mutateAsync: changeVideo,
    isLoading,
    isError: videoChangeError,
  } = usePlayerMutateChangeVideo(player);
  const {
    data: status,
    isRefetching,
    isSuccess,
  } = usePlayerState(player, !isLoading);

  const playerState = useMemo(() => status?.state, [status]);

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

  // Set start time when song/repeat/player changes
  useEffect(() => {
    if (
      status?.error ||
      status?.currentTime === undefined ||
      currentSong === undefined ||
      currentSong.video_id !== status.currentVideo
    )
      return setProgress(0);

    setProgress(
      ((status.currentTime - currentSong.start) * 100) /
        (currentSong.end - currentSong.start)
    );
  }, [currentSong, player, status, totalDuration]);

  /**
   * Sync player state with internal values
   */
  useEffect(() => {
    if (!player || !currentSong || !status || status.error) return;
    const playerTime = status.currentTime;

    // Sync isPlaying state
    if ((playerState === 1 && !isPlaying) || (playerState === 2 && isPlaying)) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }

    if (currentSong.video_id !== status?.currentVideo) {
      return;
    }
    // Proceeed to next song
    if (
      progress >= 100 ||
      (playerTime >= player.getDuration() - 1 && playerTime > 0)
    ) {
      console.log("finish", progress, playerTime);
      setProgress(0);
      next({ count: 1, userSkipped: false });
      return;
    }
  }, [
    player,
    isPlaying,
    progress,
    currentSong,
    playerState,
    next,
    status?.currentVideo,
  ]);

  useEffect(() => {
    if (
      status?.error ||
      status?.currentTime === undefined ||
      currentSong === undefined
    ) {
      changeVideo({
        id: "",
        start: 0,
        ts: Date.now(),
      });
      return;
    }
    changeVideo({
      id: currentSong.video_id,
      start: currentSong.start,
      ts: Date.now(),
    });
    setProgress(0);
  }, [currentSong, repeat]);

  const calledOnce = useRef(false);
  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (player && currentSong) {
      changeVideo({
        id: currentSong?.video_id,
        start: currentSong.start,
        ts: Date.now(),
      });

      calledOnce.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, currentSong]);

  // function onStateChange(e: { data: number }) {
  //   setPlayerState(e.data);
  // }
  // controls

  function onChange(e: any) {
    if (!currentSong) return;
    if (!isPlaying) setIsPlaying(true);
    changeVideo({
      id: currentSong.video_id,
      start: currentSong.start + (e / 100) * totalDuration,
      ts: Date.now(),
    });
    setProgress(e);
  }

  const ElapsedLabel = useMemo(() => {
    return <span>{formatSeconds((progress / 100) * totalDuration)}</span>;
  }, [progress, totalDuration]);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const [refLoc, setLoc] = useState<HTMLDivElement>();

  function togglePlay() {
    if (player) isPlaying ? player.pauseVideo() : player.playVideo();

    setIsPlaying((prev) => !prev);
    setLoc(Math.random() > 0.5 ? ref1.current! : ref2.current!);
  }

  return (
    <PlayerContainer>
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
          label={ElapsedLabel}
        >
          <SliderThumb visibility={hovering ? "visible" : "hidden"} />
        </Tooltip>
      </Slider>
      <PlayerMain>
        <div className="left">
          <span>
            {!!currentSong && (
              <HStack>
                <SongArtwork song={currentSong} size={50} marginRight={2} />
                <Box>
                  <Link as={NavLink} to={`/song/${currentSong.id}`}>
                    <Text fontWeight={500} noOfLines={1}>
                      {currentSong.name}
                    </Text>
                  </Link>
                  <Link as={NavLink} to={`/`}>
                    <Text noOfLines={1} color="whiteAlpha.600">
                      {currentSong.channel.english_name ||
                        currentSong.channel.name}
                    </Text>
                  </Link>
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
            <Text
              color="whiteAlpha.600"
              fontSize=".85em"
              display="inline-block"
            >
              {ElapsedLabel} / <span>{formatSeconds(totalDuration)}</span>
            </Text>
            <IconButton
              aria-label="Shuffle"
              icon={ShuffleIcon(shuffleMode)}
              variant="ghost"
              onClick={() => toggleShuffleMode()}
              size="lg"
            />
            <IconButton
              aria-label="Shuffle"
              icon={RepeatIcon(repeatMode)}
              variant="ghost"
              onClick={() => toggleRepeatMode()}
              size="lg"
            />
            <ChangePlayerLocationButton />

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
    max-width: 100%;
    height: 225px;
    position: absolute;
    bottom: 90px;
    z-index: 10;
  }
  .yt-container2 {
    width: 400px;
    max-width: 100%;
    height: 225px;
    position: absolute;
    bottom: 90px;
    right: 30px;
    z-index: 10;
  }

  .chakra-slider {
    position: fixed !important;
    margin-top: -3px;
    width: 100%;
  }
`;

const PlayerMain = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 5px;
  /* flex-direction: column; */

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
function RepeatIcon(repeatMode: string) {
  switch (repeatMode) {
    case "repeat":
      return <MdRepeat size={24} />;
    case "repeat-one":
      return <MdRepeatOne size={24} />;
    default:
      return <MdRepeat size={24} color="grey" />;
  }
}

function ShuffleIcon(shuffleMode: boolean) {
  return <MdShuffle size={24} color={shuffleMode ? "" : "grey"} />;
}
