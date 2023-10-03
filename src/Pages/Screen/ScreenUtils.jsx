// ---------- Sensor status
export const SensorStatus = {
  active: "active",
  temporaryOffline: "temporaryOffline",
  offline: "offline"
};

const SensorStatusCriteria = [
  {
    name: SensorStatus.active,
    cutoffInHours: {
      low: 0,
      high: 2
    }
  },
  {
    name: SensorStatus.temporaryOffline,
    cutoffInHours: {
      low: 3,
      high: 6
    }
  },
  {
    name: SensorStatus.offline,
    cutoffInHours: {
      low: 7,
      high: Infinity
    }
  }
];

export const calculateSensorStatus = (lastSeenInHours) => {
  for (let i = 0; i < SensorStatusCriteria.length; i++) {
    const category = SensorStatusCriteria[i];
    if (category.cutoffInHours.low <= lastSeenInHours && lastSeenInHours <= category.cutoffInHours.high) {
      return category.name;
    }
  }
}

export const returnSensorStatus = (currentDataForSensor) => {
  switch (currentDataForSensor.sensor_status) {
    case SensorStatus.active:
      return null;
    case SensorStatus.temporaryOffline:
      return `Last seen: ${currentDataForSensor.lastSeen}h ago`;
    case SensorStatus.offline:
      return "Sensor offline";
    default:
      return null;
  }
}

// ---------- Temperature conversion
// Converts a temperature in Fahrenheit to Celsius
export function fahrenheitToCelsius(tempF) {
  let tempC = (tempF - 32) * (5 / 9);
  return Math.round(tempC);
}
// Converts a temperature in Celsius to Fahrenheit
export function celsiusToFahrenheit(tempC) {
  let tempF = (tempC * (9 / 5)) + 32;
  return Math.round(tempF);
}

// -------- Heat index calculation
// Define the heat index categories and their thresholds
const heatIndexCategories = [
  { name: "Caution", threshold: 90 },
  { name: "Extreme Caution", threshold: 105 },
  { name: "Danger", threshold: 130 },
  { name: "Extreme Danger", threshold: Infinity },
];
// Calculate heat index temperature and return the category
export function calculateHeatIndex({ tempF, rel_humidity, shouldReturnFahrenheit }) {
  // Make sure the input values are valid
  if (tempF < 80 || rel_humidity < 0 || rel_humidity > 100) return null;

  // Calculate the heat index using the formula
  let heatIndexF = -42.379 +
    (2.04901523 * tempF) +
    (10.14333127 * rel_humidity) -
    (0.22475541 * tempF * rel_humidity) -
    (0.00683783 * tempF * tempF) -
    (0.05481717 * rel_humidity * rel_humidity) +
    (0.00122874 * tempF * tempF * rel_humidity) +
    (0.00085282 * tempF * rel_humidity * rel_humidity) -
    (0.00000199 * tempF * tempF * rel_humidity * rel_humidity);

  // Find the appropriate category for the calculated heat index
  const category = heatIndexCategories.find((c) => heatIndexF < c.threshold);

  // Return an object with the heat index and the category name
  return { heatIndex: shouldReturnFahrenheit ? tempF : fahrenheitToCelsius(heatIndexF), category: category.name };
}


// ----- Misc
export const capitalizeFirstCharacter = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1);
