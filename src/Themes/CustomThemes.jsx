/* eslint-disable max-len */
import { colors } from '@mui/material';
import ThemePreferences from './ThemePreferences';
import { getCategoryColors } from '../Utils/AirQuality/AirQualityIndexHelper';
import { darkShade, lightShade, maroon, darkShadeColorAxis } from './CustomColors';
import AQIDataTypes from '../Utils/AirQuality/DataTypes';

const getHumidityColorAxis = ({ isDark }) => {
  return {
    minValue: 0,
    maxValue: 100,
    defaultValueForAlert: 50,
    colors: [
      { color: colors.grey[isDark ? darkShade + 400 : lightShade - 300], offset: 0 },
      { color: colors.grey[isDark ? darkShade + 400 : lightShade - 300], offset: 15 },
      { color: colors.blue[isDark ? darkShade + 200 : lightShade], offset: 85 },
      { color: colors.blue[isDark ? darkShade + 200 : lightShade], offset: 100 }

    ]
  }
}

const getPressureColorAxis = ({ isDark }) => {
  return {
    minValue: 980,
    maxValue: 1040,
    defaultValueForAlert: 1013,
    colors: [
      {
        color: colors.blue[900],
        offset: 980
      },
      {
        color: colors.blue[500],
        offset: 1000
      },
      {
        color: colors.grey[isDark ? 300 : 200],
        offset: 1012.25
      },
      {
        color: colors.grey[isDark ? 300 : 200],
        offset: 1013.75
      },
      {
        color: colors.red[500],
        offset: 1020
      },
      {
        color: colors.red[900],
        offset: 1040
      }
    ]
  }
}

const getTemperatureColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 10,
    defaultValueForAlert: 35,
    maxValue: 50,
    colors: [
      {
        color: colors.lightBlue[shade],
        offset: 10
      },
      {
        color: colors.green[shade],
        offset: 15
      },
      {
        color: colors.yellow[shade],
        offset: 25
      },
      {
        color: colors.red[shade],
        offset: 35
      },
      {
        color: maroon[shade],
        offset: 40
      },
      {
        color: maroon[shade],
        offset: 50
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
          [AQIDataTypes.aqi.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.aqi }),
          [AQIDataTypes['pm2.5'].color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.dark, dataType: AQIDataTypes['pm2.5'] }),
          [AQIDataTypes.pm10_raw.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.pm10_raw }),
          [AQIDataTypes.co2.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.co2 }),
          [AQIDataTypes.voc.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.voc }),
        },
        colorAxisFirstColor: colors.grey[darkShadeColorAxis],
        colorAxes: {
          pressure: getPressureColorAxis({ isDark: true }),
          humidity: getHumidityColorAxis({ isDark: true }),
          temperature: getTemperatureColorAxis({ isDark: true }),
          [AQIDataTypes.aqi.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.aqi }),
          [AQIDataTypes['pm2.5'].color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.dark, dataType: AQIDataTypes['pm2.5'] }),
          [AQIDataTypes.pm10_raw.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.pm10_raw }),
          [AQIDataTypes.co2.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.co2 }),
          [AQIDataTypes.voc.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.dark, dataType: AQIDataTypes.voc })
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
          [AQIDataTypes.aqi.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.light, dataType: AQIDataTypes.aqi }),
          [AQIDataTypes['pm2.5'].color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.light, dataType: AQIDataTypes['pm2.5'] }),
          [AQIDataTypes.pm10_raw.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.light, dataType: AQIDataTypes.pm10_raw }),
          [AQIDataTypes.co2.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.light, dataType: AQIDataTypes.co2 }),
          [AQIDataTypes.voc.color_axis]: getCategoryColors({ isGradient: false, themePreference: ThemePreferences.light, dataType: AQIDataTypes.voc }),
        },
        colorAxisFirstColor: colors.common.white,
        colorAxes: {
          pressure: getPressureColorAxis({ isDark: false }),
          humidity: getHumidityColorAxis({ isDark: false }),
          temperature: getTemperatureColorAxis({ isDark: false }),
          [AQIDataTypes.aqi.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.light, dataType: AQIDataTypes.aqi }),
          [AQIDataTypes['pm2.5'].color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.light, dataType: AQIDataTypes['pm2.5'] }),
          [AQIDataTypes.pm10_raw.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.light, dataType: AQIDataTypes.pm10_raw }),
          [AQIDataTypes.co2.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.light, dataType: AQIDataTypes.co2 }),
          [AQIDataTypes.voc.color_axis]: getCategoryColors({ isGradient: true, themePreference: ThemePreferences.light, dataType: AQIDataTypes.voc })
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

export default CustomThemes;
