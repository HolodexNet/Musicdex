import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { generatePalette } from "palette-by-numbers";

export const theme = extendTheme(
  {
    config: { initialColorMode: "dark", useSystemColorMode: false },
    colors: {
      brand: generatePalette("rgba(82, 152, 182, 1)"),
      n2: generatePalette("#F772B0"),
      bg: generatePalette("rgba(132, 132, 164, 1)"),
      bgAlpha: generatePalette("rgba(132, 132, 164, 0.5)"),
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export const colors = {
  bg: "black",
};
