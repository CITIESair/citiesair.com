/* eslint-disable max-len */
import { colors } from '@mui/material';
import ThemePreferences from './ThemePreferences';
import { darkShade, lightShade, maroon, darkShadeColorAxis } from './CustomColors';

// Type declarations for AirQuality modules (outside migration scope)
// These provide loose typing to prevent TypeScript errors during compilation
// Once AirQualityIndexHelper.jsx is migrated, these casts can be removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { getCategoryColorAxis, getTextColorsForAQI } from '../Utils/AirQuality/AirQualityIndexHelper';

// Type declarations for DataTypes module (outside migration scope)
// These provide loose typing to prevent TypeScript errors during compilation
// Once DataTypes.jsx is migrated, these casts can be removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { DataTypeKeys, DataTypes as DataTypesUntyped } from '../Utils/AirQuality/DataTypes';

// Loose typing for DataTypes until DataTypes.jsx is migrated to TypeScript
const DataTypes = DataTypesUntyped as any;

interface ColorStop {
  color: string;
  offset: number;
}

interface ContinuousColorAxis {
  minValue: number;
  maxValue: number;
  defaultValueForAlert: number;
  defaultValueForChildAlert: number;
  colors: ColorStop[];
}

interface ColorAxesForContinuousData {
  [key: string]: ContinuousColorAxis;
}

// Loose typing for color axis options from getCategoryColorAxis (outside migration scope)
// Once AirQualityIndexHelper.jsx is migrated, proper types can be defined
interface ColorAxesForCategorizedData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ThemePaletteChart {
  optionsColors: ColorAxesForCategorizedData;
  colorAxisFirstColor: string;
  colorAxes: ColorAxesForContinuousData & ColorAxesForCategorizedData;
  axisTitle: string;
  axisText: string;
  gridlines: string;
  annotationBoxFill: string;
  tooltip: {
    background: string;
    text: string;
  };
}

interface CustomTheme {
  palette: {
    mode?: 'dark' | 'light';
    primary?: {
      main: string;
    };
    background?: {
      paper?: string;
      paperBackgroundGradient?: string;
      default?: string;
      NYUpurpleLight?: string;
    },
    customBackground?: string;
    customAlternateBackground?: string;
    text: {
      secondaryRGB: string;
      // Loose typing for AQI text colors from getTextColorsForAQI (outside migration scope)
      // Once AirQualityIndexHelper.jsx is migrated, proper types can be defined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aqi: any;
    },
    chart: ThemePaletteChart;
  },
  typography?: {
    fontFamily: string;
  };
}

interface UniversalTheme {
  palette: {
    NYUpurple: string;
    backgroundColorForNavLink: string;
  };
  typography: {
    fontFamily: string;
  };
}

const getColorAxisForContinuousDataTypes = ({ isDark }: { isDark: boolean }): ColorAxesForContinuousData => {
  return {
    [DataTypes.rel_humidity.color_axis]: {
      minValue: 0,
      maxValue: 100,
      defaultValueForAlert: 70,
      defaultValueForChildAlert: 50,
      colors: [
        { color: colors.grey[isDark ? darkShade + 400 : lightShade - 300], offset: 0 },
        { color: colors.grey[isDark ? darkShade + 400 : lightShade - 300], offset: 15 },
        { color: colors.blue[isDark ? darkShade + 200 : lightShade], offset: 85 },
        { color: colors.blue[isDark ? darkShade + 200 : lightShade], offset: 100 },
      ],
    },
    [DataTypes.temperature_C.color_axis]: {
      minValue: 0,
      maxValue: 50,
      defaultValueForAlert: 35,
      defaultValueForChildAlert: 30,
      colors: [
        { color: colors.lightBlue[isDark ? darkShade : lightShade], offset: 0 },
        { color: colors.lightBlue[isDark ? darkShade : lightShade], offset: 10 },
        { color: colors.green[isDark ? darkShade : lightShade], offset: 15 },
        { color: colors.yellow[isDark ? darkShade : lightShade], offset: 25 },
        { color: colors.red[isDark ? darkShade : lightShade], offset: 35 },
        { color: maroon[isDark ? darkShade : lightShade], offset: 40 },
        { color: maroon[isDark ? darkShade : lightShade], offset: 50 },
      ],
    },
    [DataTypes.pressure.color_axis]: {
      minValue: 980,
      maxValue: 1040,
      defaultValueForAlert: 1020,
      defaultValueForChildAlert: 1010,
      colors: [
        { color: colors.blue[900], offset: 980 },
        { color: colors.blue[500], offset: 1000 },
        { color: colors.grey[isDark ? 300 : 200], offset: 1012.25 },
        { color: colors.grey[isDark ? 300 : 200], offset: 1013.75 },
        { color: colors.red[500], offset: 1020 },
        { color: colors.red[900], offset: 1040 },
      ],
    },
  };
};

const getColorAxisForDataTypesWithCategorization = ({
  isGradient,
  themePreference,
}: {
  isGradient: boolean;
  // Loose typing for themePreference (outside migration scope)
  // Once ThemePreferences is properly typed end-to-end, this can use ThemePreferences type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themePreference: any;
}): ColorAxesForCategorizedData => {
  return [
    DataTypeKeys.aqi,
    DataTypeKeys.pm2_5,
    DataTypeKeys.pm10_raw,
    DataTypeKeys.co2,
    DataTypeKeys.voc,
    DataTypeKeys.heat_index_C,
  ].reduce((acc: ColorAxesForCategorizedData, dataTypeKey) => {
    const colorAxis = getCategoryColorAxis({
      themePreference,
      dataTypeKey,
      isGradient,
    });

    acc[DataTypes[dataTypeKey].color_axis] = colorAxis;

    return acc;
  }, {});
};

const CustomThemes: { dark: CustomTheme; light: CustomTheme; universal: UniversalTheme } = {
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#a947eb' },
      background: {
        paper: '#202020',
        paperBackgroundGradient: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
        default: '#303030',
        NYUpurpleLight: 'rgba(169, 71, 235, 0.3)',
      },
      customBackground: '#202020',
      customAlternateBackground: '#303030',
      // Cast to any: getTextColorsForAQI is from untyped AirQualityIndexHelper.jsx (outside migration scope)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      text: { secondaryRGB: '#c1c1c1', aqi: (getTextColorsForAQI as any)({ themePreference: ThemePreferences.dark }) },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[darkShade - 100], colors.purple[darkShade + 200]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[darkShade + 100]],
          multiColor: [colors.blue[darkShade], colors.pink[darkShade], colors.amber[darkShade], colors.teal[darkShade], colors.grey[darkShade]],
          grayscale: [colors.grey[darkShade + 100], colors.grey[darkShade + 300]],
          rainbow: [
            colors.red[darkShade],
            colors.orange[darkShade],
            colors.amber[darkShade],
            colors.green[darkShade],
            colors.blue[darkShade],
            colors.indigo[darkShade],
            colors.blue[darkShade],
          ],
          ...getColorAxisForDataTypesWithCategorization({ themePreference: ThemePreferences.dark, isGradient: false }),
        },
        colorAxisFirstColor: colors.grey[darkShadeColorAxis],
        colorAxes: {
          ...getColorAxisForContinuousDataTypes({ isDark: true }),
          ...getColorAxisForDataTypesWithCategorization({ themePreference: ThemePreferences.dark, isGradient: true }),
        },
        axisTitle: colors.grey[darkShade - 100],
        axisText: colors.grey[darkShade],
        gridlines: colors.grey[darkShade + 200],
        annotationBoxFill: colors.blueGrey[600],
        tooltip: { background: colors.grey[darkShade - 200], text: colors.grey[darkShade + 300] },
      },
    },
  },
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#57068c' },
      background: { NYUpurpleLight: 'rgba(87, 6, 140, 0.1)' },
      customBackground: '#f6f6f6',
      customAlternateBackground: '#ffffff',
      // Cast to any: getTextColorsForAQI is from untyped AirQualityIndexHelper.jsx (outside migration scope)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      text: { secondaryRGB: '#666666', aqi: (getTextColorsForAQI as any)({ themePreference: ThemePreferences.light }) },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[lightShade], colors.purple[lightShade - 300]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[lightShade - 100]],
          multiColor: [colors.blue[lightShade], colors.pink[lightShade], colors.amber[lightShade], colors.teal[lightShade], colors.grey[lightShade]],
          grayscale: [colors.grey[lightShade - 100], colors.grey[lightShade + 200]],
          rainbow: [
            colors.red[lightShade],
            colors.orange[lightShade],
            colors.amber[lightShade],
            colors.green[lightShade],
            colors.blue[lightShade],
            colors.indigo[lightShade],
            colors.deepPurple[lightShade],
          ],
          ...getColorAxisForDataTypesWithCategorization({ themePreference: ThemePreferences.light, isGradient: false }),
        },
        colorAxisFirstColor: colors.common.white,
        colorAxes: {
          ...getColorAxisForContinuousDataTypes({ isDark: false }),
          ...getColorAxisForDataTypesWithCategorization({ themePreference: ThemePreferences.light, isGradient: true }),
        },
        axisTitle: colors.grey[lightShade + 100],
        axisText: colors.grey[lightShade],
        gridlines: colors.grey[lightShade - 200],
        annotationBoxFill: colors.blueGrey[800],
        tooltip: { background: colors.common.white, text: colors.grey[lightShade] },
      },
    },
  },
  universal: {
    palette: {
      NYUpurple: '#57068c',
      backgroundColorForNavLink: 'rgba(0, 0, 0, 0.2)',
    },
    typography: {
      fontFamily: "'IBM Plex Sans', sans-serif !important",
    },
  },
};

export default CustomThemes;
