import CustomThemes from '../Themes/CustomThemes';

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
      high: 12.0
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
      low: 12.1,
      high: 35.4
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
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected',
    healthSuggestions: {
      outdoors: 'Children and individuals with respiratory issues should limit outdoor exertion',
      indoors_generic: '',
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
      high: 150.4
    },
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects',
    healthSuggestions: {
      outdoors: 'Everyone should limit outdoor activities<br>Wear masks when going outside',
      indoors_generic: '',
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
      low: 150.5,
      high: 250.4
    },
    description: 'Health alert: The risk of health effects is increased for everyone',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside',
      indoors_generic: '',
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
      low: 300,
      high: 500
    },
    rawPM2_5: {
      low: 250.5,
      high: 550.5
    },
    description: 'Health warning of emergency conditions: everyone is more likely to be affected',
    healthSuggestions: {
      outdoors: 'Avoid outdoor activities at all cost<br>Wear N95 masks when going outside',
      indoors_generic: '',
      indoors_dining_hall:
        'Consider take-aways<br>Avoid Grill area<br>Come back at off-peak hours',
      indoors_gym: 'Indoor air quality is not suitable for any physical activities',
      indoors_vulnerable: ''
    }
  },
];

export default AQIdatabase;
