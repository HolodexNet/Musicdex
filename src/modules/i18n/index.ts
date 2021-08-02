import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      add: "Add",
      load: "Load",
      save: "Save",
      close: "Close",
      edit: "Edit",
      remove: "Remove",
      set: "Set",
    },
  },
  ja: {
    translation: {
      add: "追加",
      load: "ロード",
      save: "保存",
      close: "閉じる",
      edit: "編集",
      remove: "削除",
      set: "確定",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator", "localStorage"],
    },
  });
