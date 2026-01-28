// Type declarations for AirQualityIndexHelper module (outside migration scope)
// These provide loose typing to prevent TypeScript errors during compilation
// Once AirQualityIndexHelper.jsx is migrated, this cast can be removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AQI_Database as AQI_DatabaseUntyped } from "./AirQualityIndexHelper";

// Type declarations for DataTypes module (outside migration scope)
// These provide loose typing to prevent TypeScript errors during compilation
// Once DataTypes.jsx is migrated, this cast can be removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { DataTypeKeys, DataTypes as DataTypesUntyped } from "./DataTypes";

// Loose typing for external modules until they are migrated to TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AQI_Database = AQI_DatabaseUntyped as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTypes = DataTypesUntyped as any;

// Return type for calculateAQI function
interface AQIResult {
  val: number | null;
  aqi: number | null;
  categoryIndex: number | null;
  category: string | { en: string; lg: string };
  color?: {
    Light: string;
    Dark: string;
  };
}

export function calculateAQI(val: number | null, dataType: string): AQIResult {
  if (val == null)
    return {
      val,
      aqi: null,
      categoryIndex: null,
      category: "No data"
    };

  for (let i = 0; i < AQI_Database.length; i++) {
    const category = AQI_Database[i];

    let {
      low: rawMeasurementLowBreakpoint,
      high: rawMeasurementHighBreakpoint
    } = category[dataType];

    let {
      low: aqiLowBreakpoint,
      high: aqiHighBreakpoint
    } = category[DataTypes[DataTypeKeys.aqi].threshold_mapping_name];

    if (val >= rawMeasurementLowBreakpoint && val <= rawMeasurementHighBreakpoint) {
      if (rawMeasurementHighBreakpoint === Infinity) {
        const previousCategory = AQI_Database[i - 1];

        rawMeasurementHighBreakpoint = previousCategory[dataType].high;
        rawMeasurementLowBreakpoint = previousCategory[dataType].low;

        aqiHighBreakpoint = previousCategory[DataTypes[DataTypeKeys.aqi].threshold_mapping_name].high;
        aqiLowBreakpoint = previousCategory[DataTypes[DataTypeKeys.aqi].threshold_mapping_name].low;
      }

      const aqi = linearPieceWise(
        aqiHighBreakpoint, aqiLowBreakpoint,
        rawMeasurementHighBreakpoint, rawMeasurementLowBreakpoint,
        val
      );
      return {
        aqi: Number(aqi),
        val: Number(val),
        categoryIndex: category.id,
        category: category.category,
        color: category.color
      };
    }
  }

  // Default return if no category matched (shouldn't happen with valid data)
  return {
    val,
    aqi: null,
    categoryIndex: null,
    category: "Unknown"
  };
}

// Helper function to categorize AQI
function linearPieceWise(
  aqiHigh: number,
  aqiLow: number,
  concenHigh: number,
  concenLow: number,
  val: number
): number {
  return parseInt(
    String(((aqiHigh - aqiLow) / (concenHigh - concenLow)) * (val - concenLow) + aqiLow)
  );
}
