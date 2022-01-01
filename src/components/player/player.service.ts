// API Player as a service

import { UseQueryOptions, useQuery, useMutation } from "react-query";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { YouTubePlayer } from "youtube-player/dist/types";

interface PlayerStatus {
  error?: string;
  currentTime: number;
  duration: number;
  currentVideo: string;
  state: PlayerStates;
  volume: number;
  muted: boolean;
}
var VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

function getID(url: string) {
  return url.match(VideoIDRegex)?.[2] || "";
}
export const usePlayerState = (
  player: YouTubePlayer | null,
  enabled: boolean
) => {
  return useQuery(
    "player-status",
    async () => {
      if (!player)
        return {
          error: "no player",
          currentTime: 0,
          duration: 0,
          currentVideo: "",
          state: 0,
          volume: 75,
          muted: false,
        };

      return {
        currentTime: player.getCurrentTime(),
        duration: player.getDuration(),
        currentVideo: getID(player.getVideoUrl()),
        state: player.getPlayerState(),
        volume: player.getVolume(),
        muted: player.isMuted(),
      } as PlayerStatus;
    },
    {
      refetchInterval: 200,
      refetchIntervalInBackground: true,
      enabled,
    }
  );
};

export const usePlayerMutateChangeVideo = (player: YouTubePlayer | null) => {
  return useMutation(
    ["videoChange"],
    async ({ id, start, ts }: { id: string; start: number; ts: number }) => {
      // ts is to provide a timestamp for when javascript gets suspended in the background. if a ts is too far back, we ignore it.
      if (Date.now() - ts > 3000)
        return { error: "too old, probably okay to ignore" };
      if (!player) return { error: "No Player" };
      // attempt to mutate:
      const currentId = getID(player.getVideoUrl());
      if (currentId !== id) {
        // if it's the wrong video, load it.
        player.loadVideoById(id, start);
        throw new Error("wrong vid");
      }
      if (Math.abs(player.getCurrentTime() - start) > 2.0) {
        // if the time is wrong, seek to the right time.
        player.seekTo(start, true);
        throw new Error("wrong time");
      }
      if (
        player.getPlayerState() !== PlayerStates.PLAYING &&
        player.getPlayerState() !== PlayerStates.BUFFERING
      ) {
        // if it's not playing, play it.
        // player.seekTo(start, true);
        player.playVideoAt(start);
        throw new Error(
          "wrong state" + player.getPlayerState() + "!=" + PlayerStates.PLAYING
        );
      }
      return {
        currentTime: player.getCurrentTime(),
        duration: player.getDuration(),
        currentVideo: getID(player.getVideoUrl()),
        state: player.getPlayerState(),
        volume: player.getVolume(),
        muted: player.isMuted(),
      } as PlayerStatus;
    },
    {
      retry: 5,
      retryDelay: 250,
      onError() {},
    }
  );
};
