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
          <Button onClick={resetErrorBoundary} colorScheme="yellow">
            {t("Step 2: Reset Cache & Logout")}
          </Button>
        </HStack>
        <Text pt={6}>
          {t(
            "If the above buttons doesn't fix it, send us a screenshot on Discord or Twitter and let us know how you ran into the problem."
          )}
        </Text>
        <HStack>
          <Button onClick={resetErrorBoundary} colorScheme="twitter">
            {t("Twitter")}
          </Button>
          <Button onClick={resetErrorBoundary} colorScheme="purple">
            {t("Discord")}
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
}
