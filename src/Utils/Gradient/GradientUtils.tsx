import { isValidArray } from "../UtilFunctions";

// Types
type RGB = [number, number, number];
type RGBOrNull = [number | null, number | null, number | null];

interface ColorStopWithOffset {
  color: string;
  offset: number;
}

interface ColorStopWithRgb {
  color: RGB;
  offset: number;
}

type ColorInput = string[] | ColorStopWithOffset[];

interface NormalizeColorStopOffsetsArgs {
  offsets: number[];
  minOffset: number;
  maxOffset: number;
}

interface NormalizeColorStopsArgs {
  colors: ColorInput;
  optionalMinValue?: number;
  optionalMaxValue?: number;
}

interface GenerateDiscreteColorGradientArrayArgs {
  colors: ColorInput;
  numSteps?: number;
}

interface GenerateCssBackgroundGradientArgs {
  gradientDirection: string;
  colors: ColorInput;
  optionalMinValue?: number;
  optionalMaxValue?: number;
}

interface GenerateSvgFillGradientArgs {
  colors: ColorInput;
  optionalMinValue?: number;
  optionalMaxValue?: number;
}

interface BackgroundGradientProps {
  id: string;
  colors: ColorStopWithOffset[];
}

// Helper functions
const normalizeColorStopOffsets = ({ offsets, minOffset, maxOffset }: NormalizeColorStopOffsetsArgs): number[] => {
  return offsets.map(offset => (offset - minOffset) / (maxOffset - minOffset));
};

const normalizeColorStops = ({ colors, optionalMinValue, optionalMaxValue }: NormalizeColorStopsArgs): ColorStopWithOffset[] => {
  if (!isValidArray(colors)) return [
    { color: "#fff", offset: 0 },
    { color: "#fff", offset: 1 }
  ];

  // No offsets provided, generate equally spaced offsets
  if (typeof colors[0] === 'string') {
    const stringColors = colors as string[];
    const totalColors = stringColors.length;
    return stringColors.map((color, index) => ({
      color: color,
      offset: index / (totalColors - 1)
    }));
  }
  // Offsets are provided, normalize them
  else {
    let clampedStops = colors as ColorStopWithOffset[];
    if (optionalMinValue !== undefined) {
      clampedStops = clampedStops.filter(colorStop => colorStop.offset >= optionalMinValue);
    }
    if (optionalMaxValue !== undefined) {
      clampedStops = clampedStops.filter(colorStop => colorStop.offset <= optionalMaxValue);
    }
    const offsets = clampedStops.map(colorStop => colorStop.offset);

    const minOffset = optionalMinValue ?? Math.min(...offsets);
    const maxOffset = optionalMaxValue ?? Math.max(...offsets);

    const normalizedOffsets = normalizeColorStopOffsets({ offsets, minOffset, maxOffset });

    return clampedStops.map((colorStop, index) => ({
      color: colorStop.color,
      offset: normalizedOffsets[index]
    }));
  }
};

// Function to return an array of STEPS discrete colors in a gradient from an array of starting colors
// Used for NivoCalendarChart
function hexToRgb(hex: string): RGBOrNull {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [null, null, null];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function interpolateColor(color1: RGB, color2: RGB, factor: number): RGB {
  // Return immediately if the 2 colors are the same
  if (color1.every((element, index) => element === color2[index])) return color1;

  // Else, calculate the middle of the 2 colors
  const result: RGB = [...color1];
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

export const generateDiscreteColorGradientArray = ({ colors, numSteps = 100 }: GenerateDiscreteColorGradientArrayArgs): string[] => {
  const normalizedColors = normalizeColorStops({ colors });
  const colorsWithRgb: ColorStopWithRgb[] = normalizedColors.map((colorStop) => ({
    color: hexToRgb(colorStop.color) as RGB,
    offset: colorStop.offset
  }));

  const colorArray: string[] = [];
  const stepPositions = Array.from({ length: numSteps }, (_, i) => i / (numSteps - 1));

  for (let i = 0; i < stepPositions.length; i++) {
    const pos = stepPositions[i];
    let color1: RGB | undefined;
    let color2: RGB | undefined;
    let offset1: number | undefined;
    let offset2: number | undefined;

    for (let j = 0; j < colorsWithRgb.length - 1; j++) {
      if (pos >= colorsWithRgb[j].offset && pos <= colorsWithRgb[j + 1].offset) {
        color1 = colorsWithRgb[j].color;
        color2 = colorsWithRgb[j + 1].color;
        offset1 = colorsWithRgb[j].offset;
        offset2 = colorsWithRgb[j + 1].offset;
        break;
      }
    }

    if (color1 && color2 && offset1 !== undefined && offset2 !== undefined) {
      const localFactor = (pos - offset1) / (offset2 - offset1);
      const interpolatedColor = interpolateColor(color1, color2, localFactor);
      colorArray.push(rgbToHex(...interpolatedColor));
    }
  }

  return colorArray;
};

// Function to return CSS background from an array of colors (with or without offsets)
export const generateCssBackgroundGradient = ({ gradientDirection, colors, optionalMinValue, optionalMaxValue }: GenerateCssBackgroundGradientArgs): string => {
  const normalizedColors = normalizeColorStops({ colors, optionalMinValue, optionalMaxValue });

  return `linear-gradient(${gradientDirection}, ${normalizedColors.map(colorStop => `${colorStop.color} ${colorStop.offset * 100}%`).join(', ')})`;
};

export const generateSvgFillGradient = ({ colors, optionalMinValue, optionalMaxValue }: GenerateSvgFillGradientArgs): { color: string; offset: string }[] => {
  const normalizedColors = normalizeColorStops({ colors, optionalMinValue, optionalMaxValue });

  return normalizedColors.map(colorStop => ({
    color: colorStop.color,
    offset: colorStop.offset * 100 + '%'
  }));
};

// Gradient for background of the Google Charts
export const BackgroundGradient = ({ id, colors }: BackgroundGradientProps): JSX.Element => (
  <svg width={0} height={0} visibility="hidden">
    <defs>
      <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
        {colors.map((colorStop, index) => (
          <stop key={index} offset={colorStop.offset} stopColor={colorStop.color} />
        ))}
      </linearGradient>
    </defs>
  </svg>
);
