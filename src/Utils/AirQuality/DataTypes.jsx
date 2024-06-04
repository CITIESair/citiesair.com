const AQIDataTypes = {
  aqi: {
    name: "Air Quality Index (US)",
    name_short: "AQI",
    name_title: "AQI",
    threshold_mapping_name: "aqiUS",
    color_axis: "aqi",
    unit: ""
  },
  // {
  //   name: "Particulate matter smaller than 1μm",
  //   name_short: "PM1",
  //   db_name: "pm1_raw",
  //   threshold_mapping_name: "rawPM1",
  //   unit: "μg/m3"
  // },
  "pm2.5": {
    name: "Particulate matter smaller than 2.5μm",
    name_short: "PM2.5",
    name_title: "PM2.5",
    db_name: "pm2.5",
    threshold_mapping_name: "rawPM2_5",
    color_axis: "pm2.5",
    unit: "μg/m3"
  },
  "pm10_raw": {
    name: "Particulate matter smaller than 10μm",
    name_short: "PM10",
    name_title: "PM10",
    db_name: "pm10_raw",
    color_axis: "pm10",
    threshold_mapping_name: "rawPM10",
    unit: "μg/m3"
  },
  co2: {
    name: "Carbon Dioxide",
    name_short: "CO2",
    name_title: "CO2",
    db_name: "co2",
    color_axis: "co2",
    threshold_mapping_name: "rawCO2",
    unit: "PPM"
  },
  voc: {
    name: "Volatile Organic Compounds",
    name_short: "VOC",
    name_title: "Volatile Organic Compounds",
    db_name: "voc",
    color_axis: "voc",
    threshold_mapping_name: "rawVOC",
    unit: ""
  },
  temperature_C: {
    name: "Temperature",
    name_short: "T°",
    name_title: "Temperature °C",
    db_name: "temperature",
    color_axis: "temperature",
    unit: "°C"
  },
  temperature_F: {
    name: "Temperature",
    name_short: "T°",
    name_title: "Temperature °F",
    db_name: "temperature",
    color_axis: "temperature",
    unit: "°F"
  },
  pressure: {
    name: "Pressure",
    name_short: "Pressure",
    name_title: "Pressure",
    db_name: "pressure",
    color_axis: "pressure",
    unit: "hPa"
  },
  rel_humidity: {
    name: "Relative Humidity",
    name_short: "RH",
    name_title: "Relative Humidity",
    db_name: "rel_humidity",
    color_axis: "humidity",
    unit: "%"
  }
}

export default AQIDataTypes;