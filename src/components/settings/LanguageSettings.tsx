import {
  SimpleGrid,
  Box,
  Heading,
  Button,
  Stack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../store";

export function LanguageSettings() {
  const displayLangPrefs: LanguageOpts[] = [
    { value: "en", display: "English (US)" },
    { value: "enGB", display: "English (British)" },
    { value: "zh", display: "Chinese (Not Started)" },
    { value: "ja", display: "Japanese (Not Started)" },
    { value: "cimode", display: "Internal Translation Use" },
  ];

  const channelNamePrefs: LanguageOpts[] = [
    { value: "english_name", display: "English" },
    { value: "name", display: "Same as Youtube (Japanese, etc)" },
  ];

  const useEN = useStoreState((s) => s.settings.useEN);
  const changeUseEN = useStoreActions((s) => s.settings.setUseEN);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SimpleGrid minChildWidth="300px" spacing="40px">
      <Box>
        <Heading size="md" my={3}>
          {t("Interface Language")}:
        </Heading>
        <LanguageSelector
          options={displayLangPrefs}
          onChange={(v: string) => changeLanguage(v)}
          defaultValue={i18n.language}
        />
      </Box>
      <Box>
        <Heading size="md" my={3}>
          {t("Channel Name")}:
        </Heading>
        <LanguageSelector
          options={channelNamePrefs}
          onChange={(e) => changeUseEN(e === "english_name")}
          defaultValue={useEN ? "english_name" : "name"}
        />
      </Box>
    </SimpleGrid>
  );
}

function RadioCard(props: UseRadioProps & { children: ReactNode }) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Button
        as="div"
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        colorScheme={
          (checkbox as any)?.["data-checked"] !== undefined ? "n2" : "gray"
        }
        variant="outline"
        _checked={{
          boxShadow: "0px 0px 5px var(--chakra-colors-n2-200)",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Button>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
type LanguageOpts = {
  value: string;
  display: string;
};

function LanguageSelector({
  options,
  onChange,
  defaultValue,
}: {
  options: LanguageOpts[];
  onChange: (i: string) => void;
  defaultValue: string;
}) {
  const keysalt = useMemo(() => Math.floor(Math.random() * 100), []);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: keysalt + "radios_",
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <Stack {...group} flexWrap="wrap">
      {options.map((opt) => {
        const radio = getRadioProps({ value: opt.value });
        return (
          <RadioCard key={keysalt + opt.value} {...radio}>
            {opt.display}
          </RadioCard>
        );
      })}
    </Stack>
  );
}
