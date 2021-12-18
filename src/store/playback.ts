import {
  action,
  Action,
  computed,
  Computed,
  useStoreActions,
} from "easy-peasy";

export interface PlaybackModel {
  queue: Song[]; // a high priority queue of song. This plays 'next'.
  playlistQueue: Song[]; // a queue that is fed by the playlist.
  playlistQueue2: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;

  shuffleMode: boolean;
  repeatMode: "none" | "repeat" | "repeat-one";
  isRepeatOne: boolean;

  // the current song at the top of the queue.
  currentlyPlaying: Computed<PlaybackModel, Song | undefined>;

  // setting the shuffle / repeat.
  toggleShuffle: Action<PlaybackModel, null>;
  toggleRepeat: Action<PlaybackModel, null>;

  // advances song, if user clicked a queue spot, advance by that #.
  nextSong: Action<PlaybackModel, number>;

  // queues songs up into the queue.
  queueSongs: Action<PlaybackModel, Song[]>;
  // sets a playlist into the queue
  setPlaylist: Action<PlaybackModel, PlaylistFull>;
  // shuffles everything, optionally keeping first playlistQueue item.
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
