import React from "react";
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

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Center role="alert" my={10}>
      <VStack spacing={4}>
        <Heading>Something went wrong:</Heading>
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
