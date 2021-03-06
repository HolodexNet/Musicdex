import { Flex, Progress, Spinner, Text } from "@chakra-ui/react";
import { useIsFetching } from "react-query";
import { GradientLogo } from "../icons/GradientLogo";
export function GlobalLoadingStatus() {
  // How many queries are fetching?
  const isFetching = useIsFetching();
  if (isFetching <= 0) return null;

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

export function LoadingFullScreen() {
  return (
    <Flex
      width="100%"
      height="100%"
      position="fixed"
      bgColor="bg.800"
      zIndex={99}
      top={0}
      left={0}
      justifyContent="center"
      alignItems="center"
      animation="fade-in 0.2s"
    >
      <Spinner size="xl" color="n2.100"></Spinner>
      <GradientLogo position="fixed" />
    </Flex>
  );
}
