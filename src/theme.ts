import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { Color, ConsistentShading } from "consistent-shading";

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
  new Color("hsl", ["hsl(240, 13.8%, 10.4%)"]),
  new Color("hsl", ["hsl(240, 20.9%, 5.4%)"]), //900
];
const Generator = new ConsistentShading(IdealBaseColor, IdealShades);

const AR = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
function makeColor(color: Color) {
  const x = Object.fromEntries(
    Generator.generate(color, "hex").map((x, i) => [AR[i] * 10, "#" + x.value])
  );
  console.log(x);
  return x;
}

const localColors = {
  brand: makeColor(new Color("hex", ["#5298b6"])),
  n2: makeColor(new Color("hex", ["#F80079"])),
  bg: makeColor(new Color("hex", ["#464658"])),
  bgAlpha: makeColor(new Color("hex", ["#464658B3"])),
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
