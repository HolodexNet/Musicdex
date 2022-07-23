import { Stack, Heading, Divider, Text } from "@chakra-ui/react";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { useClient } from "../../modules/client";
import { LoginButtons } from "./LoginButtons";

export function LoginPanel() {
  const { isLoggedIn } = useClient();
  return (
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
          <Heading size="md">{t("Connect more accounts to Musicdex")}</Heading>
        </>
      )}
      <LoginButtons />
    </Stack>
  );
}
