import { StatHelpText } from "@chakra-ui/react";
import { action, Action, thunk, Thunk } from "easy-peasy";

export interface PlaybackModel {
  // ==== Currently Playing. It is separate from queue and playlistQueue.
  currentlyPlaying: {
    from: "queue" | "playlist" | "none";
    song?: Song;
    repeat: number;
  };

  // ==== Queue and Queue Mutators
  queue: Song[]; // a high priority queue of song. This plays 'next'.

  _queueAdd: Action<PlaybackModel, Song[]>;
  _queueClear: Action<PlaybackModel, void>;

  // ===== Playlist and Playlist Mutators:
  playlistQueue: Song[]; // a queue that is fed by the playlist.
  playedPlaylistQueue: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;

  _setPlaylist: Action<PlaybackModel, PlaylistFull>;
  _shufflePlaylist: Action<PlaybackModel, void>; // specifically if you want to shuffle again... probably not a public.

  // ==== History:
  history: Song[];
  addSongToHistory: Action<PlaybackModel, Song>;
  deleteIndexFromHistory: Action<PlaybackModel, number>;

  // ==== Playback Mode:
  shuffleMode: boolean;
  repeatMode: "none" | "repeat" | "repeat-one";

  // setting the shuffle / repeat.
  toggleShuffle: Thunk<PlaybackModel, void>;
  _setShuffleMode: Action<PlaybackModel, boolean>;
  toggleRepeat: Action<PlaybackModel, void>;

  // ==== Lifecycle:
  // Ejects the currently playing song and puts it somewhere appropriate / throws it out.
  _ejectCurrentlyPlaying: Action<PlaybackModel, void>;
  // Adds a new song to now playing.
  _insertCurrentlyPlaying: Action<
    PlaybackModel,
    "playlist" | "queue" | "repeat-one"
  >;
  // Forcibly insert a song into now playing.
  _forceInsertCurrentlyPlaying: Action<PlaybackModel, Song>;
  // If the currently playing is from = 'playlist', this fn modifies from = 'queue' instead.
  _detachCurrentlyPlayingToQueue: Action<PlaybackModel, void>;

  // ==== Public Methods:
  // queues songs up into the queue.
  queueSongs: Thunk<PlaybackModel, { songs: Song[]; immediatelyPlay: boolean }>;
  // adds a playlist into the queue
  setPlaylist: Thunk<PlaybackModel, { playlist: PlaylistFull }>;
  // for pressing NEXT or pressing a item on up-next.
  next: Thunk<PlaybackModel, { count: number; userSkipped: boolean }>;

  // for going Back one song
  previous: Thunk<PlaybackModel>;

  clearAll: Action<PlaybackModel>;
}

function shuffleArray(arr: Array<any>) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
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
  playedPlaylistQueue: [],
  currentPlaylist: undefined,
  _setPlaylist: action((state, playlist) => {
    state.currentPlaylist = playlist;
    if (state.shuffleMode) {
      state.playlistQueue = shuffleArray(playlist.content || []);
    } else {
      state.playlistQueue = [...(playlist.content || [])];
    }
    state.playedPlaylistQueue = [];
  }),
  _shufflePlaylist: action((state) => {
    const mq = state.currentPlaylist?.content || [];
    // filter out the currently playing song if it's from said playlist (otherwise shuffle the whole playlist)
    const nq =
      state.currentlyPlaying.from === "playlist"
        ? mq.filter((x) => x.id !== state.currentlyPlaying.song?.id)
        : mq;
    // shuffle the rest.
    state.playlistQueue = shuffleArray(nq);
    // state.playedPlaylistQueue = [];
  }),

  history: [],
  addSongToHistory: action((state, s) => {
    state.history = state.history.filter((x) => x.id !== s.id);
    state.history.unshift(s);
    if (state.history.length > 100) {
      state.history.pop();
    }
  }),

  deleteIndexFromHistory: action((state, idx) => {
    state.history.splice(1, 0);
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
      } // if it's not repeat, then just get rid of the currently playing thing.
      // if (state.currentlyPlaying.song) {
      //   if(state.currentlyPlaying.from === "playlist"){
      //     state.playedPlaylistQueue.push(state.currentlyPlaying.song);
      //   }
      // }
    }
    state.currentlyPlaying.from = "none";
    state.currentlyPlaying.song = undefined;
    state.currentlyPlaying.repeat = Math.floor(Math.random() * 1000);
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
      if (state.playlistQueue.length === 0) {
        state.playlistQueue = state.playedPlaylistQueue;
        state.playedPlaylistQueue = [];
      }
      state.currentlyPlaying.from = "playlist";
      state.currentlyPlaying.song = state.playlistQueue.shift();
      state.currentlyPlaying.repeat++;
    }
  }),

  _forceInsertCurrentlyPlaying: action((state, song) => {
    state.currentlyPlaying = {
      from: "queue",
      song,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),

  _detachCurrentlyPlayingToQueue: action((state) => {
    if (state.currentlyPlaying.song) state.currentlyPlaying.from = "queue";
  }),

  clearAll: action((state) => {
    state.queue = [];
    state.playlistQueue = [];
    state.playedPlaylistQueue = [];
  }),

  queueSongs: thunk((actions, { songs, immediatelyPlay }, h) => {
    console.log(songs);
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

  setPlaylist: thunk((actions, { playlist }, h) => {
    actions._queueClear();
    actions._ejectCurrentlyPlaying();
    actions._setPlaylist(playlist);
    actions._insertCurrentlyPlaying("playlist");
    // if (h.getState().currentlyPlaying.from === "playlist") {
    //   actions._detachCurrentlyPlayingToQueue();
    // }
    // if (immediatelyPlay) {
    //   actions._queueClear();
    //   actions._ejectCurrentlyPlaying();
    //   actions._insertCurrentlyPlaying("playlist");
    // }
  }),

  next: thunk((actions, { count, userSkipped }, h) => {
    // User initiated skip, ignore repeat-one mode
    if (userSkipped) {
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

  previous: thunk((actions, opt, h) => {
    const prevSong = h.getState().history[0];
    actions.deleteIndexFromHistory(0);
  }),
};

export default playbackModel;
