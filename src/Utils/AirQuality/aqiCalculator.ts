import { AQI_Database } from "./AirQualityIndexHelper";
import type { AQIResult, SinglePollutantAQIResult, OverallAQIResult, HealthSuggestions } from "./AirQuality.types";
import { DataTypeKeys, DataTypes, type DataTypeKey } from "./DataTypes";

// Helper function to categorize AQI
function linearPieceWise(
  aqiHigh: number,
  aqiLow: number,
  concenHigh: number,
  concenLow: number,
  val: number
): number {
  return Math.floor(
    ((aqiHigh - aqiLow) / (concenHigh - concenLow)) * (val - concenLow) + aqiLow
  );
}

// Helper function to calculate AQI for a value based on the dataType threshold mapping name
// (e.g., 'rawPM2_5', 'rawPM10') or a DataTypeKey whose threshold_mapping_name resolves to one.
// Returns an object containing the AQI value, the index of the category, and the category.
// Optionally includes healthSuggestions and description when shouldReturnHealthSuggestion is true.
// Examples:
// argument: (10.5, 'rawPM2_5') -> return { aqi: 53, val: 10.5, categoryIndex: 1, category: 'Moderate' }
// argument: (250, 'rawPM2_5') -> return { aqi: 324, val: 250, categoryIndex: 5, category: 'Hazardous' }
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

  const aqiThresholdKey = DataTypes[DataTypeKeys.aqi].threshold_mapping_name!; // "aqiUS"

  for (let i = 0; i < AQI_Database.length; i++) {
    const category = AQI_Database[i] as Record<string, any>;

    const dataTypeThresholds = category[dataType];
    if (!dataTypeThresholds) continue;

    let {
      low: rawMeasurementLowBreakpoint,
      high: rawMeasurementHighBreakpoint
    } = dataTypeThresholds;

    const aqiThresholds = category[aqiThresholdKey];
    let {
      low: aqiLowBreakpoint,
      high: aqiHighBreakpoint
    } = aqiThresholds;

    if (numericVal >= rawMeasurementLowBreakpoint && numericVal <= rawMeasurementHighBreakpoint) {
      if (rawMeasurementHighBreakpoint === Infinity) {
        const previousCategory = AQI_Database[i - 1] as Record<string, any>;

        rawMeasurementHighBreakpoint = previousCategory[dataType].high;
        rawMeasurementLowBreakpoint = previousCategory[dataType].low;
        aqiHighBreakpoint = previousCategory[aqiThresholdKey].high;
        aqiLowBreakpoint = previousCategory[aqiThresholdKey].low;
      }

      const aqi = linearPieceWise(
        aqiHighBreakpoint, aqiLowBreakpoint,
        rawMeasurementHighBreakpoint, rawMeasurementLowBreakpoint,
        numericVal
      );
      return {
        aqi,
        val: numericVal,
        categoryIndex: category.id as number,
        category: category.category as string,
        color: category.color,
        ...(shouldReturnHealthSuggestion ? {
          healthSuggestions: category.healthSuggestions as HealthSuggestions,
          description: category.description as string
        } : {})
      };
    }
  }
};

// Backward-compatible wrapper for existing callers that pass a threshold_mapping_name string
// (e.g., DataTypes[DataTypeKeys.pm2_5].threshold_mapping_name → "rawPM2_5").
export function calculateAQI(val: number | null, dataType: string): AQIResult {
  if (val == null)
    return { val, aqi: null, categoryIndex: null, category: "No data" };

  const result = calculateAQIforSingleDataType(val, dataType);
  if (!result)
    return { val, aqi: null, categoryIndex: null, category: "Unknown" };

  return result as AQIResult;
}

// AQI is calculated as the maximum across multiple air quality measurements.
// AQI = max(AQIVal(pm2.5), ...) — currently only pm2.5 is considered.
// Accepts a map of DataTypeKey → raw measurement value.
// Examples:
// argument ({ 'pm2.5': 10.5 }) -> return { val: 53, categoryIndex: 1, category: 'Moderate', majorPollutant: 'PM2.5' }
const DATATYPES_FOR_CALCULATING_AQI: DataTypeKey[] = [DataTypeKeys.pm2_5];

const calculateOverallAQIfromMultipleDataTypes = (
  rawMeasurements: Partial<Record<DataTypeKey, number | null>>
): OverallAQIResult | undefined => {
  const aqiObjArr = (Object.keys(rawMeasurements) as DataTypeKey[]).map((dataType) => {
    if (!DATATYPES_FOR_CALCULATING_AQI.includes(dataType)) return null;

    const thresholdKey = DataTypes[dataType]?.threshold_mapping_name;
    if (!thresholdKey) return null;

    const AQI = calculateAQIforSingleDataType(rawMeasurements[dataType] ?? null, thresholdKey);
    if (!AQI || AQI.aqi == null) {
      return {
        val: null,
        categoryIndex: null,
        category: "No data",
        majorPollutant: DataTypes[dataType].name_short
      };
    }

    const { aqi: aqiVal, categoryIndex, category } = AQI;
    return {
      val: aqiVal,
      categoryIndex,
      category,
      majorPollutant: DataTypes[dataType].name_short
    };
  });

  const filteredAqiObjArr = aqiObjArr.filter((data): data is OverallAQIResult => data !== null);

  if (filteredAqiObjArr.length === 0) return undefined;

  return filteredAqiObjArr.reduce((prev, current) => {
    return ((prev.val ?? 0) > (current.val ?? 0)) ? prev : current;
  });
};

export { calculateAQIforSingleDataType, calculateOverallAQIfromMultipleDataTypes };
