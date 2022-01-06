import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";

export function ContainerInlay({ children, ...props }: BoxProps) {
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  return (
    <Box
      bgColor={bgColor}
      position="relative"
      px={{ base: 2, md: 4, xl: 6 }}
      pt={{ base: 4, xl: 6 }}
      borderRadius={5}
      {...props}
    >
      {children}
    </Box>
  );
}
