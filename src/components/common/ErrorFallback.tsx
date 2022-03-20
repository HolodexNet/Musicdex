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

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorHeader = useMemo(() => {
    switch (true) {
      case error.message.includes("status code 401"):
        return "Unauthorized";
      case !!error.message.match(/status code 5\d\d/i):
        return "Server error";
      default:
        return "Something went wrong";
    }
  }, [error.message]);
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
            Step 1: Refresh Page
          </Button>
          <Button onClick={resetErrorBoundary} colorScheme="yellow">
            Step 2: Reset Cache & Logout
          </Button>
        </HStack>
        <Text pt={6}>
          If the above buttons doesn't fix it, send us a screenshot on Discord
          or Twitter and let us know how you ran into the problem.
        </Text>
        <HStack>
          <Button onClick={resetErrorBoundary} colorScheme="twitter">
            Twitter
          </Button>
          <Button onClick={resetErrorBoundary} colorScheme="purple">
            Discord
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
}
