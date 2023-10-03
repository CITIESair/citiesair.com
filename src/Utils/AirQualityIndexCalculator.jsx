import AQIdatabase from "./AirQualityIndexHelper";

// Helper function to categorize AQI
function linearPieceWise(aqiHigh, aqiLow, concenHigh, concenLow, val) {
  return parseInt(
    ((aqiHigh - aqiLow) / (concenHigh - concenLow)) * (val - concenLow) + aqiLow
  );
}
// Returns AQI number value
function convertToAQI(val) {
  if (val == null)
    return {
      aqi: null,
      aqi_category_index: null
    };

  for (let i = 0; i < AQIdatabase.length; i++) {
    const category = AQIdatabase[i];
    if (val >= category.rawPM2_5.low && val <= category.rawPM2_5.high) {
      return {
        aqi: linearPieceWise(category.aqiUS.high, category.aqiUS.low, category.rawPM2_5.high, category.rawPM2_5.low, val),
        aqi_category_index: category.id
      }
    }
  };

}


export default convertToAQI;