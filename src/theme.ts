import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// Check scripts/generateTheme.js to get these values
const localColors = {
  brand: {
    "50": "#BDE6F3",
    "100": "#A4D5F1",
    "200": "#71A8C4",
    "300": "#528CA9",
    "400": "#44819F",
    "500": "#276986",
    "600": "#02506A",
    "700": "#04425B",
    "800": "#122F3C",
    "900": "#19272F",
  },
  n2: {
    "50": "#F3C1EC",
    "100": "#F7A7DD",
    "200": "#F973B1",
    "300": "#FB5096",
    "400": "#F13D89",
    "500": "#D31371",
    "600": "#B00458",
    "700": "#9D074C",
    "800": "#6E2141",
    "900": "#582F3F",
  },
  bg: {
    "50": "#C4C4C9",
    "100": "#B0B0B5",
    "200": "#828289",
    "300": "#68686E",
    "400": "#5D5D63",
    "500": "#46464C",
    "600": "#2F3035",
    "700": "#24242A",
    "800": "#17171A",
    "900": "#121214",
  },
  bgAlpha: {
    "50": "#C4C4C9B3",
    "100": "#B0B0B5B3",
    "200": "#828289B3",
    "300": "#68686EB3",
    "400": "#5D5D63B3",
    "500": "#46464CB3",
    "600": "#2F3035B3",
    "700": "#24242AB3",
    "800": "#17171AB3",
    "900": "#121214B3",
  },
};

export const theme = extendTheme(
  {
    config: { initialColorMode: "dark", useSystemColorMode: false },
    colors: localColors,
    fonts: {
      heading:
        'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans","Helvetica Neue", Sans-Serif',
      body: 'Assistant, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans","Helvetica Neue", Sans-Serif',
    },
    styles: {
      global: {
        body: {
          bg: "bg.900",
          overflow: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "#root": {
          h: "100vh",
          overflow: "hidden",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);
