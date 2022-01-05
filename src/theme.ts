import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { generatePalette } from "palette-by-numbers";

const localColors = {
  brand: generatePalette("rgba(82, 152, 182, 1)"),
  n2: generatePalette("#F772B0"),
  bg: generatePalette("rgba(98, 98, 114, 1)", { originalAtMidpoint: true }),
  bgAlpha: generatePalette("rgba(98, 98, 114, 0.7)"),
};

console.log(localColors);

export const theme = extendTheme(
  {
    config: { initialColorMode: "dark", useSystemColorMode: false },
    colors: localColors,
    fonts: {
      heading: "Manrope, Sans-Serif",
      body: "Assistant, Sans-Serif",
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export const colors = {
  bg: "black",
};
