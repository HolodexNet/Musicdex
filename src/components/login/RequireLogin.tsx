import { Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useClient } from "../../modules/client";
import { ContainerInlay } from "../layout/ContainerInlay";
import { PageContainer } from "../layout/PageContainer";
import { LoginButtons } from "./LoginButtons";

export function RequireLogin({
  children,
  // Fallback string for meta, when the actual meta is blocked by login
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { t } = useTranslation();
  const { isLoggedIn } = useClient();
  if (isLoggedIn) return <>{children}</>;

  return (
    <PageContainer>
      <Helmet>
        <title>{title || "Login Required"} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <Center flexDirection="column">
          <Text fontSize="xl" mb={8}>
            {t("Please log in to use this feature.")}
          </Text>
          <LoginButtons />
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
