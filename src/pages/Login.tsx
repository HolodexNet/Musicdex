import { Center, Stack, Heading, Divider, Text } from "@chakra-ui/react";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { LoginButtons } from "../components/login/LoginButtons";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useClient } from "../modules/client";

export default function Login() {
  const { isLoggedIn } = useClient();
  return (
    <PageContainer>
      <ContainerInlay>
        <Center p={8}>
          <Stack spacing={4} align={"center"} maxW={"md"} w={"full"}>
            {!isLoggedIn ? (
              <>
                <Heading size="lg">{t("Sign in to Musicdex")}</Heading>
                <Divider width={12} py={2} />
                <Text>
                  <Trans i18nKey="loginIntro"></Trans>
                </Text>
              </>
            ) : (
              <>
                <Heading size="md">
                  {t("Connect more accounts to Musicdex")}
                </Heading>
              </>
            )}
            <LoginButtons />
          </Stack>
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
