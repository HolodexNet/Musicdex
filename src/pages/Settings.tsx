import {
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { OrgPickerPanel } from "../components/settings/OrgManagement";
import { UserSettings } from "../components/settings/UserSettings";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { LanguageSettings } from "../components/settings/LanguageSettings";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Settings")} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Settings")}
        </Heading>
        <Tabs
          orientation="vertical"
          size="lg"
          align="start"
          flexDir={{ base: "column", md: "row" }}
          isLazy
        >
          <TabList h="fit-content" minW={{ base: "full", md: 72 }}>
            <Tab
              fontSize="lg"
              fontWeight={600}
              justifyContent="flex-start"
              gap={2}
            >
              <Icon as={FaRegUser} mr={1}></Icon>
              {t("User Preferences")}
            </Tab>
            <Tab
              fontSize="lg"
              fontWeight={600}
              justifyContent="flex-start"
              gap={2}
            >
              <Icon as={IoLanguage} mr={1}></Icon>
              {t("Language Preferences")}
            </Tab>
            <Tab
              fontSize="lg"
              fontWeight={600}
              justifyContent="flex-start"
              gap={2}
            >
              <Icon as={FaRegBuilding} mr={1}></Icon>
              {t("Organization Ordering")}
            </Tab>
          </TabList>
          <TabPanels
            borderColor="chakra-border-color"
            borderLeftWidth={{ base: 0, md: 1 }}
            pl={{ base: 0, md: 4 }}
          >
            <TabPanel px={0}>
              <UserSettings />
            </TabPanel>
            <TabPanel px={0}>
              <LanguageSettings />
            </TabPanel>
            <TabPanel px={0}>
              <Text my={2} fontStyle="italic">
                {t("Drag and Drop to reorder list of orgs in the org dropdown")}
              </Text>
              <OrgPickerPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContainerInlay>
    </PageContainer>
  );
}
