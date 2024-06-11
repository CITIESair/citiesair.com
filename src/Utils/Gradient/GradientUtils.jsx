import { isValidArray } from "../Utils";

const normalizeColorStopOffsets = ({ offsets, minOffset, maxOffset }) => {
  return offsets.map(offset => (offset - minOffset) / (maxOffset - minOffset));
}

const normalizeColorStops = ({ colors, optionalMinValue, optionalMaxValue }) => {
  if (!isValidArray(colors)) return [
    { color: "#fff", offset: 0 },
    { color: "#fff", offset: 1 }
  ];

  // No offsets provided, generate equally spaced offsets
  if (typeof colors[0] === 'string') {
    const totalColors = colors.length;
    return colors.map((color, index) => ({
      color: color,
      offset: index / (totalColors - 1)
    }));
  }
  // Offsets are provided, normalize them
  else {
    let clampedStops = colors;
    if (optionalMinValue) {
      clampedStops = colors.filter(colorStop => colorStop.offset >= optionalMinValue);
    }
    if (optionalMaxValue) {
      clampedStops = colors.filter(colorStop => colorStop.offset <= optionalMaxValue);
    }
    const offsets = clampedStops.map(colorStop => colorStop.offset);

    const minOffset = optionalMinValue || Math.min(...offsets);
    const maxOffset = optionalMaxValue || Math.max(...offsets);

    const normalizedOffsets = normalizeColorStopOffsets({ offsets, minOffset, maxOffset });

    return clampedStops.map((colorStop, index) => ({
      color: colorStop.color,
      offset: normalizedOffsets[index]
    }));
  }
}

// Function to return an array of STEPS discrete colors in a gradient from an array of starting colors
// Used for NivoCalendarChart
export const generateDiscreteColorGradientArray = ({ colors, numSteps = 100 }) => {
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [null, null, null];
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  function interpolateColor(color1, color2, factor) {
    // Return immediately if the 2 colors are the same
    if (color1.every((element, index) => element === color2[index])) return color1;

    // Else, calculate the middle of the 2 colors
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }

  const normalizedColors = normalizeColorStops({ colors });
  normalizedColors.forEach((colorStop) => {
    colorStop.color = hexToRgb(colorStop.color)
  });

  let colorArray = [];
  const stepPositions = Array.from({ length: numSteps }, (_, i) => i / (numSteps - 1));

  for (let i = 0; i < stepPositions.length; i++) {
    const pos = stepPositions[i];
    let color1, color2, offset1, offset2;

    for (let j = 0; j < normalizedColors.length - 1; j++) {
      if (pos >= normalizedColors[j].offset && pos <= normalizedColors[j + 1].offset) {
        color1 = normalizedColors[j].color;
        color2 = normalizedColors[j + 1].color;
        offset1 = normalizedColors[j].offset;
        offset2 = normalizedColors[j + 1].offset;
        break;
      }
    }

    const localFactor = (pos - offset1) / (offset2 - offset1);
    const interpolatedColor = interpolateColor(color1, color2, localFactor);
    colorArray.push(rgbToHex(...interpolatedColor));
  }

  return colorArray;
};

// Function to return CSS background from an array of colors (with or without offsets)
export const generateCssBackgroundGradient = ({ gradientDirection, colors }) => {
  const normalizedColors = normalizeColorStops({ colors });

  return `linear-gradient(${gradientDirection}, ${normalizedColors.map(colorStop => `${colorStop.color} ${colorStop.offset * 100}%`).join(', ')})`;
}

export const generateSvgFillGradient = ({ colors, optionalMinValue, optionalMaxValue }) => {
  const normalizedColors = normalizeColorStops({ colors, optionalMinValue, optionalMaxValue });

  return normalizedColors.map(colorStop => ({
    color: colorStop.color,
    offset: colorStop.offset * 100 + '%'
  }));
};

// Gradient for background of the Google Charts
export const BackgroundGradient = ({ id, colors }) => (
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