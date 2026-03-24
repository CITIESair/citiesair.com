const TemperatureUnits = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit'
} as const;

type TemperatureUnit = typeof TemperatureUnits[keyof typeof TemperatureUnits];

// Converts a temperature to the specified unit
// Assumes raw data is in the opposite unit (e.g. raw Celsius → toUnit Fahrenheit)
const convertTemperature = (temp: number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit): number => {
  if (fromUnit === toUnit) return Math.round(temp * 10) / 10;

  if (fromUnit === TemperatureUnits.CELSIUS && toUnit === TemperatureUnits.FAHRENHEIT) {
    return Math.round(((temp * 9 / 5) + 32) * 10) / 10;
  }

  if (fromUnit === TemperatureUnits.FAHRENHEIT && toUnit === TemperatureUnits.CELSIUS) {
    return Math.round(((temp - 32) * 5 / 9) * 10) / 10;
  }

  return Math.round(temp * 10) / 10;
};

export {
  TemperatureUnits,
  TemperatureUnit,
  convertTemperature,
};