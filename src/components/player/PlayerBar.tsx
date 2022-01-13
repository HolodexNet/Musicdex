import { Box, Text, toast, useToast, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { SongInfo } from "./controls/PlayerSongInfo";
import { PlaybackControl } from "./controls/PlaybackControl";
import { PlayerOption } from "./controls/PlayerOption";
import { VolumeSlider } from "./controls/VolumeSlider";
import { TimeSlider } from "./controls/TimeSlider";
import { usePlayer } from "./YoutubePlayer";

export function PlayerBar({
  isExpanded,
  toggleExpanded,
  player,
}: {
  isExpanded: boolean;
  toggleExpanded: () => void;
  player: YouTubePlayer | undefined;
}) {
  const toast = useToast();

  // Current song
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  const repeat = useStoreState(
    (state) => state.playback.currentlyPlaying.repeat
  );
  const next = useStoreActions((actions) => actions.playback.next);

  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong]
  );

  const { currentVideo, state, currentTime, setError, hasError, volume } =
    usePlayer(player);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeSlider, setVolumeSlider] = useState(0);

  useEffect(() => {
    setVolumeSlider(volume ?? 0);
  }, [volume]);
  // Player State Event
  useEffect(() => {
    console.log("player changed state", state);
    if (state === PlayerStates.BUFFERING || state === PlayerStates.PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [state]);

  // Sanity video id check event
  useEffect(() => {
    console.log(
      "player changed video",
      currentSong?.video_id,
      currentVideo,
      currentVideo !== currentSong?.video_id
    );
    if (
      player &&
      currentSong?.video_id &&
      currentVideo !== currentSong?.video_id
    ) {
      player?.loadVideoById({
        videoId: currentSong.video_id,
        startSeconds: currentSong.start,
      });
      setError(false);
    }
  }, [
    player,
    currentVideo,
    currentSong?.video_id,
    currentSong?.start,
    setError,
  ]);

  // CurrentSong/repeat update event
  useEffect(() => {
    if (!player) return;
    if (currentSong) {
      player.loadVideoById({
        videoId: currentSong.video_id,
        startSeconds: currentSong.start,
      });
      setError(false);
    } else {
      player?.loadVideoById("");
      setProgress(0);
    }
  }, [player, currentSong, repeat, setError]);

  // CurrentTime Event
  useEffect(() => {
    if (
      currentTime === undefined ||
      currentSong === undefined ||
      currentSong.video_id !== currentVideo
    ) {
      return setProgress(0);
    }

    setProgress(
      ((currentTime - currentSong.start) * 100) /
        (currentSong.end - currentSong.start)
    );
  }, [currentSong, currentTime, currentVideo]);

  // End Progress Event
  useEffect(() => {
    if (!player || !currentSong || currentTime === undefined) return;
    if (currentSong.video_id !== currentVideo) {
      return;
    }
    // Proceeed to next song
    if (progress >= 100) {
      setProgress(0);
      console.log("going next...");
      next({ count: 1, userSkipped: false });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, isPlaying, currentSong, currentVideo, next, progress]);

  // Error Event Effect
  useEffect(() => {
    if (hasError && currentSong) {
      console.log(
        "SKIPPING____ DUE TO VIDEO PLAYBACK FAILURE (maybe the video is blocked in your country)"
      );
      toast({
        position: "top-right",
        status: "warning",
        title: `The Song: ${currentSong?.name} is not playable. Skipping it.`,
        duration: 10000,
      });
      next({ count: 1, userSkipped: false, hasError: true });
      setError(false);
    }
  }, [hasError, currentSong]);

  function onChange(e: any) {
    if (!currentSong) return;
    setProgress(e);
    player?.seekTo(currentSong.start + (e / 100) * totalDuration, true);
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
      <TimeSlider
        progress={progress}
        onChange={onChange}
        totalDuration={totalDuration}
      />
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
          volume: volumeSlider,
          onVolumeChange: (e) => {
            player?.setVolume(e);
            setVolumeSlider(e);
          },
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
  z-index: 10;

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
  volume,
  onVolumeChange,
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
  volume: number;
  onVolumeChange: (e: number) => void;
  totalDuration: number;
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  return (
    <PlayerMain>
      <div className="left">
        <span>{currentSong && <SongInfo song={currentSong} />}</span>
      </div>
      <div className="center">
        <PlaybackControl isPlaying={isPlaying} togglePlay={togglePlay} />
      </div>
      <div className="right">
        <Box width={36} display="inline-block" mr={2}>
          <VStack spacing={-1}>
            <VolumeSlider volume={volume} onChange={onVolumeChange} />
            <Text fontSize=".85em" display="inline-block" opacity={0.5}>
              <span>{seconds}</span> /{" "}
              <span>{formatSeconds(totalDuration)}</span>
            </Text>
          </VStack>
        </Box>
        <PlayerOption isExpanded={isExpanded} toggleExpanded={toggleExpanded} />
      </div>
    </PlayerMain>
  );
}
const MemoizedPlayerBarLower = React.memo(PlayerBarLower);
