const shading = require("consistent-shading");
const { Color, ConsistentShading } = shading;
const convert = require("color-convert");

const IdealBaseColor = new Color("hex", ["#46465A"]);

const IdealShades = [
  new Color("hex", ["#C3C3DD"]), //50
  new Color("hex", ["#B0B0BB"]), //100
  new Color("hex", ["#8181A3"]), //200
  new Color("hex", ["#676785"]),
  new Color("hex", ["#5c5c77"]),
  new Color("hex", ["#46465A"]), //500
  new Color("hex", ["#30303d"]),
  new Color("hex", ["#25252f"]), //700
  new Color("hex", ["#17171e"]),
  new Color("hex", ["#121212"]), //900
];
const Generator = new ConsistentShading(IdealBaseColor, IdealShades);

const SATURATION_MAP = [0.32, 0.16, 0.08, 0.04, 0, 0, 0.04, 0.08, 0.46, 0.7];
const AR = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];
function makeColor(color, alpha = "") {
  const x = Object.fromEntries(
    Generator.generate(color, "hex").map((x, i) => {
      const hsl = convert["hex"]["hsl"].raw("#" + x.value);
      hsl[1] = hsl[1] * (1 - SATURATION_MAP[i]);
      const hex = convert["hsl"]["hex"].raw(hsl);
      // console.log(hex);
      return [AR[i] * 10, "#" + hex + (alpha || "")];
    })
  );
  // console.log(x);
  return x;
}

const localColors = {
  brand: makeColor(new Color("hex", ["#276986"])),
  n2: makeColor(new Color("hex", ["#D31371"])),
  bg: makeColor(new Color("hex", ["#46464c"])),
  bgAlpha: makeColor(new Color("hex", ["#46464cB3"]), "B3"),
};

console.log(localColors);
