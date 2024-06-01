/* eslint-disable max-len */
import { colors } from '@mui/material';

const darkShade = 400;
const lightShade = 600;
const darkShadeColorAxis = 300;

const maroon = {
  50: '#f0e0e5',
  100: '#d8b3bd',
  200: '#bf8091',
  300: '#a54d65',
  400: '#912644',
  500: '#7e0023',
  600: '#76001f',
  700: '#6b001a',
  800: '#610015',
  900: '#4e000c',
  A100: '#ff8189',
  A200: '#ff4e5a',
  A400: '#ff1b2a',
  A700: '#ff0212'
};

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

const getAqiColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  return (
    {
      minValue: 0,
      maxValue: 400,
      isGradient: false,
      colors: [
        colors.green[shade],
        colors.yellow[shade],
        colors.orange[shade - 100],
        colors.red[shade],
        colors.purple[shade],
        colors.purple[shade],
        maroon[shade],
        maroon[shade]
      ]
    }
  )
}

const getCO2ColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  return (
    {
      minValue: 400,
      maxValue: 1500,
      isGradient: true,
      colors: [
        { color: colors.green[shade], stop: 400 },
        { color: colors.yellow[shade], stop: 700 },
        { color: colors.orange[shade - 100], stop: 1000 },
        { color: colors.red[shade], stop: 1500 }
      ]
    }
  )
}

const getHumidityColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 0,
    maxValue: 100,
    isGradient: true,
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
    isGradient: true,
    colors: [
      {
        color: colors.lightBlue[shade],
        stop: 10
      },
      {
        color: colors.green[shade],
        stop: 20
      },
      {
        color: colors.yellow[shade],
        stop: 30
      },
      {
        color: colors.red[shade],
        stop: 40
      },
      {
        color: maroon[shade],
        stop: 50
      }
    ]
  }
}

const getPressureColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;

  return {
    minValue: 980,
    maxValue: 1040,
    isGradient: true,
    colors: [
      {
        color: colors.lightBlue[shade],
        stop: 980
      },
      {
        color: colors.grey[shade],
        stop: 1013
      },
      {
        color: colors.red[shade],
        stop: 1040
      }
    ]
  }
}

const getVocColorAxis = ({ isDark }) => {
  const shade = isDark ? darkShade : lightShade;
  return {
    minValue: 0,
    maxValue: 400,
    isGradient: true,
    colors: [
      {
        color: colors.green[shade],
        stop: 0
      },
      {
        color: colors.lime[shade],
        stop: 50
      },
      {
        color: colors.yellow[shade],
        stop: 100
      },
      {
        color: colors.orange[shade],
        stop: 150
      },
      {
        color: colors.red[shade],
        stop: 200
      },
      {
        color: colors.purple[shade],
        stop: 250
      },
      {
        color: maroon[shade],
        stop: 350
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
          aqi: getAqiColorAxis({ isDark: true }),

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
          aqi: getAqiColorAxis({ isDark: false }),
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
