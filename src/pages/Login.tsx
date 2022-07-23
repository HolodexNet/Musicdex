import { Center } from "@chakra-ui/react";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { LoginPanel } from "../components/login/LoginPanel";

export default function Login() {
  return (
    <PageContainer>
      <Helmet>
        <title>{t("Login")} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <Center p={8}>
          <LoginPanel />
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
