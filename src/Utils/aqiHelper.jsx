import CustomThemes from '../../Themes/CustomThemes';

let aqi_category = [
  ["Good", 0, 50],
  ["Moderate", 50, 100],
  ["Unhealthy for Sensitive Group", 100, 150],
  ["Unhealthy", 150, 200],
  ["Very Unhealthy", 200, 300],
  ["Hazardous", 300, 500],
];

let good = {
  category: "Good",
  class: "good",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[0],
  outdoorsHealth: "Enjoy outdoor activities, the air is great!",
  indoorsHealth: "Enjoy clean indoor air",
  diningHallHealth: "Enjoy clean dining hall air"
};
let moderate = {
  category: "Moderate",
  class: "moderate",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[1],
  outdoorsHealth:
    "People with respiratory issues:<br>Reduce prolonged outdoor exertion",
    indoorsHealth: "Indoor air is acceptable, but not great",
  diningHallHealth: "Indoor air is acceptable, but not great<br>Avoid Grill area"
};
let unhealthy_sensitive = {
  category: "Unhealthy for<br>Sensitive Groups",
  class: "unhealthy-sentitive",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[2],
  outdoorsHealth:
    "Children & people with respiratory issues: limit outdoor exertion",
  diningHallHealth: "Consider take-aways<br>Avoid Grill area"
};
let unhealthy = {
  category: "Unhealthy",
  class: "unhealthy",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[3],
  outdoorsHealth: "Everyone should limit/avoid outdoor activities",
  diningHallHealth:
    "Consider take-aways<br>Avoid Grill area<br>Visit at off-peak hours"
};
let very_unhealthy = {
  category: "Very Unhealthy",
  class: "very-unhealthy",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[4],
  outdoorsHealth: "Avoid outdoor activities at all cost",
  diningHallHealth:
    "Consider take-aways<br>Avoid Grill area<br>Visit at off-peak hours"
};
let hazardous = {
  category: "Hazardous",
  class: "hazardous",
  color: CustomThemes.light.pallete.chart.optionsColors.aqi[5],
  outdoorsHealth: "Avoid outdoor activities at all cost",
  diningHallHealth:
    "Consider take-aways<br>Avoid Grill area<br>Visit at off-peak hours"
};
let aqiArray = [
  good,
  moderate,
  unhealthy_sensitive,
  unhealthy,
  very_unhealthy,
  hazardous
];

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
      aqi_object: null
    };
  if (val >= 0 && val <= 12)
    return {
      aqi: linearPieceWise(50, 0, 12, 0, val),
      aqi_object: good
    };
  else if (val > 12 && val <= 35.4)
    return {
      aqi: linearPieceWise(100, 51, 35.4, 12.1, val),
      aqi_object: moderate
    };
  else if (val > 35.4 && val <= 55.4)
    return {
      aqi: linearPieceWise(150, 101, 55.4, 35.5, val),
      aqi_object: unhealthy_sensitive
    };
  else if (val > 55.4 && val <= 150.4)
    return {
      aqi: linearPieceWise(200, 151, 150.4, 55.5, val),
      aqi_object: unhealthy
    };
  else if (val > 150.4 && val <= 250.4)
    return {
      aqi: linearPieceWise(300, 201, 250.4, 150.5, val),
      aqi_object: very_unhealthy
    };
  else if (val > 250.4 && val <= 350.4)
    return {
      aqi: linearPieceWise(400, 301, 350.4, 250.5, val),
      aqi_object: hazardous
    };
  else
    return {
      aqi: linearPieceWise(500, 401, 500.4, 350.5, val),
      aqi_object: hazardous
    };
}