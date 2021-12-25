import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { format as formatDate, isDate } from "date-fns";
import { enUS, ja, zhTW } from "date-fns/locale"; // import all locales we need

const locales: { [key: string]: Locale } = { "en-US": enUS, ja, zhTW }; // used to look up the required locale

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
      shortDate: "{{date, short}}",
      shortDateTime: "{{date, datetime}}",
      longDate: "{{date, long}}",
      relativeDate: "{{date, relative}}",
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
      format: (value, format, lng, options) => {
        if (isDate(value) && lng) {
          const locale = locales[lng];
          if (format === "short") return formatDate(value, "P", { locale });
          if (format === "long") return formatDate(value, "PPPP", { locale });
          if (format === "relative")
            return formatRelative(value, new Date(), { locale });
          if (format === "ago")
            return formatDistance(value, new Date(), {
              locale,
              addSuffix: true,
            });
          if (format === "datetime") return formatDate(value, "Pp", { locale });
          return formatDate(value, format!, { locale });
        }

        return value;
      },
    },
    detection: {
      order: ["navigator", "localStorage"],
    },
  });
function formatRelative(value: any, arg1: Date, arg2: { locale: any }): string {
  throw new Error("Function not implemented.");
}

function formatDistance(
  value: any,
  arg1: Date,
  arg2: { locale: any; addSuffix: boolean }
): string {
  throw new Error("Function not implemented.");
}
