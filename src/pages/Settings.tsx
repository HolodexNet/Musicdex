import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Heading,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  Divider,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { Suspense } from "react";
import { ReactNode, useMemo } from "react";
import { UserSettings } from "../components/common/UserSettings";
import { LoginButtons } from "../components/header/Login";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";

export const OrgManager = React.lazy(
  () => import("../components/common/OrgManagement")
);

export default function Settings() {
  return (
    <PageContainer>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          Settings
        </Heading>
        <Accordion allowMultiple defaultIndex={[0, 1, 2]} mb={12}>
          <AccordionItem>
            <AccordionButton>
              <AccordionIcon />
              <Heading size="md" flex="1" textAlign="left">
                User Preference
              </Heading>
            </AccordionButton>
            <Divider />

            <AccordionPanel pb={4}>
              <UserSettings />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <AccordionIcon />

              <Heading size="md" flex="1" textAlign="left">
                Language Preferences (yeah i know it's not working)
              </Heading>
            </AccordionButton>
            <Divider />

            <AccordionPanel pb={4}>
              <LanguagePrefs />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <AccordionIcon />

              <Heading size="md" flex="1" textAlign="left">
                Organization Ordering
              </Heading>
            </AccordionButton>
            <Divider />

            <AccordionPanel pb={4}>
              <Text fontWeight="bold">
                Drag and Drop to reorder list of orgs in the org dropdown
              </Text>
              <Suspense fallback="...">
                <OrgManager />
              </Suspense>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </ContainerInlay>
    </PageContainer>
  );
}

function LanguagePrefs() {
  const displayLangPrefs: LanguageOpts[] = [
    { value: "en", display: "English" },
    { value: "zh", display: "Chinese" },
    { value: "ja", display: "Japanese" },
  ];

  const channelNamePrefs: LanguageOpts[] = [
    { value: "english_name", display: "English" },
    { value: "name", display: "Original Language" },
  ];

  return (
    <SimpleGrid minChildWidth="300px" spacing="40px">
      <Box>
        <Heading size="sm" my={1}>
          Interface Language:
        </Heading>
        <LanguageSelector
          options={displayLangPrefs}
          onChange={console.log}
          defaultValue="en"
        />
      </Box>
      <Box>
        <Heading size="sm" my={1}>
          Channel Name:
        </Heading>
        <LanguageSelector
          options={channelNamePrefs}
          onChange={console.log}
          defaultValue="english_name"
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
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
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
    <HStack {...group}>
      {options.map((opt) => {
        const radio = getRadioProps({ value: opt.value });
        return (
          <RadioCard key={keysalt + opt.value} {...radio}>
            {opt.display}
          </RadioCard>
        );
      })}
    </HStack>
  );
}
