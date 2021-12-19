import { StatHelpText } from "@chakra-ui/react";
import {
  action,
  Action,
  computed,
  Computed,
  thunk,
  Thunk,
  useStoreActions,
} from "easy-peasy";

export interface PlaybackModel {
  queue: Song[]; // a high priority queue of song. This plays 'next'.
  _queueAdd: Action<PlaybackModel, Song[]>;
  _queueClear: Action<PlaybackModel, void>;

  playlistQueue: Song[]; // a queue that is fed by the playlist.
  playlistQueue2: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;
  _setPlaylist: Action<PlaybackModel, PlaylistFull>;
  _shufflePlaylist: Action<PlaybackModel, void>; // specifically if you want to shuffle again... probably not a public.

  shuffleMode: boolean;
  _setShuffleMode: Action<PlaybackModel, boolean>;
  repeatMode: "none" | "repeat" | "repeat-one";

  currentlyPlaying: {
    from: "queue" | "playlist" | "none";
    song?: Song;
    repeat: number;
  };

  // setting the shuffle / repeat.
  toggleShuffle: Thunk<PlaybackModel, void>;
  toggleRepeat: Action<PlaybackModel, void>;

  // advances song, if user clicked a queue spot, advance by that #.
  // nextSong: Action<PlaybackModel, number>;
  _ejectCurrentlyPlaying: Action<PlaybackModel, void>;
  _insertCurrentlyPlaying: Action<
    PlaybackModel,
    "playlist" | "queue" | "repeat-one"
  >;
  _forceInsertCurrentlyPlaying: Action<PlaybackModel, Song>;
  _detachCurrentlyPlayingToQueue: Action<PlaybackModel, void>;
  // queues songs up into the queue.
  queueSongs: Thunk<PlaybackModel, { songs: Song[]; immediatelyPlay: boolean }>;
  // adds a playlist into the queue
  setPlaylist: Thunk<
    PlaybackModel,
    { playlist: PlaylistFull; immediatelyPlay: boolean }
  >;
  // shuffles everything, always keeping the current playing.
  next: Thunk<PlaybackModel, { count: number; isSkip: boolean }>;
}

const playbackModel: PlaybackModel = {
  currentlyPlaying: {
    from: "queue",
    song: undefined,
    repeat: 0,
  },

  queue: [],
  _queueAdd: action((state, songs) => {
    state.queue.push(...songs);
  }),
  _queueClear: action((state) => {
    state.queue = [];
  }),

  playlistQueue: [],
  playlistQueue2: [],
  currentPlaylist: undefined,
  _setPlaylist: action((state, playlist) => {
    state.currentPlaylist = playlist;
    if (state.shuffleMode) {
      state.playlistQueue = (playlist.content || [])
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    } else {
      state.playlistQueue = [...(playlist.content || [])];
    }
    state.playlistQueue2 = [];
  }),
  _shufflePlaylist: action((state) => {
    const mq = state.currentPlaylist?.content || [];
    // filter out the currently playing song if it's from said playlist (otherwise shuffle the whole playlist)
    const nq =
      state.currentlyPlaying.from === "playlist"
        ? mq.filter((x) => x.id !== state.currentlyPlaying.song?.id)
        : mq;
    // shuffle the rest.
    state.playlistQueue = nq
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    state.playlistQueue2 = [];
  }),

  shuffleMode: false,
  _setShuffleMode: action((state, b) => {
    state.shuffleMode = b;
  }),
  repeatMode: "none",

  toggleShuffle: thunk((actions, _, helpers) => {
    const shuf = !helpers.getState().shuffleMode;
    actions._setShuffleMode(shuf);
    if (shuf && helpers.getState().currentPlaylist) {
      actions._shufflePlaylist();
    }
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

  _ejectCurrentlyPlaying: action((state) => {
    if (state.repeatMode !== "repeat-one") {
      if (state.repeatMode === "repeat") {
        // if it's repeat, then:
        if (
          state.currentlyPlaying.from === "playlist" &&
          state.currentlyPlaying.song
        ) {
          if (state.shuffleMode) {
            state.playlistQueue2.push(state.currentlyPlaying.song);
          } else {
            state.playlistQueue.push(state.currentlyPlaying.song);
          }
        }
      } // if it's not repeat, then just get rid of the currently playing thing.
      state.currentlyPlaying.from = "none";
      state.currentlyPlaying.song = undefined;
      state.currentlyPlaying.repeat = Math.floor(Math.random() * 1000);
    }
    // decline to eject if repeat-one, since you just want to play the current one again..
  }),

  _insertCurrentlyPlaying: action((state, src) => {
    if (src === "repeat-one") {
      state.currentlyPlaying.repeat++;
    } else if (src === "queue") {
      state.currentlyPlaying.from = "queue";
      state.currentlyPlaying.song = state.queue.shift();
      state.currentlyPlaying.repeat++;
    } else if (src === "playlist") {
      state.currentlyPlaying.from = "playlist";
      state.currentlyPlaying.song = state.playlistQueue.shift();
      state.currentlyPlaying.repeat++;

      if (state.playlistQueue.length === 0) {
        state.playlistQueue = state.playlistQueue2;
        state.playlistQueue2 = [];
      }
    }
  }),

  _forceInsertCurrentlyPlaying: action((state, song) => {
    state.currentlyPlaying.from = "queue";
    state.currentlyPlaying.song = song;
    state.currentlyPlaying.repeat++;
  }),

  _detachCurrentlyPlayingToQueue: action((state) => {
    if (state.currentlyPlaying.song) state.currentlyPlaying.from = "queue";
  }),

  queueSongs: thunk((actions, { songs, immediatelyPlay }, h) => {
    if (songs.length === 0) return;
    if (immediatelyPlay) {
      // songs should be singular.
      actions._forceInsertCurrentlyPlaying(songs[0]);
    } else {
      actions._queueAdd(songs);
      if (!h.getState().currentlyPlaying.song) {
        // if nothing is playing, start playing something.
        actions._insertCurrentlyPlaying("queue");
      }
    }
  }),

  setPlaylist: thunk((actions, { playlist, immediatelyPlay }, h) => {
    actions._setPlaylist(playlist);
    if (h.getState().currentlyPlaying.from === "playlist") {
      actions._detachCurrentlyPlayingToQueue();
    }
    if (immediatelyPlay) {
      actions._queueClear();
      actions._ejectCurrentlyPlaying();
      actions._insertCurrentlyPlaying("playlist");
    }
  }),

  next: thunk((actions, { count, isSkip }, h) => {
    if (isSkip) {
      let isRepeatOne = false;
      if (h.getState().repeatMode === "repeat-one") {
        isRepeatOne = true;
        actions.toggleRepeat();
      }
      while (count > 0) {
        actions._ejectCurrentlyPlaying();
        const src =
          h.getState().queue.length > 0
            ? "queue"
            : h.getState().playlistQueue.length > 0
            ? "playlist"
            : undefined;
        if (src) actions._insertCurrentlyPlaying(src);
        count--;
      }
      if (isRepeatOne) {
        actions.toggleRepeat();
        actions.toggleRepeat();
      }
    } else {
      actions._ejectCurrentlyPlaying();
      const src =
        h.getState().repeatMode === "repeat-one"
          ? "repeat-one"
          : h.getState().queue.length > 0
          ? "queue"
          : h.getState().playlistQueue.length > 0
          ? "playlist"
          : undefined;
      if (src) actions._insertCurrentlyPlaying(src);
    }
  }),
};

export default playbackModel;
