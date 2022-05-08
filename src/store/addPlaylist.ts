import { action, Action } from "easy-peasy";

export interface AddPlaylistModel {
  dialogShow: boolean;
  songToAdd?: Song[] | Song;

  showPlaylistAddDialog: Action<AddPlaylistModel, Song[] | Song>;
  clearPlaylistAddDialog: Action<AddPlaylistModel, void>;
}

const addPlaylistModel: AddPlaylistModel = {
  dialogShow: false,
  songToAdd: undefined,

  showPlaylistAddDialog: action((state, song) => {
    state.dialogShow = true;
    state.songToAdd = song;
  }),
  clearPlaylistAddDialog: action((state) => {
    state.dialogShow = false;
    state.songToAdd = undefined;
  }),
};

export default addPlaylistModel;
