import {
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import OrgManager from "../components/settings/OrgManagement";
import { UserSettings } from "../components/settings/UserSettings";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { LanguageSettings } from "../components/settings/LanguageSettings";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Settings")}
        </Heading>
        <Tabs isLazy>
          <TabList overflowX="auto" overflowY="hidden" maxW="100vw">
            <Tab fontSize="lg" fontWeight={600}>
              <Icon as={FaRegUser} mr={1}></Icon>
              {t("User Preferences")}
            </Tab>
            <Tab fontSize="lg" fontWeight={600}>
              <Icon as={IoLanguage} mr={1}></Icon>
              {t("Language Preferences")}
            </Tab>
            <Tab fontSize="lg" fontWeight={600}>
              <Icon as={FaRegBuilding} mr={1}></Icon>
              {t("Organization Ordering")}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <UserSettings />
            </TabPanel>
            <TabPanel px={0}>
              <LanguageSettings />
            </TabPanel>
            <TabPanel px={0}>
              <OrgManager />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContainerInlay>
    </PageContainer>
  );
}
