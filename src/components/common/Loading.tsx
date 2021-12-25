import { VStack, Text, Spinner } from "@chakra-ui/react";

export function Loading() {
  return (
    <VStack textAlign="center">
      <Spinner size="xl" />
      <Text fontSize="3xl">Loading...</Text>
    </VStack>
  );
}
