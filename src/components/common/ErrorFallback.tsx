import { FallbackProps } from "react-error-boundary";
import {
  Button,
  Center,
  Code,
  Heading,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useClient } from "../../modules/client";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();
  const errorHeader = useMemo(() => {
    switch (true) {
      case error.message.includes("status code 401"):
        return t("Unauthorized");
      case !!error.message.match(/status code 5\d\d/i):
        return t("Server error");
      default:
        return t("Something went wrong");
    }
  }, [error.message, t]);

  const { logout } = useClient();
  const resetCacheAndLogout = async () => {
    logout();
    // clear IndexedDB
    const dbs = await window.indexedDB?.databases();
    dbs?.forEach((db) => {
      db.name && window.indexedDB.deleteDatabase(db.name);
    });
    // clear localStorage
    window.localStorage.clear();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    window.location.replace("/");
  };
  return (
    <Center role="alert" my={10}>
      <VStack spacing={4}>
        <Heading>{errorHeader}</Heading>
        <Code>{error.message}</Code>
        <Code
          maxW="800px"
          children={error.stack}
          whiteSpace="pre-wrap"
          noOfLines={6}
        ></Code>
        <HStack>
          <Button onClick={resetErrorBoundary} colorScheme="green">
            {t("Step 1: Refresh Page")}
          </Button>
          <Button onClick={resetCacheAndLogout} colorScheme="yellow">
            {t("Step 2: Reset Cache & Logout")}
          </Button>
        </HStack>
        <Text pt={6}>{t("ErrorPart2LetUsKnow")}</Text>
        <HStack>
          <a href="https://twitter.com/holodex" target="_blank">
            <Button colorScheme="twitter">{t("Twitter")}</Button>
          </a>
          <a href="https://discord.gg/A24AbzgvRJ" target="_blank">
            <Button colorScheme="purple">{t("Discord")}</Button>
          </a>
        </HStack>
      </VStack>
    </Center>
  );
}
