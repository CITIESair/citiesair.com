import { lightShade, darkShade, maroon } from '../../Themes/CustomColors';
import { colors } from '@mui/material';
import { DataTypeKeys, type DataTypeKey } from '../data-types/data-type.types';
import type { BaseCategory } from './air-quality.types';
import { assertNever } from '../../shared/utils/assertNever';

// --- Return types for getCategoryColorAxis ---

interface GradientColorStep {
  color: string;
  offset: number;
}

export interface GradientColorAxisResult {
  minValue: number;
  maxValue: number;
  defaultValueForAlert: number;
  defaultValueForChildAlert: number;
  gradientSteps: number;
  colors: GradientColorStep[];
}

export const AQI_Database: BaseCategory[] = [
  {
    id: 0,
    category: { en: 'Good', lg: 'Mulungi' },
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
    [DataTypeKeys.aqi]: {
      low: 0,
      high: 50
    },
    [DataTypeKeys.pm2_5]: {
      low: 0.0,
      high: 9.0
    },
    [DataTypeKeys.pm10_raw]: {
      low: 0.0,
      high: 54
    },
    description: 'Air quality is satisfactory, and air pollution poses little or no risk',
    healthSuggestions: {
      outdoors: {
        en: 'Enjoy outdoor activities, the air is great!', lg: 'Nyumirwa byokola nga oli bweru, empewo nungi nnyo'
      },
      indoors_generic: 'Enjoy clean indoor air',
      indoors_dining_hall: 'Enjoy clean dining hall air',
      indoors_gym: 'Enjoy clean air for physical activities indoors',
      indoors_vulnerable: 'Enjoy clean indoor air'
    }
  },
  {
    id: 1,
    category: { en: 'Moderate', lg: 'Ekigero' },
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    },
    [DataTypeKeys.aqi]: {
      low: 51,
      high: 100
    },
    [DataTypeKeys.pm2_5]: {
      low: 9.1,
      high: 35.4
    },
    [DataTypeKeys.pm10_raw]: {
      low: 55,
      high: 154
    },
    description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution',
    healthSuggestions: {
      outdoors: {
        en: 'Children and individuals with respiratory issues might need to reduce prolonged outdoor exertion', lg: "Abaana n'abantu abalina obuzibu mu kussa bandyetaaga okukendeeza ku budde bwebamala ebweeru"
      },
      indoors_generic: 'Indoor air is acceptable, but not great',
      indoors_dining_hall: 'Indoor air is acceptable, but not great<br>Avoid Grill area',
      indoors_gym: 'Indoor air is acceptable, but not great',
      indoors_vulnerable: 'Indoor air is acceptable, but not great'
    }
  },
  {
    id: 2,
    category: { en: 'Unhealthy for Sensitive Groups', lg: 'Gwabulabe Eri Abantu Abamu' },
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    },
    [DataTypeKeys.aqi]: {
      low: 101,
      high: 150
    },
    [DataTypeKeys.pm2_5]: {
      low: 35.5,
      high: 55.4
    },
    [DataTypeKeys.pm10_raw]: {
      low: 155,
      high: 254
    },
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected',
    healthSuggestions: {
      outdoors: {
        en: 'Children and individuals with respiratory issues should limit outdoor exertion', lg: "Abaana ne bassekinoomu abalina obuzibu mu kussa balina okukendeeza obudde bwebamala ebweru w'ebizimbe"
      },
      indoors_generic: 'Prolonged exposure to this indoor air quality level is not healthy for sensitive individuals.',
      indoors_dining_hall: 'Consider take-aways<br>Avoid Grill area',
      indoors_gym: 'Individuals with respiratory issues should lower the intensity of indoor exercises',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 3,
    category: { en: 'Unhealthy', lg: 'Gwabulabe' },
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    },
    [DataTypeKeys.aqi]: {
      low: 151,
      high: 200
    },
    [DataTypeKeys.pm2_5]: {
      low: 55.5,
      high: 125.4
    },
    [DataTypeKeys.pm10_raw]: {
      low: 255,
      high: 354
    },
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects',
    healthSuggestions: {
      outdoors: {
        en: 'Everyone should limit outdoor activities<br>Wear masks when going outside', lg: "Buli muntu akendeze ku byakolera ebweru w'enju<br>Wandyambedde masiki nga oli bweru"
      },
      indoors_generic: 'Prolonged exposure to this indoor air quality level is not healthy for anyone.',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Everyone should lower the intensity of indoor exercises',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 4,
    category: { en: 'Very Unhealthy', lg: 'Gwabulabe Nnyo' },
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    },
    [DataTypeKeys.aqi]: {
      low: 201,
      high: 300
    },
    [DataTypeKeys.pm2_5]: {
      low: 125.5,
      high: 225.4
    },
    [DataTypeKeys.pm10_raw]: {
      low: 355,
      high: 424
    },
    description: 'Health alert: The risk of health effects is increased for everyone',
    healthSuggestions: {
      outdoors: {
        en: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside', lg: 'Okulabula eri obulamu: Obulabe eri obulamu bweyongedde eri buli muntu'
      },
      indoors_generic: 'Exposure to this indoor air quality level is not healthy for anyone.',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Indoor air quality is not suitable for any physical activities',
      indoors_vulnerable: 'Monitor closely individuals with respiratory issues for any symptom'
    }
  },
  {
    id: 5,
    category: { en: 'Hazardous', lg: 'Gwabulabe' },
    color: {
      Light: maroon[lightShade],
      Dark: maroon[darkShade]
    },
    [DataTypeKeys.aqi]: {
      low: 301,
      high: Infinity
    },
    [DataTypeKeys.pm2_5]: {
      low: 225.5,
      high: Infinity
    },
    [DataTypeKeys.pm10_raw]: {
      low: 425,
      high: Infinity
    },
    description: 'Health warning of emergency conditions: everyone is more likely to be affected',
    healthSuggestions: {
      outdoors: { en: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside', lg: "Okulabula eri okwamangu eri eby'obulamu: Buli bulamu bw'omuntu bwandikosebwa" },
      indoors_generic: 'Exposure to this indoor air quality level is not healthy for anyone.',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Indoor air quality is not suitable for any physical activities',
      indoors_vulnerable: ''
    }
  },
];

export const CO2_Database: BaseCategory[] = [
  {
    id: 0,
    category: 'Good',
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
    [DataTypeKeys.co2]: {
      low: 0,
      high: 700
    },
    description: 'CO2 level is excellent. No health effects expected.',
    healthSuggestions: {
      outdoors: 'Enjoy outdoor activities, CO2 level is great!',
      indoors_generic: 'Indoor CO2 level is safe, enjoy.',
      indoors_dining_hall: 'Indoor air is great for dining. Enjoy your meal!',
      indoors_gym: 'Indoor CO2 level is ideal for physical activities.',
      indoors_vulnerable: 'CO2 level is safe for everyone, including sensitive groups.'
    }
  },
  {
    id: 1,
    category: 'Moderate',
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    },
    [DataTypeKeys.co2]: {
      low: 701,
      high: 1000
    },
    description: 'CO2 level is acceptable but may cause slight discomfort for sensitive individuals.',
    healthSuggestions: {
      outdoors: 'CO2 level is acceptable. Enjoy outdoor activities.',
      indoors_generic: 'CO2 levels indoor is acceptable but pay attention to good ventilation.',
      indoors_dining_hall: 'Consider sitting in well-ventilated areas for comfort.',
      indoors_gym: 'CO2 level is moderate. Consider taking breaks during exercise.',
      indoors_vulnerable: 'Sensitive groups may feel slight discomfort. Ensure good airflow indoors.'
    }
  },
  {
    id: 2,
    category: 'Unhealthy for Sensitive Groups',
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    },
    [DataTypeKeys.co2]: {
      low: 1001,
      high: 1500
    },
    description: 'Sensitive individuals may experience discomfort due to higher CO2 levels.',
    healthSuggestions: {
      outdoors: 'Sensitive individuals may need to take short breaks outdoors.',
      indoors_generic: 'Ensure good ventilation indoors, as CO2 levels may cause discomfort.',
      indoors_dining_hall: 'Sensitive individuals should avoid crowded dining areas.',
      indoors_gym: 'Take breaks during intense activities. Ventilate the space well.',
      indoors_vulnerable: 'Monitor air quality closely and ventilate, particularly for individuals with respiratory issues.'
    }
  },
  {
    id: 3,
    category: 'Unhealthy',
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    },
    [DataTypeKeys.co2]: {
      low: 1501,
      high: 2000
    },
    description: 'CO2 level is high and may cause noticeable discomfort for many people, such as dizziness and reduced cognitive functions.',
    healthSuggestions: {
      outdoors: 'Reduce outdoor activities if you experience discomfort.',
      indoors_generic: 'Consider ventilating indoor spaces more frequently to reduce CO2 levels. Open windows if outdoor air quality is not poor.',
      indoors_dining_hall: 'Avoid crowded areas and ensure the dining hall is well-ventilated.',
      indoors_gym: 'Limit the intensity of physical activities indoors due to CO2 buildup. Open windows if outdoor air quality is not poor.',
      indoors_vulnerable: 'Sensitive groups should limit time in areas with poor ventilation. Open windows if outdoor air quality is not poor'
    }
  },
  {
    id: 4,
    category: 'Very Unhealthy',
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    },
    [DataTypeKeys.co2]: {
      low: 2001,
      high: 3000
    },
    description: 'CO2 level is very high, and health effect is likely for everyone, such as dizziness and reduced cognitive functions. Indoor air is likely to have a stale smell.',
    healthSuggestions: {
      outdoors: 'Limit outdoor exposure if you feel uncomfortable or lightheaded.',
      indoors_generic: 'Improve ventilation by opening windows or consider moving to a different area with better air quality.',
      indoors_dining_hall: 'Avoid dining in areas with poor ventilation; consider takeaways. Open windows.',
      indoors_gym: 'It is unsafe for strenuous activities indoors. Reduce or avoid exercise. Open windows.',
      indoors_vulnerable: 'Move vulnerable individuals to areas with better air quality and ventilation. Open windows.'
    }
  },
  {
    id: 5,
    category: 'Hazardous',
    color: {
      Light: maroon[lightShade],
      Dark: maroon[darkShade]
    },
    [DataTypeKeys.co2]: {
      low: 3001,
      high: Infinity
    },
    description: 'CO2 level is dangerously high, and everyone is at risk of health effects, such as dizziness and reduced cognitive functions. Indoor air is likely to have a stale smell.',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities as much as possible if CO2 levels remain this high.',
      indoors_generic: 'Avoid staying in poorly ventilated areas; seek fresh air immediately. Open windows.',
      indoors_dining_hall: 'Do not stay in the dining hall. Get food to go and seek better air quality. Open windows.',
      indoors_gym: 'Physical activity is not safe indoors at these CO2 levels. Open windows.',
      indoors_vulnerable: 'Vulnerable individuals should be evacuated to safer environments immediately. Open windows to ventilate indoor spaces.'
    }
  }
];

// From https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf
export const VOC_Database: BaseCategory[] = [
  {
    id: 0,
    category: 'Excellent',
    [DataTypeKeys.voc]: {
      low: 0,
      high: 50
    },
    color: {
      Light: colors.lightBlue[lightShade],
      Dark: colors.lightBlue[darkShade]
    },
    description: 'VOC level is excellent. No health effects expected.',
    healthSuggestions: {
      outdoors: 'Enjoy outdoor activities, VOC level is great!',
      indoors_generic: 'Indoor VOC level is safe, enjoy.',
      indoors_dining_hall: 'Indoor air is great for dining. Enjoy your meal!',
      indoors_gym: 'Indoor VOC level is ideal for physical activities.',
      indoors_vulnerable: 'VOC level is safe for everyone, including sensitive groups.'
    }
  },
  {
    id: 1,
    category: 'Good',
    [DataTypeKeys.voc]: {
      low: 51,
      high: 100
    },
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
    description: 'VOC level is excellent. No health effects expected.',
    healthSuggestions: {
      outdoors: 'Enjoy outdoor activities, VOC level is great!',
      indoors_generic: 'Indoor VOC level is safe, enjoy.',
      indoors_dining_hall: 'Indoor air is great for dining. Enjoy your meal!',
      indoors_gym: 'Indoor VOC level is ideal for physical activities.',
      indoors_vulnerable: 'VOC level is safe for everyone, including sensitive groups.'
    }
  },
  {
    id: 2,
    category: 'Lightly Polluted',
    [DataTypeKeys.voc]: {
      low: 101,
      high: 150
    },
    color: {
      Light: "#ffb600",
      Dark: colors.yellow[darkShade + 200]
    },
    description: 'VOC level is acceptable but may cause slight discomfort for sensitive individuals.',
    healthSuggestions: {
      outdoors: 'VOC level is acceptable. Enjoy outdoor activities.',
      indoors_generic: 'VOC levels indoor is acceptable but pay attention to good ventilation.',
      indoors_dining_hall: 'Consider sitting in well-ventilated areas for comfort.',
      indoors_gym: 'VOC level is moderate. Consider taking breaks during exercise.',
      indoors_vulnerable: 'Sensitive groups may feel slight discomfort. Ensure good airflow indoors.'
    }
  },
  {
    id: 3,
    category: 'Moderately Polluted',
    [DataTypeKeys.voc]: {
      low: 151,
      high: 200
    },
    color: {
      Light: colors.orange[lightShade],
      Dark: colors.orange[darkShade]
    },
    description: 'Sensitive individuals may experience discomfort due to higher VOC levels.',
    healthSuggestions: {
      outdoors: 'Sensitive individuals may need to take short breaks outdoors.',
      indoors_generic: 'Ensure good ventilation indoors, as VOC levels may cause discomfort.',
      indoors_dining_hall: 'Sensitive individuals should avoid crowded dining areas.',
      indoors_gym: 'Take breaks during intense activities. Ventilate the space well.',
      indoors_vulnerable: 'Monitor air quality closely and ventilate, particularly for individuals with respiratory issues.'
    }
  },
  {
    id: 4,
    category: 'Heavily Polluted',
    [DataTypeKeys.voc]: {
      low: 201,
      high: 250
    },
    color: {
      Light: colors.red[lightShade],
      Dark: colors.red[darkShade]
    },
    description: 'VOC level is high and may cause noticeable discomfort for many people, such as dizziness and reduced cognitive functions.',
    healthSuggestions: {
      outdoors: 'Reduce outdoor activities if you experience discomfort.',
      indoors_generic: 'Consider ventilating indoor spaces more frequently to reduce VOC levels. Open windows if outdoor air quality is not poor.',
      indoors_dining_hall: 'Avoid crowded areas and ensure the dining hall is well-ventilated.',
      indoors_gym: 'Limit the intensity of physical activities indoors due to VOC buildup. Open windows if outdoor air quality is not poor.',
      indoors_vulnerable: 'Sensitive groups should limit time in areas with poor ventilation. Open windows if outdoor air quality is not poor'
    }
  },
  {
    id: 5,
    category: 'Severely Polluted',
    [DataTypeKeys.voc]: {
      low: 251,
      high: 350
    },
    color: {
      Light: colors.purple[lightShade],
      Dark: colors.purple[darkShade]
    },
    description: 'VOC level is very high, and health effect is likely for everyone, such as dizziness and reduced cognitive functions. Indoor air is likely to have a stale smell.',
    healthSuggestions: {
      outdoors: 'Limit outdoor exposure if you feel uncomfortable or lightheaded.',
      indoors_generic: 'Improve ventilation by opening windows or consider moving to a different area with better air quality.',
      indoors_dining_hall: 'Avoid dining in areas with poor ventilation; consider takeaways. Open windows.',
      indoors_gym: 'It is unsafe for strenuous activities indoors. Reduce or avoid exercise. Open windows.',
      indoors_vulnerable: 'Move vulnerable individuals to areas with better air quality and ventilation. Open windows.'
    }
  },
  {
    id: 6,
    category: 'Extremely Polluted',
    [DataTypeKeys.voc]: {
      low: 351,
      high: Infinity
    },
    color: {
      Light: maroon[lightShade],
      Dark: maroon[darkShade]
    },
    description: 'VOC level is dangerously high, and everyone is at risk of health effects, such as dizziness and reduced cognitive functions. Indoor air is likely to have a stale smell.',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities as much as possible if VOC levels remain this high.',
      indoors_generic: 'Avoid staying in poorly ventilated areas; seek fresh air immediately. Open windows.',
      indoors_dining_hall: 'Do not stay in the dining hall. Get food to go and seek better air quality. Open windows.',
      indoors_gym: 'Physical activity is not safe indoors at these VOC levels. Open windows.',
      indoors_vulnerable: 'Vulnerable individuals should be evacuated to safer environments immediately. Open windows to ventilate indoor spaces.'
    }
  }
];

// heat_index_F original categorization is in Fahrenheit; we convert it to heat_index_C for the gradient as well
export const HeatIndex_Database: BaseCategory[] = [
  {
    id: 0,
    category: 'No Caution',
    color: {
      Light: colors.green[lightShade],
      Dark: colors.green[darkShade]
    },
    heat_index_F: {
      low: -Infinity,
      high: 80
    },
    [DataTypeKeys.heat_index_C]: {
      low: -Infinity,
      high: 26.7
    },
    description: 'No special precautions needed. Comfortable conditions for most people.',
    healthSuggestions: {
      outdoors: { en: 'Enjoy outdoor activities as usual.', lg: 'Placeholder' },
      indoors_generic: 'No special precautions needed.',
      indoors_dining_hall: 'No special precautions needed.',
      indoors_gym: 'No special precautions needed.',
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
    [DataTypeKeys.heat_index_C]: {
      low: 26.7,
      high: 32.2
    },
    description: 'Fatigue possible with prolonged exposure and physical activity.',
    healthSuggestions: {
      outdoors: { en: 'Take breaks in the shade and stay hydrated.', lg: 'Placeholder' },
      indoors_generic: 'Ensure good ventilation and stay hydrated.',
      indoors_dining_hall: 'Stay hydrated and avoid prolonged stays in warm areas.',
      indoors_gym: 'Reduce exercise intensity and take frequent breaks.',
      indoors_vulnerable: 'Monitor vulnerable individuals for signs of heat stress.'
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
    [DataTypeKeys.heat_index_C]: {
      low: 32.3,
      high: 40.5
    },
    description: 'Heat cramps and heat exhaustion possible with prolonged exposure and/or physical activity.',
    healthSuggestions: {
      outdoors: { en: 'Limit strenuous outdoor activities. Take frequent breaks.', lg: 'Placeholder' },
      indoors_generic: 'Use fans or air conditioning if available.',
      indoors_dining_hall: 'Avoid prolonged stays in warm dining areas.',
      indoors_gym: 'Limit exercise intensity and duration.',
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
    [DataTypeKeys.heat_index_C]: {
      low: 40.6,
      high: 54.4
    },
    description: 'Heat cramps and heat exhaustion likely; heat stroke possible with prolonged exposure and/or physical activity.',
    healthSuggestions: {
      outdoors: { en: 'Avoid strenuous activities. Stay in the shade or indoors.', lg: 'Placeholder' },
      indoors_generic: 'Use air conditioning. Stay hydrated.',
      indoors_dining_hall: 'Avoid warm or crowded dining areas.',
      indoors_gym: 'Avoid indoor exercise.',
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
      high: Infinity
    },
    [DataTypeKeys.heat_index_C]: {
      low: 54.5,
      high: Infinity
    },
    description: 'Heat stroke highly likely with continued exposure.',
    healthSuggestions: {
      outdoors: { en: 'Avoid all outdoor activities. Seek cool environments immediately.', lg: 'Placeholder' },
      indoors_generic: 'Stay in air-conditioned spaces. Drink plenty of fluids.',
      indoors_dining_hall: 'Avoid dining in warm environments.',
      indoors_gym: 'All physical activity is unsafe.',
      indoors_vulnerable: 'Immediate action required to prevent heat stroke.'
    }
  }
];

export const getCategoryDatabaseForDataType = (
  dataType: DataTypeKey
): BaseCategory[] | null => {
  switch (dataType) {
    case DataTypeKeys.aqi:
    case DataTypeKeys.pm2_5:
    case DataTypeKeys.pm10_raw:
      return AQI_Database;

    case DataTypeKeys.co2:
      return CO2_Database;

    case DataTypeKeys.voc:
      return VOC_Database;

    case DataTypeKeys.heat_index_C:
      return HeatIndex_Database;

    // Those without categories (continuous data type)
    case DataTypeKeys.temperature_C:
    case DataTypeKeys.rel_humidity:
    case DataTypeKeys.pressure:
      return null;

    default:
      return assertNever(dataType);
  }
};


