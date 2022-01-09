import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { Color, ConsistentShading } from "consistent-shading";
import convert from "color-convert";

const IdealBaseColor = new Color("hex", ["#46465A"]);

const IdealShades = [
  new Color("hex", ["#9f9fb4"]), //50
  new Color("hex", ["#82829e"]), //100
  new Color("hex", ["#747493"]), //200
  new Color("hex", ["#676785"]),
  new Color("hex", ["#5c5c77"]),
  new Color("hex", ["#46465A"]), //500
  new Color("hex", ["#30303d"]),
  new Color("hex", ["#25252f"]), //700
  new Color("hex", ["#17171e"]),
  new Color("hex", ["#090902"]), //900
];
const Generator = new ConsistentShading(IdealBaseColor, IdealShades);

const SATURATION_MAP = [0.32, 0.16, 0.08, 0.04, 0, 0, 0.04, 0.08, 0.16, 0.56];
const AR = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
function makeColor(color: Color, alpha?: string) {
  const x = Object.fromEntries(
    Generator.generate(color, "hex").map((x, i) => {
      const hsl = convert["hex"]["hsl"].raw("#" + x.value);
      hsl[1] = hsl[1] * (1 - SATURATION_MAP[i]);
      const hex = convert["hsl"]["hex"].raw(hsl);
      console.log(hex);
      return [AR[i] * 10, "#" + hex + (alpha || "")];
    })
  );
  console.log(x);
  return x;
}

const localColors = {
  brand: makeColor(new Color("hex", ["#276986"])),
  n2: makeColor(new Color("hex", ["#D31371"])),
  bg: makeColor(new Color("hex", ["#464658"])),
  bgAlpha: makeColor(new Color("hex", ["#464658B3"]), "B3"),
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
