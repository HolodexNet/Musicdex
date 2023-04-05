import { useCallback, useEffect, useState, useContext, useMemo } from "react";
import YouTube from "react-youtube";
import { useStoreState } from "../../store";
import { PlayerContext } from "../layout/Frame";

export function YoutubePlayer() {
  const [_, setPlayer] = useContext(PlayerContext);

  return (
    <YouTube
      className="yt-player"
      iframeClassName="yt-player"
      opts={{
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
      }}
      onReady={(e) => setPlayer(e.target)}
      loading="lazy"
    />
  );
}

const VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;

export function getID(url: string | undefined) {
  return url?.match(VideoIDRegex)?.[2] || "";
}

export function usePlayer() {
  const [player] = useContext(PlayerContext);
  // const [status, setStatus] =
  //   useState<Partial<typeof INITIALSTATE>>(INITIALSTATE);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideo, setCurrentVideo] = useState("");
  const [volume, setVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState(-1);
  const [hasError, setError] = useState(false);
  const errorHandler = useCallback((e: any) => {
    console.warn("PLAYER ERROR OCCURRED", e);
    setError(true);
  }, []);

  useEffect(() => {
    if (player) {
      player.addEventListener("onError", errorHandler);
    }
    return () => {
      player?.removeEventListener("onError", errorHandler);
    };
  }, [errorHandler, player]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player) {
      timer = setInterval(async () => {
        if (player) {
          setCurrentTime(await player.getCurrentTime());
          setDuration(await player.getDuration());
          setCurrentVideo(getID(await player.getVideoUrl()));
          setState(await player.getPlayerState());
          setVolume(await player.getVolume());
          setMuted(await player.isMuted());
        }
      }, 333);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player]);

  return {
    muted,
    duration,
    currentTime,
    currentVideo,
    state,
    volume,
    setError,
    hasError,
  };
}

export const usePlayerStats = () => {
  const { currentTime } = usePlayer();
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song,
  );

  const totalDuration = useMemo(
    () => (currentSong ? currentSong.end - currentSong.start : 0),
    [currentSong],
  );

  const progress =
    (((currentTime || 0) - (currentSong?.start ?? 0)) * 100) /
    (totalDuration || 1);

  return {
    totalDuration,
    progress,
  };
};
