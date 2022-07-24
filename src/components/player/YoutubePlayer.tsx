import { useCallback, useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";

export function YoutubePlayer({
  onReady,
}: {
  onReady: YouTubeProps["onReady"];
}) {
  return (
    <YouTube
      className="yt-player"
      iframeClassName="yt-player"
      opts={{
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          // autoplay: 0,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
      }}
      onReady={onReady}
      loading="lazy"
    />
  );
}

const VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;

export function getID(url: string | undefined) {
  return url?.match(VideoIDRegex)?.[2] || "";
}

export function usePlayer(player: YouTubePlayer | null) {
  // const [status, setStatus] =
  //   useState<Partial<typeof INITIALSTATE>>(INITIALSTATE);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideo, setCurrentVideo] = useState("");
  const [volume, setVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState(0);
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
