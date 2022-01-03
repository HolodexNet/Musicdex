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
  useToast,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { FiVolume1 } from "react-icons/fi";
import { MdRepeat, MdRepeatOne, MdShuffle } from "react-icons/md";
import { NavLink } from "react-router-dom";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { SongArtwork } from "../song/SongArtwork";
import { ChangePlayerLocationButton } from "./ChangePlayerLocationButton";

var VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

function getID(url: string | undefined) {
  return url?.match(VideoIDRegex)?.[2] || "";
}

function changeVideo(
  player: YouTubePlayer | undefined,
  args: {
    id: string;
    start: number;
    ts: number;
    success: () => void;
    err: (reason: string) => void;
  },
  attempt = 1
) {
  // ts is to provide a timestamp for when javascript gets suspended in the background. if a ts is too far back, we ignore it.
  const { id, start, ts } = args;
  if (!player) return args.success();
  // console.log("changing video layer");
  if (attempt > 5) return args.err("too many tries");
  // attempt to mutate:
  const currentId = getID(player.getVideoUrl());
  const playerState = player.getPlayerState();
  if (currentId !== id) {
    // if it's the wrong video, load it.
    player.loadVideoById(id, start);
    return setTimeout(() => {
      changeVideo(player, args, attempt + 1);
    }, 500);
  }
  if (Date.now() - ts > 5000) {
    if (
      playerState === PlayerStates.PLAYING ||
      playerState === PlayerStates.PAUSED ||
      playerState === PlayerStates.BUFFERING
    ) {
      return args.success();
    } else {
      return args.err("took too long");
    }
  }
  // console.log("seeking", player.getCurrentTime(), start);

  if (Math.abs(player.getCurrentTime() - start) > 5.0) {
    // if the time is wrong, seek to the right time.
    // console.log("seeking");
    player.seekTo(start, true);
    return setTimeout(() => {
      changeVideo(player, args, attempt + 1);
    }, 500);
  }
  if (
    playerState !== PlayerStates.PLAYING &&
    playerState !== PlayerStates.PAUSED &&
    playerState !== PlayerStates.BUFFERING
  ) {
    // if it's not playing, play it.
    // player.seekTo(start, true);
    player.playVideoAt(start);
    return setTimeout(() => {
      changeVideo(player, args, attempt + 1);
    }, 500);
  }
  return args.success();
}

const INITIALSTATE = {
  currentTime: 0,
  duration: 0,
  currentVideo: "",
  state: 0,
  volume: 0,
  muted: false,
};

export function PlayerBar({
  isExpanded,
  toggleExpanded,
  player,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
  player: YouTubePlayer | undefined;
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

  const hasError = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [status, setStatus] =
    useState<Partial<typeof INITIALSTATE>>(INITIALSTATE);

  const hasErrorCb = useCallback((err: boolean) => {
    console.log("has error: ", err);
    hasError.current = err;
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player && currentSong) {
      timer = setInterval(
        () => {
          if (player)
            setStatus({
              currentTime: player.getCurrentTime(),
              duration: player.getDuration(),
              currentVideo: getID(player.getVideoUrl()),
              state: player.getPlayerState(),
              volume: player.getVolume(),
              muted: player.isMuted(),
            });
          else setStatus({});
        },
        isPlaying ? 333 : 2000
      );
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player, currentSong, isPlaying]);

  const playerState = useMemo(() => status?.state, [status]);
  const toast = useToast();

  const [hovering, setHovering] = useState(false);

  const next = useStoreActions((actions) => actions.playback.next);

  const nextSongWhenPlaybackErr = (err: string) => {
    // console.error(
    //   err,
    //   getID(player?.getVideoUrl()),
    //   (window as any).currentSong,
    //   player?.getPlayerState(),
    //   hasError.current
    // );
    if (
      getID(player?.getVideoUrl()) === (window as any).currentSong && // using videoID here is a bit sus, but since VIDEOS break and not SONGS, it should be fine.
      player?.getPlayerState() === -1 &&
      hasError.current && //currently in error state.
      isPlaying
    ) {
      console.log(
        "SKIPPING____ DUE TO VIDEO PLAYBACK FAILURE (maybe the video is blocked in your country)"
      );
      toast({
        position: "top-right",
        status: "warning",
        title: `The Song: ${currentSong?.name} is not playable. Skipping it.`,
        duration: 10000,
      });
      (window as any).player = player;
      // Video is failing to play: auto skip.
      next({ count: 1, userSkipped: false, hasError: true });
    }
  };

  // Set start time when song/repeat/player changes
  useEffect(() => {
    if (
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
    // console.log("check if song over effect");
    (window as any).currentSong = currentSong?.video_id;

    const playerTime = status.currentTime;
    if (!player || !currentSong || playerTime === undefined) return;

    // Sync isPlaying state
    if ((playerState === 1 && !isPlaying) || (playerState === 2 && isPlaying)) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }

    if (currentSong.video_id !== status?.currentVideo) {
      return;
    }
    // Proceeed to next song
    // console.log("t", playerTime, player.getDuration());
    if (
      progress >= 100 ||
      (playerTime >= player.getDuration() - 2 && playerTime > 0)
    ) {
      console.log("finish", progress, playerTime);
      setProgress(0);
      next({ count: 1, userSkipped: false });
      return;
    }
  }, [
    player,
    isPlaying,
    currentSong,
    status.currentTime,
    status?.currentVideo,
    playerState,
    next,
  ]);

  useEffect(() => {
    // console.log("song & repeat effect");
    if (status?.currentTime === undefined || currentSong === undefined) {
      changeVideo(player, {
        id: "",
        start: 0,
        ts: Date.now(),
        err: (err) => console.log("expected err, got err"),
        success: () => hasErrorCb(false),
      });
      return;
    }
    changeVideo(player, {
      id: currentSong.video_id,
      start: currentSong.start,
      ts: Date.now(),
      err: nextSongWhenPlaybackErr,
      success: () => hasErrorCb(false),
    });
    setProgress(0);
  }, [currentSong, repeat]);

  const calledOnce = useRef(false);
  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (player && currentSong) {
      (window as any).hasErrorCb = hasErrorCb;
      player.addEventListener("onError", "hasErrorCb" as any);
      changeVideo(player, {
        id: currentSong?.video_id,
        start: currentSong.start,
        ts: Date.now(),
        err: nextSongWhenPlaybackErr,
        success: () => hasErrorCb(false),
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
    changeVideo(player, {
      id: currentSong.video_id,
      start: currentSong.start + (e / 100) * totalDuration,
      ts: Date.now(),
      err: nextSongWhenPlaybackErr,
      success: () => hasErrorCb(false),
    });
    setProgress(e);
  }

  const seconds = useMemo(() => {
    return formatSeconds((progress / 100) * totalDuration);
  }, [progress, totalDuration]);

  function togglePlay() {
    if (player) isPlaying ? player.pauseVideo() : player.playVideo();

    setIsPlaying((prev) => !prev);
  }

  return (
    <PlayerContainer>
      <Slider
        defaultValue={0}
        step={0.1}
        min={0}
        max={100}
        value={progress}
        itemID="main-slider"
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
          label={<span>{seconds}</span>}
        >
          <SliderThumb visibility={hovering ? "visible" : "hidden"} />
        </Tooltip>
      </Slider>
      <MemoizedPlayerBarLower
        {...{
          currentSong,
          isPlaying,
          togglePlay,
          next,
          player,
          seconds,
          totalDuration,
          isExpanded,
          toggleExpanded,
        }}
      />
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
  z-index: 15;

  > .chakra-slider {
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
  z-index: 15;

  .left > span {
    margin-right: auto;
    padding-left: 20px;
  }
  .left,
  .right,
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    justify-content: flex-end;
    margin-left: auto;
    padding-right: 12px;
  }
`;
function PlayerBarLower({
  currentSong,
  isPlaying,
  togglePlay,
  next,
  player,
  seconds,
  totalDuration,
  isExpanded,
  toggleExpanded,
}: {
  currentSong: Song | undefined;
  isPlaying: boolean;
  togglePlay: () => void;
  next: (x: any) => void;
  player: YouTubePlayer | undefined;
  seconds: string;
  totalDuration: number;
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  const previous = useStoreActions((actions) => actions.playback.previous);

  const shuffleMode = useStoreState((state) => state.playback.shuffleMode);
  const toggleShuffleMode = useStoreActions(
    (actions) => actions.playback.toggleShuffle
  );

  const repeatMode = useStoreState((state) => state.playback.repeatMode);
  const toggleRepeatMode = useStoreActions(
    (actions) => actions.playback.toggleRepeat
  );

  return (
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
        <Box width={36} display="inline-block" mr={2}>
          <VStack spacing={-1}>
            <Slider
              aria-label="slider-ex-4"
              defaultValue={80}
              onChange={(e) => {
                player?.setVolume(e);
              }}
            >
              <SliderTrack bg="red.50">
                <SliderFilledTrack
                  background={`linear-gradient(to right, var(--chakra-colors-brand-400), var(--chakra-colors-n2-400))`}
                />
              </SliderTrack>
              <SliderThumb boxSize={5}>
                <Box color="brand.400" as={FiVolume1} />
              </SliderThumb>
            </Slider>
            <Text
              color="whiteAlpha.600"
              fontSize=".85em"
              display="inline-block"
            >
              <span>{seconds}</span> /{" "}
              <span>{formatSeconds(totalDuration)}</span>
            </Text>
          </VStack>
        </Box>
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
      </div>
    </PlayerMain>
  );
}
const MemoizedPlayerBarLower = React.memo(PlayerBarLower);

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
