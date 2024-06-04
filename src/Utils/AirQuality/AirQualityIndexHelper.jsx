import { lightShade, darkShade, maroon } from '../../Themes/CustomColors';
import { colors } from '@mui/material';

const AQIdatabase = [
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
      Light: colors.yellow[lightShade + 100],
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

export const getAqiColorAxis = ({ themePreference, dataType }) => {
  const minValue = AQIdatabase[0][dataType].low;
  let maxValue = AQIdatabase[AQIdatabase.length - 1][dataType].high;

  let secondHighestCategoryRange;
  if (maxValue === Infinity) {
    // just stack another interval of the next lower category if the highest category has an Infinity high threshold
    secondHighestCategoryRange = (AQIdatabase[AQIdatabase.length - 2][dataType].high - AQIdatabase[AQIdatabase.length - 2][dataType].low);
    maxValue = AQIdatabase[AQIdatabase.length - 2][dataType].high + secondHighestCategoryRange;
  }

  return (
    {
      minValue,
      maxValue,
      colors: AQIdatabase.flatMap(category => {
        const lowOffset = category[dataType].low;
        let highOffset = category[dataType].high;

        if (category[dataType].high === Infinity) highOffset = maxValue;

        return [
          { color: category.color[themePreference], offset: lowOffset },
          { color: category.color[themePreference], offset: highOffset }
        ]
      })
    }
  )
}

export default AQIdatabase;
