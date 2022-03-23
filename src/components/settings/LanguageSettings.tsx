import { Stack, Select, RadioGroup, Radio } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../store";
import { SettingsSection } from "./SettingsSection";

export function LanguageSettings() {
  const { t, i18n } = useTranslation();
  const displayLangPrefs = [
    { value: "en", display: "English", credit: "@Holodex" },
    { value: "en-GB", display: "English (British)", credit: "@Holodex" },
    // { value: "ja", display: "日本語", credit: "Yourein#3960,Saginomiya#2353" },
    { value: "zh", display: "繁體中文", credit: "angel84326#7887" },
    { value: "ko", display: "한국어", credit: "AlexKoala#0253" },
    // { value: "es", display: "Español Latino", credit: "Aldo#3682" },
    // { value: "ms", display: "Bahasa Melayu", credit: "Admiy#8261" },
    // { value: "id", display: "Bahasa Indonesia", credit: "alcyneous#2803" },
    // { value: "ru", display: "Русский язык", credit: "kirillbarnaul#8499" },
    // { value: "pt", display: "Português Brasileiro", credit: "Ash Niartis#5090" },
    {
      value: "de",
      display: "Deutsch",
      credit: "DatJocab#1803, Doubleturtle#3660",
    },
    // { value: "it", display: "Italiano", credit: "テオさん#0139" },
    // { value: "tr", display: "Türkçe", credit: "creeperkafasipw#1861" },
    // { value: "vi", display: "Tiếng Việt", credit: "Pooh#6666,Dead xda member#4848,#Hiraoka Yukio#3042" },
    { value: "hu", display: "Magyar", credit: "kuroihikikomori#7216" },
    // { value: "th", display: "ไทย", credit: "SnowNeko#0282" },
    // { value: "cimode", display: "Internal Translation Use" },
  ];

  const channelNamePrefs = [
    { value: "english_name", display: t("English") },
    { value: "name", display: t("Original Name on YouTube (Japanese, etc)") },
  ];

  const useEN = useStoreState((s) => s.settings.useEN);
  const changeUseEN = useStoreActions((s) => s.settings.setUseEN);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <SettingsSection title={t("Interface Language")}>
        <Select
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue={i18n.language}
        >
          {displayLangPrefs.map((opt) => (
            <option value={opt.value} key={`i18n-${opt.value}`}>
              {opt.display}
            </option>
          ))}
        </Select>
      </SettingsSection>
      <SettingsSection title={t("Channel Name")}>
        <RadioGroup
          defaultValue={useEN ? "english_name" : "name"}
          onChange={(e) => changeUseEN(e === "english_name")}
        >
          <Stack>
            {channelNamePrefs.map((opt) => (
              <Radio value={opt.value} key={`useEN-${opt.value}`}>
                {opt.display}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </SettingsSection>
    </>
  );
}
