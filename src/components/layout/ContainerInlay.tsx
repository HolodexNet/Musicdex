import { Flex, FlexProps, useColorModeValue } from "@chakra-ui/react";

export function ContainerInlay({ children, ...props }: FlexProps) {
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  return (
    <Flex
      bgColor={bgColor}
      flexDirection="column"
      display="flex"
      flex="1"
      position="relative"
      px={{ base: 2, md: 4, xl: 6 }}
      py={{ base: 4, xl: 6 }}
      borderRadius={5}
      {...props}
    >
      {children}
    </Flex>
  );
}
