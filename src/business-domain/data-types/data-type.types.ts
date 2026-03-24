export const DataTypeKeys = {
  aqi: "aqi",
  pm2_5: "pm2.5",
  pm10_raw: "pm10_raw",
  co2: "co2",
  voc: "voc",
  temperature_C: "temperature_C",
  pressure: "pressure",
  rel_humidity: "rel_humidity",
  heat_index_C: "heat_index_C"
} as const;

export type DataTypeKey = typeof DataTypeKeys[keyof typeof DataTypeKeys];

/**
 * Interface defining the properties for each data type.
 */
export interface DataType {
  name: string; // Full name
  name_short: string; // Short name
  name_title: string; // Title
  db_name?: string; // Maps the dataType to the column name in the database
  color_axis: string; // Used in the frontend to determine the color scheme used for rendering this datatype
  gradient_steps: number; // Used in the frontend to determine the number of gradient steps for the color axis
  unit: string; // Datatype's unit
  pattern: string; // Used in the frontend to determine number of decimal places, e.g #.# for 1 decimal place
  has_category: boolean; // If this datatype is categorizable (or continuous otherwise)
}

export const DataTypes: Record<DataTypeKey, DataType> = {
  [DataTypeKeys.heat_index_C]: {
    name: "Heat Index",
    name_short: "Heat Index",
    name_title: "Heat Index °C",
    color_axis: "heat_index_C",
    gradient_steps: 500,
    unit: "°C",
    pattern: "#.#",
    has_category: true
  },
  [DataTypeKeys.aqi]: {
    name: "Air Quality Index (US)",
    name_short: "AQI",
    name_title: "AQI",
    color_axis: "aqi",
    gradient_steps: 5000,
    unit: "",
    pattern: "#",
    has_category: true
  },
  [DataTypeKeys.pm2_5]: {
    name: "Particulate matter smaller than 2.5μm",
    name_short: "PM2.5",
    name_title: "PM2.5",
    db_name: "pm2.5",
    color_axis: "pm2.5",
    gradient_steps: 20000,
    unit: "μg/m3",
    pattern: "#.#",
    has_category: true
  },
  [DataTypeKeys.pm10_raw]: {
    name: "Particulate matter smaller than 10μm",
    name_short: "PM10",
    name_title: "PM10",
    db_name: "pm10_raw",
    color_axis: "pm10",
    gradient_steps: 2000,
    unit: "μg/m3",
    pattern: "#",
    has_category: true
  },
  [DataTypeKeys.co2]: {
    name: "Carbon Dioxide",
    name_short: "CO2",
    name_title: "CO2",
    db_name: "co2",
    color_axis: "co2",
    gradient_steps: 5000,
    unit: "PPM",
    pattern: "#",
    has_category: true
  },
  [DataTypeKeys.voc]: {
    name: "Volatile Organic Compounds",
    name_short: "VOC",
    name_title: "Volatile Organic Compounds",
    db_name: "voc",
    color_axis: "voc",
    gradient_steps: 5000,
    unit: "",
    pattern: "#",
    has_category: true
  },
  [DataTypeKeys.temperature_C]: {
    name: "Temperature",
    name_short: "Temp.",
    name_title: "Temperature °C",
    db_name: "temperature",
    color_axis: "temperature",
    gradient_steps: 20,
    unit: "°C",
    pattern: "#.#",
    has_category: false
  },
  // [DataTypeKeys.temperature_F]: {
  //   name: "Temperature",
  //   name_short: "Temp.",
  //   name_title: "Temperature °F",
  //   db_name: "temperature",
  //   color_axis: "temperature",
  //   gradient_steps: 20,
  //   unit: "°F",
  //   pattern: "#.#",
  //   has_category: false
  // },
  [DataTypeKeys.pressure]: {
    name: "Pressure",
    name_short: "Pressure",
    name_title: "Pressure",
    db_name: "pressure",
    color_axis: "pressure",
    gradient_steps: 100,
    unit: "hPa",
    pattern: "#.#",
    has_category: false
  },
  [DataTypeKeys.rel_humidity]: {
    name: "Relative Humidity",
    name_short: "RH",
    name_title: "Relative Humidity",
    db_name: "rel_humidity",
    color_axis: "humidity",
    gradient_steps: 100,
    unit: "%",
    pattern: "#.#",
    has_category: false
  }
};

export interface DataTypeWithKey extends DataType {
  key: DataTypeKey;
}
