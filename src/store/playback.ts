import {
  action,
  Action,
  computed,
  Computed,
  useStoreActions,
} from "easy-peasy";

export interface PlaybackModel {
  queue: Song[];
  playlistQueue: Song[];
  playlistQueue2: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;

  shuffleMode: boolean;
  repeatMode: "none" | "repeat" | "repeat-one";
  isRepeatOne: boolean;

  currentlyPlaying: Computed<PlaybackModel, Song | undefined>;

  toggleShuffle: Action<PlaybackModel, null>;
  toggleRepeat: Action<PlaybackModel, null>;

  nextSong: Action<PlaybackModel, number>;

  queueSongs: Action<PlaybackModel, Song[]>;
  setPlaylist: Action<PlaybackModel, PlaylistFull>;
  shufflePlaylist: Action<PlaybackModel, boolean>;
}

const playbackModel: PlaybackModel = {
  queue: [],
  playlistQueue: [],
  playlistQueue2: [],
  currentPlaylist: undefined,

  shuffleMode: false,
  repeatMode: "none",
  isRepeatOne: false,

  currentlyPlaying: computed((state) => {
    return state.queue.at(0) || state.playlistQueue.at(0);
  }),

  toggleShuffle: action((state) => {
    state.shuffleMode = !state.shuffleMode;
  }),
  toggleRepeat: action((state) => {
    switch (state.repeatMode) {
      case "none":
        state.repeatMode = "repeat";
        return;
      case "repeat":
        state.repeatMode = "repeat-one";
        return;
      case "repeat-one":
        state.repeatMode = "none";
        return;
    }
  }),

  // TODO: how do you play the same song twice?
  nextSong: action((state, count) => {
    while (state.queue.length > 0 && count > 0) {
      state.queue.shift();
      count--;
    }
    while (state.playlistQueue.length > 0 && count > 0) {
      const pop = state.playlistQueue.shift();
      if (!pop) break; //undefined?
      count--;
      if (state.repeatMode === "repeat" || state.repeatMode === "repeat-one") {
        if (state.shuffleMode) {
          state.playlistQueue2.push(pop);
        } else {
          state.playlistQueue.push(pop);
        }
      }
    }
    while (state.playlistQueue2.length > 0 && count > 0) {
      const pop = state.playlistQueue2.shift();
      if (!pop) break; //undefined?
      count--;
      if (state.repeatMode === "repeat" || state.repeatMode === "repeat-one") {
        state.playlistQueue2.push(pop);
      }
    }
    if (state.playlistQueue.length === 0 && state.playlistQueue2.length > 0) {
      state.playlistQueue = state.playlistQueue2;
      state.playlistQueue2 = [];
    }
  }),

  queueSongs: action((state, songs) => {
    state.queue.unshift(...songs);
  }),

  setPlaylist: action((state, playlist) => {
    state.currentPlaylist = playlist;
    if (state.shuffleMode) {
      state.playlistQueue = (playlist.content || [])
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    } else {
      state.playlistQueue = [...(playlist.content || [])];
    }
  }),

  shufflePlaylist: action((state, preserveFirst) => {
    if (!preserveFirst || state.playlistQueue.length === 0) {
      state.playlistQueue = (state.currentPlaylist?.content || [])
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      state.playlistQueue2 = [];
    } else {
      const [p1, ...pmore] = state.playlistQueue;
      pmore.push(...state.playlistQueue2);
      const shuffled = pmore
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      state.playlistQueue = [p1, ...shuffled];
      state.playlistQueue2 = [];
    }
  }),
};

export default playbackModel;
