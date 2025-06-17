import { lightShade, darkShade, maroon, INACTIVE_SENSOR_COLORS } from '../../Themes/CustomColors';
import { colors } from '@mui/material';
import ThemePreferences from '../../Themes/ThemePreferences';
import { DataTypeKeys, DataTypes } from './DataTypes';
import { SensorStatus } from '../../Components/AirQuality/SensorStatus';

export const AQI_Database = [
  {
    id: 0,
    category: 'Good',
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
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
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    },
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
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    },
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
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    },
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
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    },
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
    color: {
      Light: maroon[lightShade],
      Dark: maroon[darkShade]
    },
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

// From https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf
export const VOC_Database = [
  {
    id: 0,
    category: 'Excellent',
    rawVOC: {
      low: 0,
      high: 50
    },
    color: {
      Light: colors.lightBlue[lightShade],
      Dark: colors.lightBlue[darkShade]
    }
  },
  {
    id: 1,
    category: 'Good',
    rawVOC: {
      low: 51,
      high: 100
    },
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    }
  },
  {
    id: 2,
    category: 'Lightly Polluted',
    rawVOC: {
      low: 101,
      high: 150
    },
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    }
  },
  {
    id: 3,
    category: 'Moderately Polluted',
    rawVOC: {
      low: 151,
      high: 200
    },
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    }
  },
  {
    id: 4,
    category: 'Heavily Polluted',
    rawVOC: {
      low: 201,
      high: 250
    },
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    }
  },
  {
    id: 5,
    category: 'Severely Polluted',
    rawVOC: {
      low: 251,
      high: 350
    },
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    }
  },
  {
    id: 5,
    category: 'Extremely Polluted',
    rawVOC: {
      low: 351,
      high: Infinity
    },
    color: {
      Light: maroon[lightShade],
      Dark: maroon[darkShade]
    }
  }
];

// heat_index_F original categorization is in Farenheit; we convert it to heat_index_C for the gradient as well
export const HeatIndex_Database = [
  {
    id: 0,
    category: 'No Caution',
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
    heat_index_F: {
      low: 32,
      high: 80
    },
    heat_index_C: {
      low: 0,
      high: 26.7
    },
    description: 'No special precautions needed. Comfortable conditions for most people.',
    healthSuggestions: {
      outdoors: 'Enjoy outdoor activities as usual.',
      indoors_generic: 'No special precautions needed.',
      indoors_vulnerable: 'No special precautions needed.'
    }
  },
  {
    id: 1,
    category: 'Caution',
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    },
    heat_index_F: {
      low: 80.1,
      high: 90
    },
    heat_index_C: {
      low: 26.7,
      high: 32.2
    },
    description: 'Fatigue possible with prolonged exposure and physical activity.',
    healthSuggestions: {
      outdoors: 'Take breaks in the shade and stay hydrated.',
      indoors_generic: 'Ensure good ventilation and stay hydrated.',
      indoors_vulnerable: 'Monitor for signs of heat stress.'
    }
  },
  {
    id: 2,
    category: 'Extreme Caution',
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    },
    heat_index_F: {
      low: 90.1,
      high: 105
    },
    heat_index_C: {
      low: 32.3,
      high: 40.6
    },
    description: 'Heat cramps and heat exhaustion possible with prolonged exposure and/or physical activity.',
    healthSuggestions: {
      outdoors: 'Limit strenuous outdoor activities. Take frequent breaks.',
      indoors_generic: 'Use fans or air conditioning if available.',
      indoors_vulnerable: 'Check on vulnerable individuals regularly.'
    }
  },
  {
    id: 3,
    category: 'Danger',
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    },
    heat_index_F: {
      low: 105.1,
      high: 130
    },
    heat_index_C: {
      low: 40.6,
      high: 54.4
    },
    description: 'Heat cramps and heat exhaustion likely; heat stroke possible with prolonged exposure and/or physical activity.',
    healthSuggestions: {
      outdoors: 'Avoid strenuous activities. Stay in the shade or indoors.',
      indoors_generic: 'Use air conditioning. Stay hydrated.',
      indoors_vulnerable: 'Extreme caution for elderly, children, and those with health conditions.'
    }
  },
  {
    id: 4,
    category: 'Extreme Danger',
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    },
    heat_index_F: {
      low: 130.1,
      high: 180
    },
    heat_index_C: {
      low: 54.5,
      high: 82.2
    },
    description: 'Heat stroke highly likely with continued exposure.',
    healthSuggestions: {
      outdoors: 'Avoid all outdoor activities. Seek cool environments immediately.',
      indoors_generic: 'Stay in air-conditioned spaces. Drink plenty of fluids.',
      indoors_vulnerable: 'Immediate action required to prevent heat stroke.'
    }
  }
];

export const getCategoryColorAxis = ({ themePreference = ThemePreferences.light, dataTypeKey, isGradient }) => {
  const dataType = DataTypes[dataTypeKey];
  const thresholdMappingName = dataType.threshold_mapping_name;

  let database;
  let defaultValueForAlert;
  switch (dataTypeKey) {
    case DataTypeKeys.voc:
      database = VOC_Database;
      defaultValueForAlert = database[3][thresholdMappingName].high;
      break;
    case DataTypeKeys.heat_index_C:
      database = HeatIndex_Database;
      defaultValueForAlert = database[2][thresholdMappingName].high;
      break;
    default:
      database = AQI_Database;
      defaultValueForAlert = database[3][thresholdMappingName].high;
  }

  // Return an object with a color gradient of colors associated with different categories for this dataType
  if (isGradient) {
    // If the minimum value is -Infinity, set it to a reasonable finite value (e.g., 0) for gradient axis
    let minValue = database[0][thresholdMappingName].low;
    if (minValue === -Infinity) {
      minValue = 0;
    }
    let maxValue = database[database.length - 1][thresholdMappingName].high;

    let secondHighestCategoryRange;
    if (maxValue === Infinity) {
      // just stack another interval of the next lower category if the highest category has an Infinity high threshold
      secondHighestCategoryRange = (database[database.length - 2][thresholdMappingName].high - database[database.length - 2][thresholdMappingName].low);
      maxValue = database[database.length - 2][thresholdMappingName].high + secondHighestCategoryRange;
    }

    return (
      {
        minValue,
        maxValue,
        defaultValueForAlert,
        gradientSteps: dataType.gradient_steps,
        colors: database.flatMap(category => {
          const lowOffset = category[thresholdMappingName].low;
          let highOffset = category[thresholdMappingName].high;

          if (category[thresholdMappingName].high === Infinity) highOffset = maxValue;

          return [
            { color: category.color[themePreference], offset: lowOffset },
            { color: category.color[themePreference], offset: highOffset }
          ]
        })
      }
    )
  }

  // Just return an array with colors associated with different categories for this dataType
  else {
    const colorArray = database.map(category => category.color[themePreference]);
    const noDataColor = colors.grey[themePreference === ThemePreferences.dark ? darkShade + 400 : lightShade - 300];
    colorArray.push(noDataColor);

    return colorArray;
  }
}

export const getTextColorsForAQI = ({ themePreference = ThemePreferences.light }) => {
  const obj = AQI_Database
    .reduce((acc, category) => {
      return ({
        ...acc,
        [category.category]: category.color[themePreference]
      })
    }, {});

  obj[SensorStatus.offline] = INACTIVE_SENSOR_COLORS[themePreference];
  obj.screen = INACTIVE_SENSOR_COLORS.screen;

  return obj;
}