export const CurrentAQIGridSize = {
  large: "large",
  medium: "medium",
  small: "small"
};
export const ElementSizes = {
  [CurrentAQIGridSize.large]: {
    icon: null,
    locationAndCategory: 'h3',
    aqi: 'h1',
    aqiLineHeight: 0.8,
    sensorStatus: 'h5',
    heatIndex: 'h5',
    meteroDataMarginTop: 3,
    metero: 'h4',
    rawValues: 'h4',
    importantFontWeight: '00 !important',
    aqiScaleText: "h5",
    aqiScaleHeight: "1rem",
    aqiScaleWidth: "1rem"
  },
  [CurrentAQIGridSize.medium]: {
    icon: '1rem',
    locationAndCategory: 'h5',
    aqi: 'h2',
    aqiLineHeight: 0.9,
    sensorStatus: 'caption',
    heatIndex: 'body2',
    meteroDataMarginTop: 1,
    metero: 'body1',
    rawValues: 'body2',
    importantFontWeight: null,
    aqiScaleText: "body2",
    aqiScaleHeight: "0.5rem",
    aqiScaleWidth: "0.5rem"
  },
  [CurrentAQIGridSize.small]: {
    icon: '1rem',
    locationAndCategory: 'body1',
    aqi: 'h3',
    aqiLineHeight: 0.9,
    sensorStatus: 'caption',
    heatIndex: 'caption',
    meteroDataMarginTop: 1,
    metero: 'caption',
    rawValues: 'caption',
    importantFontWeight: null,
    aqiScaleText: "caption",
    aqiScaleHeight: "0.5rem",
    aqiScaleWidth: "0.35rem"
  }
};
