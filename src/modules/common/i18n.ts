import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import {
  format as formatDate,
  formatDistanceToNow,
  formatRelative,
  isDate,
} from "date-fns";
import { enUS, ja, zhTW } from "date-fns/locale"; // import all locales we need
import I18NextHttpBackend from "i18next-http-backend";

const locales: { [key: string]: Locale } = { "en-US": enUS, ja, zhTW }; // used to look up the required locale

i18n
  .use(I18NextHttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // resources,
    debug: true,
    fallbackLng: "en",
    saveMissing: true,
    supportedLngs: ["en", "ja"],
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
            if (
              new Date().valueOf() - value.valueOf() >
              60 * 24 * 60 * 30 * 1000
            ) {
              return formatDate(value, "P", { locale });
            } else
              return formatDistanceToNow(value, {
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
      order: ["localStorage", "querystring", "navigator"], // local storage first. then querystring for incoming users?
    },
    backend: {
      // reloadInterval: 5000,
    },
  });

i18n.on("missingKey", (lngs, namespace, key, res) => {
  console.error(
    `Missing i18N Key / TL: lng=${lngs}, namespace=${namespace}, key=${key}, res=${res};`
  );
});
