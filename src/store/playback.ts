import { action, Action, thunk, Thunk } from "easy-peasy";

interface SongPlayback {
  from: "queue" | "playlist" | "none";
  song?: Song;
  repeat: number;
}
export interface PlaybackModel {
  // ==== Currently Playing. It is separate from queue and playlistQueue.
  currentlyPlaying: SongPlayback;

  // ==== Queue and Queue Mutators
  queue: Song[]; // a high priority queue of song. This plays 'next'.

  _queueAdd: Action<PlaybackModel, Song[]>;
  _queueClear: Action<PlaybackModel, void>;
  _queueShuffle: Action<PlaybackModel, void>;

  // ===== Playlist and Playlist Mutators:
  playlistQueue: Song[]; // a queue that is fed by the playlist.
  playedPlaylistQueue: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;

  _setPlaylist: Action<PlaybackModel, PlaylistFull>;
  _shufflePlaylist: Action<PlaybackModel, void>; // specifically if you want to shuffle again... probably not a public.

  // ==== History:
  history: SongPlayback[];
  addSongToHistory: Action<PlaybackModel, SongPlayback>;

  // ==== Playback Mode:
  shuffleMode: boolean;
  repeatMode: "none" | "repeat" | "repeat-one";

  // setting the shuffle / repeat.
  toggleShuffle: Thunk<PlaybackModel, void>;
  _setShuffleMode: Action<PlaybackModel, boolean>;
  toggleRepeat: Action<PlaybackModel, void>;
  _setRepeatMode: Action<PlaybackModel, "none" | "repeat" | "repeat-one">;

  // ==== Lifecycle:
  // Ejects the currently playing song and puts it somewhere appropriate / throws it out.
  _ejectCurrentlyPlaying: Action<PlaybackModel, void>;

  // Eject without setting currently play
  _prepareEject: Action<PlaybackModel, void>;
  _undoEject: Action<PlaybackModel, void>;
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
  _queueShuffle: action((state) => {
    state.queue = shuffleArray(state.queue || []);
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
    state.playedPlaylistQueue = [];
  }),

  history: [],
  addSongToHistory: action((state, s) => {
    state.history = state.history.filter(
      (x) => x.song && s.song && x.song.id !== s.song.id
    );
    state.history.unshift(s);
    if (state.history.length > 100) {
      state.history.pop();
    }
  }),

  shuffleMode: false,
  _setShuffleMode: action((state, b) => {
    state.shuffleMode = b;
  }),
  repeatMode: "none",
  _setRepeatMode: action((state, b) => {
    state.repeatMode = b;
  }),

  toggleShuffle: thunk((actions, _, helpers) => {
    const shuf = !helpers.getState().shuffleMode;
    actions._setShuffleMode(shuf);
    const currentPlaylist = helpers.getState().currentPlaylist;
    if (shuf && currentPlaylist) {
      actions._shufflePlaylist();
    } else if (!shuf && currentPlaylist) {
      actions._setPlaylist(currentPlaylist);
    }

    if (shuf && helpers.getState().queue) {
      actions._queueShuffle();
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
    const s = state.currentlyPlaying;
    if (s.song) {
      // Add to history
      state.history = state.history.filter(
        (x) => x.song && s.song && x.song.id !== s.song.id
      );
      state.history.unshift({ ...s });
      // Trim history
      if (state.history.length > 100) {
        state.history.pop();
      }

      // Add to play queue if needed
      if (state.currentlyPlaying.from === "playlist") {
        state.playedPlaylistQueue.push(s.song);
      } else if (
        state.currentlyPlaying.from === "queue" &&
        state.repeatMode === "repeat"
      ) {
        state.queue.push(s.song);
      }
    }

    state.currentlyPlaying.from = "none";
    state.currentlyPlaying.song = undefined;
    state.currentlyPlaying.repeat = Math.floor(Math.random() * 1000);
    // decline to eject if repeat-one, since you just want to play the current one again..
  }),

  // Update history/playedPlaylistQueue without setting currentlyPlaying
  // Each executed action will cause a rerender of playerBar, so for one frame the currentsong will be undefined
  _prepareEject: action((state) => {
    const s = state.currentlyPlaying;
    // console.log("prepare eject", JSON.stringify(s));
    if (s.song) {
      // Add to history
      state.history = state.history.filter(
        (x) => x.song && s.song && x.song.id !== s.song.id
      );
      state.history.unshift({ ...s });
      // Trim history
      while (state.history.length > 100) {
        state.history.pop();
      }

      // Add to play queue if needed (repeat mode is on)
      // console.log(state.repeatMode);
      if (state.repeatMode === "repeat") {
        if (s.from === "playlist") {
          state.playedPlaylistQueue.push(s.song);
        } else if (
          state.currentlyPlaying.from === "queue" &&
          state.repeatMode === "repeat"
        ) {
          state.queue.push(s.song);
        }
      }
    }
  }),

  _undoEject: action((state) => {
    const playback = state.history.shift();
    if (!playback) return;

    // Put the current song where it belongs
    if (state.currentlyPlaying.song) {
      if (state.currentlyPlaying.from === "queue") {
        state.queue.unshift(state.currentlyPlaying.song);
      } else if (state.currentlyPlaying.from === "playlist") {
        state.playlistQueue.unshift(state.currentlyPlaying.song);
      }
    }

    // Clean up the playedPlaylistQueue... is it needed?
    if (playback?.from === "playlist") {
      state.playedPlaylistQueue.pop();
    }

    // Play the last song
    state.currentlyPlaying = {
      ...playback,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),

  _insertCurrentlyPlaying: action((state, src) => {
    if (state.repeatMode === "repeat-one") {
      state.currentlyPlaying.repeat++;
    } else {
      if (src === "queue") {
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
    }
    // console.log(debug(state.playlistQueue), debug(state.playedPlaylistQueue))
    // console.log("next: now playing", state.currentlyPlaying.song?.name);
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
    state.history = [];
    state.queue = [];
    state.playlistQueue = [];
    state.playedPlaylistQueue = [];
    state.currentlyPlaying = {
      from: "none",
      song: undefined,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),

  queueSongs: thunk((actions, { songs, immediatelyPlay }, h) => {
    // console.log(songs);
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
    actions._ejectCurrentlyPlaying();
    actions.clearAll();
    actions._setPlaylist(playlist);
    actions._insertCurrentlyPlaying("playlist");
  }),

  next: thunk((actions, { count, userSkipped }, h) => {
    // User initiated skip, ignore repeat-one mode
    let oldRepeatMode = h.getState().repeatMode;
    if (userSkipped) {
      actions._setRepeatMode(oldRepeatMode === "none" ? "none" : "repeat");
    }
    while (count > 0) {
      const hasQ = h.getState().queue.length > 0;
      const hasPlaylist =
        h.getState().playlistQueue.length +
          h.getState().playedPlaylistQueue.length >
        0;
      const isRepeatOne = h.getState().repeatMode === "repeat-one";
      const src = hasQ
        ? "queue"
        : hasPlaylist
        ? "playlist"
        : isRepeatOne
        ? "repeat-one"
        : undefined;
      // console.log("considering next song from", src);
      if (src) {
        actions._prepareEject();
        actions._insertCurrentlyPlaying(src);
      } else {
        actions._ejectCurrentlyPlaying();
      }

      // if (
      //   h.getState().playlistQueue.length === 0 &&
      //   h.getState().repeatMode === "repeat"
      // ) {
      //   const playlist = h.getState().currentPlaylist;
      //   playlist && actions.setPlaylist({ playlist });
      // }
      count--;
    }
    if (userSkipped) {
      actions._setRepeatMode(oldRepeatMode);
    }
  }),

  previous: thunk((actions, opt, h) => {
    // const prevPlayback = h.getState().history[0];
    actions._undoEject();
  }),
};

export default playbackModel;
