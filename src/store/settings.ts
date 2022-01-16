import { Action, action } from "easy-peasy";

export type SelectedPosition =
  | "hover-top"
  | "hover-bottom"
  | "background"
  | "sidebar"
  // | "full-player"
  | "hidden";
export interface SettingsStore {
  //leveraging context menu for drag drop
  useEN: boolean;
  setUseEN: Action<SettingsStore, boolean>;

  selectedPosition: SelectedPosition;
  setSelectedPosition: Action<SettingsStore, SelectedPosition>;
}

const userLanguage =
  navigator.language || (navigator as any).userLanguage || "en";

const englishNamePrefs = ["en", "es", "fr", "id", "pt", "de", "ru", "it"];

// DND State Management
export const settingsStore: SettingsStore = {
  selectedPosition: "hover-top",
  setSelectedPosition: action((state, newloc) => {
    state.selectedPosition = newloc;
  }),

  useEN: englishNamePrefs.find((x) => userLanguage.includes(x)) ? true : false,
  setUseEN: action((state, y) => {
    state.useEN = y;
  }),
};
