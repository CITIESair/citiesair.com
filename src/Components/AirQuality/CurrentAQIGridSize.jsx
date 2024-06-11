export const CurrentAQIGridSize = {
  large: "large",
  medium: "medium",
  small: "small"
};
export const ElementSizes = {
  [CurrentAQIGridSize.large]: {
    icon: null,
    locationAndCategory: 'h4',
    aqi: 'h1',
    aqiLineHeight: 0.8,
    sensorStatus: 'h6',
    heatIndex: 'body1',
    meteroDataMarginTop: 2,
    metero: 'h6',
    rawValues: 'h6',
    importantFontWeight: '500 !important'
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
    importantFontWeight: null
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
    importantFontWeight: null
  }
};
