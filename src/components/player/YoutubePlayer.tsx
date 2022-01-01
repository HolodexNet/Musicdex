import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";

export function YoutubePlayer(
  onReady: (event: { target: YouTubePlayer }) => void
) {
  return (
    <YouTube
      containerClassName="yt-player"
      className="yt-player"
      videoId={""}
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
    />
  );
}
