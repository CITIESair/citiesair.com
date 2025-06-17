const DataTypesObj = {
  heat_index_C: {
    name: "Heat Index",
    name_short: "Heat Index",
    name_title: "Heat Index °C",
    threshold_mapping_name: "heat_index_C",
    color_axis: "heat_index_C",
    gradient_steps: 500,
    unit: "°C",
    pattern: "#.#"
  },
  aqi: {
    name: "Air Quality Index (US)",
    name_short: "AQI",
    name_title: "AQI",
    threshold_mapping_name: "aqiUS",
    color_axis: "aqi",
    gradient_steps: 5000,
    unit: "",
    pattern: "#"
  },
  "pm2.5": {
    name: "Particulate matter smaller than 2.5μm",
    name_short: "PM2.5",
    name_title: "PM2.5",
    db_name: "pm2.5",
    threshold_mapping_name: "rawPM2_5",
    color_axis: "pm2.5",
    gradient_steps: 20000,
    unit: "μg/m3",
    pattern: "#.#"
  },
  "pm10_raw": {
    name: "Particulate matter smaller than 10μm",
    name_short: "PM10",
    name_title: "PM10",
    db_name: "pm10_raw",
    color_axis: "pm10",
    gradient_steps: 2000,
    threshold_mapping_name: "rawPM10",
    unit: "μg/m3",
    pattern: "#"
  },
  co2: {
    name: "Carbon Dioxide",
    name_short: "CO2",
    name_title: "CO2",
    db_name: "co2",
    color_axis: "co2",
    gradient_steps: 5000,
    threshold_mapping_name: "rawCO2",
    unit: "PPM",
    pattern: "#"
  },
  voc: {
    name: "Volatile Organic Compounds",
    name_short: "VOC",
    name_title: "Volatile Organic Compounds",
    db_name: "voc",
    color_axis: "voc",
    gradient_steps: 5000,
    threshold_mapping_name: "rawVOC",
    unit: "",
    pattern: "#"
  },
  temperature_C: {
    name: "Temperature",
    name_short: "Temp.",
    name_title: "Temperature °C",
    db_name: "temperature",
    color_axis: "temperature",
    gradient_steps: 20,
    unit: "°C",
    pattern: "#.#"
  },
  temperature_F: {
    name: "Temperature",
    name_short: "Temp.",
    name_title: "Temperature °F",
    db_name: "temperature",
    color_axis: "temperature",
    gradient_steps: 20,
    unit: "°F",
    pattern: "#.#"
  },
  pressure: {
    name: "Pressure",
    name_short: "Pressure",
    name_title: "Pressure",
    db_name: "pressure",
    color_axis: "pressure",
    gradient_steps: 100,
    unit: "hPa",
    pattern: "#.#"
  },
  rel_humidity: {
    name: "Relative Humidity",
    name_short: "RH",
    name_title: "Relative Humidity",
    db_name: "rel_humidity",
    color_axis: "humidity",
    gradient_steps: 100,
    unit: "%",
    pattern: "#.#"
  }
}

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
}

// map DataTypeKeys to DataTypesObj
export const DataTypes = Object.entries(DataTypeKeys).reduce((acc, [key, value]) => {
  acc[value] = DataTypesObj[value];
  return acc;
}, {});

export const returnSelectedDataType = ({ dataTypeKey, dataTypes, showUnit = false }) => {
  return (dataTypes
    .filter(dataType => dataType.key === dataTypeKey)
    .map((dataType) => {
      if (showUnit) {
        const unitString = `${dataType.unit !== '' ? ` (${dataType.unit})` : ''}`;
        return `${dataType.name_short}${unitString}`;
      }
      else return dataType.name_short;
    })
  )
}