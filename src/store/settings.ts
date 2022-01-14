import { Action, action } from "easy-peasy";

export interface SettingsStore {
  //leveraging context menu for drag drop
  useEN: boolean;
  setUseEN: Action<SettingsStore, boolean>;
}

const userLanguage =
  navigator.language || (navigator as any).userLanguage || "en";

const englishNamePrefs = ["en", "es", "fr", "id", "pt", "de", "ru", "it"];

// DND State Management
export const settingsStore: SettingsStore = {
  useEN: englishNamePrefs.find((x) => userLanguage.includes(x)) ? true : false,
  setUseEN: action((state, y) => {
    state.useEN = y;
  }),
};
