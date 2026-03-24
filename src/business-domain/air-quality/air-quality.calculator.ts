import { AQI_Database } from "./air-quality.database";
import type { SinglePollutantAQIResult, HealthSuggestions, Threshold } from "./air-quality.types";
import { DataTypeKeys } from "../data-types/data-type.types";

// Helper function to categorize AQI
function linearPieceWise(aqiHigh: number, aqiLow: number, concenHigh: number, concenLow: number, val: number): number {
  return Math.floor(
    ((aqiHigh - aqiLow) / (concenHigh - concenLow)) * (val - concenLow) + aqiLow
  );
}

// Helper function to calculate AQI for a value based on the dataType ( pm2.5, pm10_raw, voc )
// Returns an object containing the AQI value, the index of the category, and the category
// Examples:
// argument: (10.5, 'pm2_5') -> return { aqi: 53, val: 10.5, categoryIndex: 1, category: 'Moderate' }
// argument: (250, 'pm2_5') -> return { aqi: 324, val: 250, categoryIndex: 5, category: 'Hazardous' }
const calculateAQIforSingleDataType = (
  val: number | string | null,
  dataType: string,
  shouldReturnHealthSuggestion: boolean = false
): SinglePollutantAQIResult | undefined => {
  if (val == null)
    return {
      val: null,
      aqi: null,
      categoryIndex: null,
      category: "No data"
    };

  const numericVal = Number(val);
  if (isNaN(numericVal)) return undefined;

  for (let i = 0; i < AQI_Database.length; i++) {
    const category = AQI_Database[i] as Record<string, any>;

    const dataTypeThresholds = category[dataType];
    if (!dataTypeThresholds) continue;

    let {
      low: rawMeasurementLowBreakpoint,
      high: rawMeasurementHighBreakpoint
    } = dataTypeThresholds;

    const aqiThresholds = category[DataTypeKeys.aqi];
    let {
      low: aqiLowBreakpoint,
      high: aqiHighBreakpoint
    } = aqiThresholds;

    if (numericVal >= rawMeasurementLowBreakpoint && numericVal <= rawMeasurementHighBreakpoint) {
      if (rawMeasurementHighBreakpoint === Infinity) {
        const previousCategory = AQI_Database[i - 1];
        const prevDataTypeThresholds = previousCategory[dataType] as Threshold;
        const prevAqiThresholds = previousCategory[DataTypeKeys.aqi] as Threshold;

        rawMeasurementHighBreakpoint = prevDataTypeThresholds.high;
        rawMeasurementLowBreakpoint = prevDataTypeThresholds.low;
        aqiHighBreakpoint = prevAqiThresholds.high;
        aqiLowBreakpoint = prevAqiThresholds.low;
      }

      const aqi = linearPieceWise(
        aqiHighBreakpoint, aqiLowBreakpoint,
        rawMeasurementHighBreakpoint, rawMeasurementLowBreakpoint,
        numericVal
      );
      return {
        aqi,
        val: numericVal,
        categoryIndex: category.id,
        category: category.category,
        color: category.color,
        ...(shouldReturnHealthSuggestion ? {
          healthSuggestions: category.healthSuggestions,
          description: category.description
        } : {})
      };
    }
  }
};

export { calculateAQIforSingleDataType };
