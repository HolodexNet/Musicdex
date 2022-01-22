import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";

export function YoutubePlayer({
  onReady,
}: {
  onReady: (event: { target: YouTubePlayer }) => void;
}) {
  return (
    <YouTube
      containerClassName="yt-player"
      className="yt-player"
      videoId={""}
      opts={{
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          // autoplay: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
        },
      }}
      onReady={onReady}
    />
  );
}
const INITIALSTATE = {
  currentTime: 0,
  duration: 0,
  currentVideo: "",
  state: 0,
  volume: 0,
  muted: false,
};

const VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;

export function getID(url: string | undefined) {
  return url?.match(VideoIDRegex)?.[2] || "";
}

function getPlayerStatus(player: YouTubePlayer) {
  return {
    currentTime: player.getCurrentTime(),
    duration: player.getDuration(),
    currentVideo: getID(player.getVideoUrl()),
    state: player.getPlayerState(),
    volume: player.getVolume(),
    muted: player.isMuted(),
  };
}

export function usePlayer(player?: YouTubePlayer) {
  const [status, setStatus] =
    useState<Partial<typeof INITIALSTATE>>(INITIALSTATE);
  const [hasError, setError] = useState(false);
  const errorHandler = useCallback((e: any) => {
    console.warn("PLAYER ERROR ORCCURED", e);
    setError(true);
  }, []);

  useEffect(() => {
    if (player) {
      player.addEventListener("onError", errorHandler);
    }
    return () => player?.removeEventListener("onError", errorHandler);
  }, [errorHandler, player]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player) {
      timer = setInterval(() => {
        if (player) setStatus(getPlayerStatus(player));
        else setStatus({});
      }, 333);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player]);

  return {
    ...status,
    setError,
    hasError,
  };
}
