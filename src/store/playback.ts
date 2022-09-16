import axios from "axios";
import { action, Action, thunk, Thunk, ThunkOn, thunkOn } from "easy-peasy";
import { StoreModel } from ".";
import { shuffle } from "lodash-es";

enum SRC {
  RADIO = "radio",
  NONE = "none",
  QUEUE = "queue",
  PLAYLIST = "playlist",
}

interface SongPlayback {
  from: SRC;
  song?: Song;
  repeat: number;
}

export interface PlaybackModel {
  // ==== Currently Playing. It is separate from queue and playlistQueue.
  currentlyPlaying: SongPlayback;
  isPlaying: boolean;
  setIsPlaying: Action<PlaybackModel, boolean>;

  // ==== Queue and Queue Mutators
  queue: Song[]; // a high priority queue of song. This plays 'next'.

  _queueAdd: Action<PlaybackModel, Song[]>;
  _queueClear: Action<PlaybackModel, void>;
  _queueShuffle: Action<PlaybackModel, void>;
  queueRemove: Action<PlaybackModel, number>;
  queueReverse: Action<PlaybackModel, void>;
  // ===== Playlist and Playlist Mutators:
  playlistQueue: Song[]; // a queue that is fed by the playlist.
  playedPlaylistQueue: Song[]; // a backup queue for songs ONLY if Shuffle + Repeat
  currentPlaylist?: PlaylistFull;

  _setPlaylist: Action<PlaybackModel, PlaylistFull | undefined>;
  _shufflePlaylist: Action<PlaybackModel, void>; // specifically if you want to shuffle again... probably not a public.
  reversePlaylist: Action<PlaybackModel, void>;
  _extendPlaylist: Action<PlaybackModel, { radio: PlaylistFull | undefined }>; // appends new data from playlist (idk if needed) / radio (currently impl) into current Queue.
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
    Omit<SRC, "none"> | "repeat-one"
  >;
  // Forcibly insert a song into now playing.
  _forceInsertCurrentlyPlaying: Action<PlaybackModel, Song>;
  // If the currently playing is from = 'playlist', this fn modifies from = 'queue' instead.
  _detachCurrentlyPlayingToQueue: Action<PlaybackModel, void>;

  // ==== Public Methods:
  // queues songs up into the queue. specifically the queue, in fact.
  queueSongs: Thunk<PlaybackModel, { songs: Song[]; immediatelyPlay: boolean }>;
  // adds a playlist into the queue
  setPlaylist: Thunk<
    PlaybackModel,
    { playlist: PlaylistFull; startPos?: number }
  >;
  // for pressing NEXT or pressing a item on up-next.
  next: Thunk<
    PlaybackModel,
    { count: number; userSkipped: boolean; hasError?: boolean }
  >;
  maintainRadio: ThunkOn<PlaybackModel, undefined, StoreModel>;

  // for going Back one song
  previous: Thunk<PlaybackModel>;

  clearAll: Action<PlaybackModel>;
  clearPlaylist: Action<PlaybackModel>;
}

const playbackModel: PlaybackModel = {
  currentlyPlaying: {
    from: SRC.QUEUE,
    song: undefined,
    repeat: 0,
  },

  isPlaying: false,
  setIsPlaying: action((state, payload) => {
    state.isPlaying = payload;
  }),

  queue: [],
  _queueAdd: action((state, songs) => {
    const goodSongs = songs.filter((x) => x.id && x.video_id);
    state.queue.push(...goodSongs);
  }),
  _queueClear: action((state) => {
    state.queue = [];
  }),
  _queueShuffle: action((state) => {
    state.queue = shuffle(state.queue || []);
  }),
  queueRemove: action((state, idx) => {
    const x = [...state.queue.slice(0, idx), ...state.queue.slice(idx + 1)];
    state.queue = x;
  }),
  queueReverse: action((state) => {
    state.queue = state.queue.reverse();
  }),

  playlistQueue: [],
  playedPlaylistQueue: [],
  currentPlaylist: undefined,
  _setPlaylist: action((state, playlist) => {
    state.currentPlaylist = playlist;
    if (state.shuffleMode && playlist) {
      state.playlistQueue = shuffle([...(playlist?.content || [])]);
    } else {
      state.playlistQueue = [...(playlist?.content || [])];
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
    state.playlistQueue = shuffle(nq);
    state.playedPlaylistQueue = [];
  }),
  reversePlaylist: action((state) => {
    state.playlistQueue = state.playlistQueue.reverse();
  }),
  _extendPlaylist: action((state, { radio }) => {
    // with radio extension we want to avoid adding duplicates.
    const next = state.playlistQueue.map((x) => x.id);
    const relativelyNew =
      radio?.content?.filter((x) => !next.includes(x.id)) || [];
    state.playlistQueue.push(...relativelyNew);
    state.playedPlaylistQueue = []; // just in case idk.
  }),

  history: [],
  addSongToHistory: action((state, s) => {
    state.history = state.history.filter(
      (x) => x.song && s.song && x.song.id !== s.song.id,
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
    const shuffleMode = !helpers.getState().shuffleMode;
    actions._setShuffleMode(shuffleMode);
    const currentPlaylist = helpers.getState().currentPlaylist;
    if (currentPlaylist && currentPlaylist.type.startsWith("playlist")) {
      if (shuffleMode) {
        actions._shufflePlaylist();
      } else if (!shuffleMode) {
        actions._setPlaylist(currentPlaylist);
      }
    } else if (currentPlaylist && currentPlaylist.type.startsWith("radio")) {
      // actions._shuffleRadio(); - if we want to enable it we should shuffle radio.
    }

    if (shuffleMode && helpers.getState().queue) {
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
      default:
        state.repeatMode = "none";
        return;
    }
  }),

  _ejectCurrentlyPlaying: action((state) => {
    const s = state.currentlyPlaying;
    if (s.song) {
      // Add to history
      state.history = state.history.filter(
        (x) => x.song && s.song && x.song.id !== s.song.id,
      );
      state.history.unshift({ ...s });
      // Trim history
      while (state.history.length > 100) {
        state.history.pop();
      }

      // Add to play queue if needed
      if (state.currentlyPlaying.from === SRC.PLAYLIST) {
        state.playedPlaylistQueue.push(s.song);
      } else if (
        state.currentlyPlaying.from === SRC.QUEUE &&
        state.repeatMode === "repeat" &&
        state.playlistQueue.length + state.playedPlaylistQueue.length === 0
      ) {
        state.queue.push(s.song);
      }
    }

    state.currentlyPlaying.from = SRC.NONE;
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
        (x) => x.song && s.song && x.song.id !== s.song.id,
      );
      state.history.unshift({ ...s });
      // Trim history
      while (state.history.length > 100) {
        state.history.pop();
      }

      // Add to play queue if needed (repeat mode is on)
      // console.log(state.repeatMode);
      if (state.repeatMode === "repeat") {
        if (s.from === SRC.PLAYLIST) {
          state.playedPlaylistQueue.push(s.song);
        }
      }
    }
  }),

  _undoEject: action((state) => {
    const playback = state.history.shift();
    if (!playback) return;

    // Put the current song where it belongs
    if (state.currentlyPlaying.song) {
      if (state.currentlyPlaying.from === SRC.QUEUE) {
        state.queue.unshift(state.currentlyPlaying.song);
      } else if (state.currentlyPlaying.from === SRC.PLAYLIST) {
        state.playlistQueue.unshift(state.currentlyPlaying.song);
      }
      // and if it's a radio, it's discarded i guess
    }

    // Clean up the playedPlaylistQueue... is it needed?
    if (playback?.from === SRC.PLAYLIST) {
      state.playedPlaylistQueue.pop();
    }

    // Play the last song
    state.currentlyPlaying = {
      ...playback,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),

  _insertCurrentlyPlaying: action((state, src) => {
    if (state.repeatMode === "repeat-one" || src === "repeat-one") {
      state.currentlyPlaying.repeat++;
    } else {
      if (src === SRC.QUEUE) {
        state.currentlyPlaying.from = SRC.QUEUE;
        state.currentlyPlaying.song = state.queue.shift();
        state.currentlyPlaying.repeat++;
      } else if (src === SRC.PLAYLIST) {
        if (state.playlistQueue.length === 0) {
          state.playlistQueue = state.playedPlaylistQueue;
          state.playedPlaylistQueue = [];
        }
        state.currentlyPlaying.from = SRC.PLAYLIST;
        state.currentlyPlaying.song = state.playlistQueue.shift();
        state.currentlyPlaying.repeat++;
      } else if (src === SRC.RADIO) {
        // never use playedPlaylistQueue for radio.
        state.currentlyPlaying.from = SRC.RADIO;
        state.currentlyPlaying.song = state.playlistQueue.shift();
        state.currentlyPlaying.repeat++;
      }
    }
  }),

  _forceInsertCurrentlyPlaying: action((state, song) => {
    state.currentlyPlaying = {
      from: SRC.QUEUE,
      song,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),

  _detachCurrentlyPlayingToQueue: action((state) => {
    if (state.currentlyPlaying.song) state.currentlyPlaying.from = SRC.QUEUE;
  }),

  clearAll: action((state) => {
    state.history = [];
    state.queue = [];
    state.playlistQueue = [];
    state.currentPlaylist = undefined;
    state.playedPlaylistQueue = [];
    state.currentlyPlaying = {
      from: SRC.NONE,
      song: undefined,
      repeat: state.currentlyPlaying.repeat + 1,
    };
  }),
  clearPlaylist: action((state) => {
    state.playlistQueue = [];
    state.playedPlaylistQueue = [];
    state.currentPlaylist = undefined;
    if (state.currentlyPlaying.from !== SRC.NONE) {
      // if there's something playing, then it's coming from queue.
      state.currentlyPlaying.from = SRC.QUEUE;
    }
  }),

  queueSongs: thunk(async (actions, { songs, immediatelyPlay }, h) => {
    if (songs.length === 0 || !songs[0]) return 0;
    if (immediatelyPlay) {
      // songs should be singular.
      if (songs && songs.length === 0) {
        console.error(
          "Tried to enqueue empty song array with immediatePlay : true. This doesn't make sense.",
        );
        return { err: "Songs being queued should not be empty" };
      }
      actions._forceInsertCurrentlyPlaying(songs[0]);
      return 1;
    } else {
      actions._queueAdd(songs);

      if (!h.getState().currentlyPlaying.song) {
        // if nothing is playing, start playing something.
        actions._insertCurrentlyPlaying(SRC.QUEUE);
      }
      return songs.length;
    }
  }),

  setPlaylist: thunk((actions, { playlist, startPos }, h) => {
    actions._ejectCurrentlyPlaying();
    actions.clearPlaylist();

    if (playlist.type.startsWith("radio")) {
      // assume startPos doesn't exist?
      // unset shuffle (or maybe turn off canShuffle)
      actions._setShuffleMode(false);
      // set radio to current playlist
      actions._setPlaylist(playlist);
      // unset repeat if on repeat-all (or turn off canRepeatAll)
      if (h.getState().repeatMode === "repeat") actions._setRepeatMode("none");

      actions._insertCurrentlyPlaying(SRC.RADIO);
    } else {
      if (startPos === undefined) {
        actions._setPlaylist(playlist);
        actions._insertCurrentlyPlaying(SRC.PLAYLIST);
      } else {
        const oldShuffleMode = h.getState().shuffleMode;
        actions._setShuffleMode(false);
        actions._setPlaylist(playlist);
        actions._insertCurrentlyPlaying(SRC.PLAYLIST);
        while (startPos > 0) {
          actions._prepareEject();
          actions._insertCurrentlyPlaying(SRC.PLAYLIST);
          startPos--;
        }
        actions._setShuffleMode(oldShuffleMode);
      }
    }
  }),

  next: thunk((actions, { count, userSkipped, hasError = false }, h) => {
    // User initiated skip, ignore repeat-one mode
    let oldRepeatMode = h.getState().repeatMode;
    if (userSkipped) {
      actions._setRepeatMode(oldRepeatMode === "none" ? "none" : "repeat");
    }
    if (hasError) {
      actions._setRepeatMode("none");
    }
    while (count > 0) {
      const hasQ = h.getState().queue.length > 0;
      const hasPlaylist =
        h.getState().playlistQueue.length +
          h.getState().playedPlaylistQueue.length >
        0;
      const isRepeatOne = h.getState().repeatMode === "repeat-one";
      const playlistIsRadio = h
        .getState()
        .currentPlaylist?.type.startsWith("radio");
      // next function prioritizes Queue over Playlist.

      let src: "queue" | "playlist" | "repeat-one" | "radio" | undefined;
      if (hasQ) {
        src = "queue";
      } else {
        if (hasPlaylist) {
          src = playlistIsRadio ? "radio" : "playlist";
        } else if (isRepeatOne) src = "repeat-one";
      }

      // console.log("considering next song from", src);
      if (src) {
        actions._prepareEject();
        actions._insertCurrentlyPlaying(src);
      } else {
        actions._ejectCurrentlyPlaying();
      }
      count--;
    }

    if (userSkipped) {
      actions._setRepeatMode(oldRepeatMode);
    }
  }),

  maintainRadio: thunkOn(
    (action) => action.next,
    (actions, tgt, h) => {
      // check it's a radio:
      const currentPlaylist = h.getState().currentPlaylist;
      if (
        currentPlaylist?.type.startsWith("radio") &&
        h.getState().playlistQueue.length < 5
      ) {
        axios
          .get<PlaylistFull>(`/musicdex/radio/${currentPlaylist.id}`, {
            baseURL: BASE_URL,
            headers: h.getStoreState().auth.authHeader,
          })
          .then((resp) => {
            actions._extendPlaylist({ radio: resp.data });
          });
      }
    },
  ),

  previous: thunk((actions, opt, h) => {
    // const prevPlayback = h.getState().history[0];
    actions._undoEject();
  }),
};

const BASE_URL = `${window.location.protocol}//${window.location.host}/api/v2`;

export default playbackModel;
