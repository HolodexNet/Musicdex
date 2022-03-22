import {
  Box,
  Heading,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  SimpleGrid,
  Button,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import OrgManager from "../components/settings/OrgManagement";
import { UserSettings } from "../components/settings/UserSettings";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useStoreActions, useStoreState } from "../store";
import { LanguageSettings } from "../components/settings/LanguageSettings";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Settings")}
        </Heading>
        <Tabs isLazy>
          <TabList>
            <Tab>{t("User Preferences")}</Tab>
            <Tab>{t("Language Preferences")}</Tab>
            <Tab>{t("Organization Ordering")}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <UserSettings />
            </TabPanel>
            <TabPanel>
              <LanguageSettings />
            </TabPanel>
            <TabPanel>
              <OrgManager />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContainerInlay>
    </PageContainer>
  );
}
