import { Progress } from "@chakra-ui/react";
import { useIsFetching } from "react-query";
export function GlobalLoadingStatus() {
  // How many queries are fetching?
  const isFetching = useIsFetching();
  if (isFetching <= 0) return null;
  // <Flex
  //   width="100%"
  //   height="100%"
  //   maxW="100vw"
  //   maxH="100vh"
  //   position="absolute"
  //   bgColor="bg.800"
  //   zIndex={5}
  //   justifyContent="center"
  //   alignItems="center"
  // >
  //   <Spinner size="xl" />
  //   <Text fontSize="3xl">Loading...</Text>
  // </Flex>
  return (
    <Progress
      size="xs"
      width="100%"
      top="calc(65px - 4px + env(safe-area-inset-top))"
      position="absolute"
      colorScheme="n2"
      bgColor="bgAlpha.600"
      isIndeterminate
      opacity={0.6}
      zIndex={5}
      transition="opacity 0.1s ease-out"
    />
  );
}
