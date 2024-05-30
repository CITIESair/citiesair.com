import CustomThemes from '../../Themes/CustomThemes';

const AQIdatabase = [
  {
    id: 0,
    category: 'Good',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[0],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[0],
    aqiUS: {
      low: 0,
      high: 50
    },
    rawPM2_5: {
      low: 0.0,
      high: 9.0
    },
    rawPM10: {
      low: 0.0,
      high: 54
    },
    rawCO2: {
      low: 0.0,
      high: 700
    },
    description: 'Air quality is satisfactory, and air pollution poses little or no risk',
    healthSuggestions: {
      outdoors: 'Enjoy outdoor activities, the air is great!',
      indoors_generic: 'Enjoy clean indoor air',
      indoors_dining_hall: 'Enjoy clean dining hall air',
      indoors_gym: 'Enjoy clean air for physical activities indoors',
      indoors_vulnerable: 'Enjoy clean indoor air'
    }
  },
  {
    id: 1,
    category: 'Moderate',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[1],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[1],
    aqiUS: {
      low: 51,
      high: 100
    },
    rawPM2_5: {
      low: 9.1,
      high: 35.4
    },
    rawPM10: {
      low: 55,
      high: 154
    },
    rawCO2: {
      low: 701,
      high: 1000
    },
    description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
    healthSuggestions: {
      outdoors: 'Children and individuals with respiratory issues might need to reduce prolonged outdoor exertion',
      indoors_generic: 'Indoor air is acceptable, but not great',
      indoors_dining_hall: 'Indoor air is acceptable, but not great<br>Avoid Grill area',
      indoors_gym: 'Indoor air is acceptable, but not great',
      indoors_vulnerable: 'Indoor air is acceptable, but not great'
    }
  },
  {
    id: 2,
    category: 'Unhealthy for Sensitive Groups',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[2],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[2],
    aqiUS: {
      low: 101,
      high: 150
    },
    rawPM2_5: {
      low: 35.5,
      high: 55.4
    },
    rawPM10: {
      low: 155,
      high: 254
    },
    rawCO2: {
      low: 1001,
      high: 1500
    },
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected',
    healthSuggestions: {
      outdoors: 'Children and individuals with respiratory issues should limit outdoor exertion',
      indoors_dining_hall: 'Consider take-aways<br>Avoid Grill area',
      indoors_gym: 'Individuals with respiratory issues should lower the intensity of indoor exercises',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 3,
    category: 'Unhealthy',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[3],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[3],
    aqiUS: {
      low: 151,
      high: 200
    },
    rawPM2_5: {
      low: 55.5,
      high: 125.4
    },
    rawPM10: {
      low: 255,
      high: 354
    },
    rawCO2: {
      low: 1501,
      high: 2000
    },
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects',
    healthSuggestions: {
      outdoors: 'Everyone should limit outdoor activities<br>Wear masks when going outside',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Everyone should lower the intensity of indoor exercises',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 4,
    category: 'Very Unhealthy',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[4],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[4],
    aqiUS: {
      low: 201,
      high: 300
    },
    rawPM2_5: {
      low: 125.5,
      high: 225.4
    },
    rawPM10: {
      low: 355,
      high: 424
    },
    rawCO2: {
      low: 2001,
      high: 3000
    },
    description: 'Health alert: The risk of health effects is increased for everyone',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Indoor air quality is not suitable for any physical activities',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 5,
    category: 'Hazardous',
    lightThemeColor: CustomThemes.light.palette.chart.optionsColors.aqi[5],
    darkThemeColor: CustomThemes.dark.palette.chart.optionsColors.aqi[5],
    aqiUS: {
      low: 301,
      high: Infinity
    },
    rawPM2_5: {
      low: 225.5,
      high: Infinity
    },
    rawPM10: {
      low: 425,
      high: Infinity
    },
    rawCO2: {
      low: 3001,
      high: Infinity
    },
    description: 'Health warning of emergency conditions: everyone is more likely to be affected',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Indoor air quality is not suitable for any physical activities',
      indoors_vulnerable: ''
    }
  },
];

export const AQIDataTypes = {
  aqi: {
    name: "Air Quality Index (US)",
    name_short: "AQI",
    unit: ""
  },
  pm1: {
    name: "Particulate matter smaller than 1μm",
    name_short: "PM1",
    unit: "μg/m3"
  },
  pm2_5: {
    name: "Particulate matter smaller than 2.5μm",
    name_short: "PM2.5",
    unit: "μg/m3"
  },
  pm10: {
    name: "Particulate matter smaller than 10μm",
    name_short: "PM10",
    unit: "μg/m3"
  },
  co2: {
    name: "Carbon Dioxide",
    name_short: "CO2",
    unit: "PPM"
  },
  voc: {
    name: "Volatile Organic Compounds",
    name_short: "VOC",
    unit: ""
  },
  temperature: {
    name: "Temperature",
    name_short: "T°",
    unit: "°C"
  },
  humidity: {
    name: "Relative humidity",
    name_short: "%RH",
    unit: "%"
  }
};

export default AQIdatabase;
