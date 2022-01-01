import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";

export function ContainerInlay({ children, ...props }: BoxProps) {
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  return (
    <Box
      bgColor={bgColor}
      position="relative"
      p={{ base: 2, xl: 4 }}
      pt={{ base: 4, xl: 8 }}
      borderRadius={5}
      {...props}
    >
      {children}
    </Box>
  );
}
