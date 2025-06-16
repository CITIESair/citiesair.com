export const TemperatureUnits = {
  celsius: 'C',
  fahrenheit: 'F',
};

// Converts a temperature to the specified unit
export function convertTemperature(temp, toUnit) {
  if (!temp) return "--";

  if (toUnit === TemperatureUnits.celsius) {
    return ((temp - 32) * 5 / 9).toFixed(1);
  } else if (toUnit === TemperatureUnits.fahrenheit) {
    return (temp * 9 / 5 + 32).toFixed(1);
  }

  return temp; // Return as-is for unsupported units
}

// Return formatted temperature in the appropriate system
export function getFormattedTemperature({ rawTemp, currentUnit, returnUnit }) {
  if (!rawTemp) return `--°${returnUnit}`;

  return `${(currentUnit === returnUnit) ? rawTemp : convertTemperature(rawTemp, returnUnit)}°${returnUnit}`;
}