
// Function to return an array of STEPS discrete colors in a gradient from an array of starting colors
// Used for NivoCalendarChart
export const generateDiscreteColorGradientArray = (colors, numSteps) => {
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
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }

  function normalizeStops(stops) {
    const minStop = Math.min(...stops);
    const maxStop = Math.max(...stops);
    return stops.map(stop => (stop - minStop) / (maxStop - minStop));
  }

  let colorStops;
  if (typeof colors[0] === 'string') {
    // No stops provided, generate equally spaced stops
    const totalColors = colors.length;
    colorStops = colors.map((color, index) => ({
      color: hexToRgb(color),
      stop: index / (totalColors - 1)
    }));
  } else {
    // Stops are provided, normalize them
    let stops = colors.map(cs => cs.stop);
    stops = normalizeStops(stops);

    colorStops = colors.map((cs, index) => ({
      color: hexToRgb(cs.color),
      stop: stops[index]
    }));
  }

  let colorArray = [];
  let stepPositions = Array.from({ length: numSteps }, (_, i) => i / (numSteps - 1));

  for (let i = 0; i < stepPositions.length; i++) {
    let pos = stepPositions[i];
    let color1, color2, stop1, stop2;

    for (let j = 0; j < colorStops.length - 1; j++) {
      if (pos >= colorStops[j].stop && pos <= colorStops[j + 1].stop) {
        color1 = colorStops[j].color;
        color2 = colorStops[j + 1].color;
        stop1 = colorStops[j].stop;
        stop2 = colorStops[j + 1].stop;
        break;
      }
    }

    let localFactor = (pos - stop1) / (stop2 - stop1);
    let interpolatedColor = interpolateColor(color1, color2, localFactor);
    colorArray.push(rgbToHex(...interpolatedColor));
  }

  return colorArray;
};

// Function to return CSS background from an array of colors (with or without offsets)
export const generateCssBackgroundGradient = (colors) => {
  if (typeof colors[0] === 'string') {
    // No stops provided, generate equally spaced stops
    return `linear-gradient(to right, ${colors.map((color, index, array) => {
      const position = (index / (array.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ')})`;
  } else {
    // Normalize the stops
    const stops = colors.map(cs => cs.stop);
    const minStop = Math.min(...stops);
    const maxStop = Math.max(...stops);
    const normalizedColors = colors.map(cs => ({
      color: cs.color,
      stop: ((cs.stop - minStop) / (maxStop - minStop)) * 100
    }));
    return `linear-gradient(to right, ${normalizedColors.map(cs => `${cs.color} ${cs.stop}%`).join(', ')})`;
  }
}

export const generateSvgFillGradient = ({ gradient, realMinValue, realMaxValue }) => {
  // Filter out stops that are outside the range
  const clampedStops = gradient.filter(stop => stop.stop >= realMinValue && stop.stop <= realMaxValue);

  // Normalize the stop positions
  const range = realMaxValue - realMinValue;
  const normalizedStops = clampedStops.map(stop => ({
    ...stop,
    stop: ((stop.stop - realMinValue) / range) * 100 + '%'
  }));

  return normalizedStops;
};

// Gradient for background of the Google Charts
export const BackgroundGradient = ({ id, stops: colors }) => (
  <svg width={0} height={0} visibility="hidden">
    <defs>
      <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
        {colors.map((color, index) => (
          <stop key={index} offset={color.stop} stopColor={color.color} />
        ))}
      </linearGradient>
    </defs>
  </svg>
);