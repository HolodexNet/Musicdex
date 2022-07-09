import { Button, Text, Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useClientLogin } from "../../modules/client";
import GoogleButton from "./GoogleButton";

export function LoginButtons() {
  const { t } = useTranslation();
  const { DiscordOAuth, GoogleAuthFn, TwitterAuth } = useClientLogin();
  if (!DiscordOAuth && !GoogleAuthFn && !TwitterAuth) {
    return <Text>All social accounts are connected</Text>;
  }
  return (
    <Flex width="100%" maxWidth={400} flexDirection="column">
      {DiscordOAuth && (
        <Button
          w={"full"}
          h={30}
          mb={4}
          colorScheme={"purple"}
          leftIcon={<FaDiscord />}
          onClick={DiscordOAuth}
          as="div"
          cursor="pointer"
        >
          <Text mx="auto">{t("Sign in with Discord")}</Text>
        </Button>
      )}

      {/* Google */}
      {GoogleAuthFn && (
        <GoogleButton onCredentialResponse={GoogleAuthFn} mb={4}></GoogleButton>
      )}

      {/* LinkedIn */}
      {TwitterAuth && (
        <Button
          w={"full"}
          h={30}
          mb={4}
          colorScheme={"twitter"}
          leftIcon={<FaTwitter />}
          onClick={TwitterAuth}
          as="div"
          cursor="pointer"
        >
          <Text mx="auto">{t("Sign in with Twitter")}</Text>
        </Button>
      )}
    </Flex>
  );
}
