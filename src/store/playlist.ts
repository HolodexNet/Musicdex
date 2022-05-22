import { action, Action } from "easy-peasy";

export interface PlaylistModel {
  createDialogShow: boolean;
  addDialogShow: boolean;
  songToAdd?: Song[] | Song;

  showPlaylistCreateDialog: Action<PlaylistModel, void>;
  clearPlaylistCreateDialog: Action<PlaylistModel, void>;
  showPlaylistAddDialog: Action<PlaylistModel, Song[] | Song>;
  clearPlaylistAddDialog: Action<PlaylistModel, void>;
}

const playlistModel: PlaylistModel = {
  createDialogShow: false,
  addDialogShow: false,
  songToAdd: undefined,

  showPlaylistCreateDialog: action((state) => {
    state.createDialogShow = true;
  }),
  clearPlaylistCreateDialog: action((state) => {
    state.createDialogShow = false;
  }),

  showPlaylistAddDialog: action((state, song) => {
    state.addDialogShow = true;
    state.songToAdd = song;
  }),
  clearPlaylistAddDialog: action((state) => {
    state.addDialogShow = false;
    state.songToAdd = undefined;
  }),
};

export default playlistModel;
