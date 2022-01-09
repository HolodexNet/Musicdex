// export type Palette = {
//   name: string;
//   colors: {
//     [key: number]: string;
//   };
// };

type Rgb = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): Rgb | null {
  const sanitizedHex = hex.replaceAll("##", "#");
  const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    sanitizedHex
  );

  if (!colorParts) {
    return null;
  }

  const [, r, g, b] = colorParts;

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  } as Rgb;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(hex: string, intensity: number): string {
  const color = hexToRgb(`#${hex}`);

  if (!color) {
    return "";
  }

  const r = Math.round(color.r + (255 - color.r) * intensity);
  const g = Math.round(color.g + (255 - color.g) * intensity);
  const b = Math.round(color.b + (255 - color.b) * intensity);

  return rgbToHex(r, g, b);
}

function darken(hex: string, intensity: number): string {
  const color = hexToRgb(hex);

  if (!color) {
    return "";
  }

  const r = Math.round(color.r * intensity);
  const g = Math.round(color.g * intensity);
  const b = Math.round(color.b * intensity);

  return rgbToHex(r, g, b);
}

/**
 * Generates a Color Palette
 * @param name the name of the color.
 * @param baseColor the base color value. must be a HEX string.
 * @param alpha the alpha value of the color.
 * @returns
 */
export default function makePalette(baseColor: string, alpha?: string) {
  const response: Record<number, string> = {
    500: `#${baseColor}`.replace("##", "#") + (alpha || ""),
  };

  const intensityMap: {
    [key: number]: number;
  } = {
    50: 0.95,
    100: 0.9,
    200: 0.75,
    300: 0.6,
    400: 0.3,
    600: 0.83,
    700: 0.69,
    800: 0.43,
    900: 0.24,
  };

  [50, 100, 200, 300, 400].forEach((level) => {
    response[level] = lighten(baseColor, intensityMap[level]) + (alpha || "");
  });

  [600, 700, 800, 900].forEach((level) => {
    response[level] = darken(baseColor, intensityMap[level]) + (alpha || "");
  });

  return response;
}
