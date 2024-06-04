/* eslint-disable max-len */
import { colors } from '@mui/material';
import ThemePreferences from './ThemePreferences';
import { getAqiColorAxis } from '../Utils/AirQuality/AirQualityIndexHelper';
import { darkShade, lightShade, maroon, darkShadeColorAxis } from './CustomColors';
import AQIDataTypes from '../Utils/AirQuality/DataTypes';

const getAQIPalette = ({ increasingOrder, isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  const array = [
    colors.green[shade],
    colors.yellow[isDark ? shade + 200 : shade],
    colors.orange[isDark ? shade : shade - 100],
    colors.red[shade],
    colors.purple[shade],
    maroon[shade]
  ];

  if (increasingOrder) {
    const noDataColor = colors.grey[isDark ? shade + 400 : shade - 300];
    array.push(noDataColor);
  } else {
    array.reverse();
  }

  return array;
};

const getCO2ColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  return (
    {
      minValue: 400,
      maxValue: 1500,
      colors: [
        { color: colors.green[shade], offset: 400 },
        { color: colors.yellow[shade], offset: 700 },
        { color: colors.orange[shade - 100], offset: 1000 },
        { color: colors.red[shade], offset: 1500 }
      ]
    }
  )
}

const getHumidityColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 0,
    maxValue: 100,
    colors: [
      colors.grey[shade],
      colors.blue[isDark ? darkShade + 100 : lightShade + 100]
    ]
  }
}

const getTemperatureColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 0,
    maxValue: 50,
    colors: [
      {
        color: colors.lightBlue[shade],
        offset: 10
      },
      {
        color: colors.green[shade],
        offset: 20
      },
      {
        color: colors.yellow[shade],
        offset: 30
      },
      {
        color: colors.red[shade],
        offset: 40
      },
      {
        color: maroon[shade],
        offset: 50
      }
    ]
  }
}

const getPressureColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 980,
    maxValue: 1040,
    colors: [
      {
        color: colors.lightBlue[shade],
        offset: 980
      },
      {
        color: colors.grey[shade],
        offset: 1013
      },
      {
        color: colors.red[shade],
        offset: 1040
      }
    ]
  }
}

const getVocColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  return {
    minValue: 0,
    maxValue: 400,
    colors: [
      {
        color: colors.green[shade],
        offset: 0
      },
      {
        color: colors.lime[shade],
        offset: 50
      },
      {
        color: colors.yellow[shade],
        offset: 100
      },
      {
        color: colors.orange[shade],
        offset: 150
      },
      {
        color: colors.red[shade],
        offset: 200
      },
      {
        color: colors.purple[shade],
        offset: 250
      },
      {
        color: maroon[shade],
        offset: 350
      }
    ]
  }
}

const CustomThemes = {
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#a947eb'
      },
      background: {
        paper: '#202020',
        default: '#303030',
        NYUpurpleLight: 'rgba(169, 71, 235, 0.3)'
      },
      customBackground: '#202020',
      customAlternateBackground: '#303030',
      text: {
        secondaryRGB: '#c1c1c1'
      },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[darkShade - 100], colors.purple[darkShade + 200]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[darkShade + 100]],
          multiColor: [colors.blue[darkShade], colors.pink[darkShade], colors.amber[darkShade], colors.teal[darkShade], colors.grey[darkShade]],
          grayscale: [colors.grey[darkShade + 100], colors.grey[darkShade + 300]],
          rainbow: [colors.red[darkShade], colors.orange[darkShade], colors.amber[darkShade], colors.green[darkShade], colors.blue[darkShade], colors.indigo[darkShade], colors.blue[darkShade]],
          aqi: getAQIPalette({ increasingOrder: true, isDark: true }),
          reverseAqi: getAQIPalette({ increasingOrder: false, isDark: true }),
          studentPopulation: ['#aaa', '#666', colors.red[darkShade], colors.amber[darkShade + 100], colors.teal[darkShade]]
        },
        colorAxisFirstColor: colors.grey[darkShadeColorAxis],
        colorAxes: {
          voc: getVocColorAxis({ isDark: true }),
          pressure: getPressureColorAxis({ isDark: true }),
          humidity: getHumidityColorAxis({ isDark: true }),
          temperature: getTemperatureColorAxis({ isDark: true }),
          co2: getCO2ColorAxis({ isDark: true }),
          [AQIDataTypes.aqi.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.dark, dataType: AQIDataTypes.aqi.threshold_mapping_name }),
          [AQIDataTypes['pm2.5'].color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.dark, dataType: AQIDataTypes['pm2.5'].threshold_mapping_name }),
          [AQIDataTypes.pm10_raw.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.dark, dataType: AQIDataTypes.pm10_raw.threshold_mapping_name }),
          [AQIDataTypes.co2.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.dark, dataType: AQIDataTypes.co2.threshold_mapping_name })
        },
        axisTitle: colors.grey[darkShade - 100],
        axisText: colors.grey[darkShade],
        gridlines: colors.grey[darkShade + 200],
        annotationBoxFill: colors.blueGrey[600],
        tooltip: {
          background: colors.grey[darkShade - 200],
          text: colors.grey[darkShade + 300]
        }
      }
    }
  },
  light: {
    palette: {
      mode: 'light',
      primary: {
        main: '#57068c'
      },
      background: {
        NYUpurpleLight: 'rgba(87, 6, 140, 0.1)'
      },
      customBackground: '#f6f6f6',
      customAlternateBackground: '#ffffff',
      text: {
        secondaryRGB: '#666666'
      },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[lightShade], colors.purple[lightShade - 300]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[lightShade - 100]],
          multiColor: [colors.blue[lightShade], colors.pink[lightShade], colors.amber[lightShade], colors.teal[lightShade], colors.grey[lightShade]],
          grayscale: [colors.grey[lightShade - 100], colors.grey[lightShade + 200]],
          rainbow: [colors.red[lightShade], colors.orange[lightShade], colors.amber[lightShade], colors.green[lightShade], colors.blue[lightShade], colors.indigo[lightShade], colors.deepPurple[lightShade]],
          aqi: getAQIPalette({ increasingOrder: true, isDark: false }),
          reverseAqi: getAQIPalette({ increasingOrder: false, isDark: false }),
          studentPopulation: [colors.grey[lightShade], '#333333', colors.red[lightShade], colors.amber[lightShade], colors.teal[lightShade]]
        },
        colorAxisFirstColor: colors.common.white,
        colorAxes: {
          voc: getVocColorAxis({ isDark: false }),
          pressure: getPressureColorAxis({ isDark: false }),
          humidity: getHumidityColorAxis({ isDark: false }),
          temperature: getTemperatureColorAxis({ isDark: false }),
          co2: getCO2ColorAxis({ isDark: false }),
          [AQIDataTypes.aqi.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.light, dataType: AQIDataTypes.aqi.threshold_mapping_name }),
          [AQIDataTypes['pm2.5'].color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.light, dataType: AQIDataTypes['pm2.5'].threshold_mapping_name }),
          [AQIDataTypes.pm10_raw.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.light, dataType: AQIDataTypes.pm10_raw.threshold_mapping_name }),
          [AQIDataTypes.co2.color_axis]: getAqiColorAxis({ themePreference: ThemePreferences.light, dataType: AQIDataTypes.co2.threshold_mapping_name })

        },
        axisTitle: colors.grey[lightShade + 100],
        axisText: colors.grey[lightShade],
        gridlines: colors.grey[lightShade - 200],
        annotationBoxFill: colors.blueGrey[800],
        tooltip: {
          background: colors.common.white,
          text: colors.grey[lightShade]
        }
      }
    }
  },
  universal: {
    palette: {
      NYUpurple: '#57068c',
      backgroundColorForNavLink: 'rgba(0, 0, 0, 0.2)',
      inactiveSensor: '#bbbbbb'
    },
    typography: {
      fontFamily: "'IBM Plex Sans', sans-serif !important"
    }
  }
};

console.log(CustomThemes)

export default CustomThemes;
