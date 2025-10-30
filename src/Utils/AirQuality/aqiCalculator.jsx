import { AQI_Database } from "./AirQualityIndexHelper";
import { DataTypeKeys, DataTypes } from "./DataTypes";

export function calculateAQI(val, dataType) {
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

                aqiHighBreakpoint = previousCategory[DataTypeKeys.aqi].high;
                aqiLowBreakpoint = previousCategory[DataTypeKeys.aqi].low;
            }

            const aqi = linearPieceWise(
                aqiHighBreakpoint, aqiLowBreakpoint,
                rawMeasurementHighBreakpoint, rawMeasurementLowBreakpoint,
                val
            )
            return {
                aqi: Number(aqi),
                val: Number(val),
                categoryIndex: category.id,
                category: category.category,
                color: category.color
            }
        }
    };
}

// Helper function to categorize AQI
function linearPieceWise(aqiHigh, aqiLow, concenHigh, concenLow, val) {
    return parseInt(
        ((aqiHigh - aqiLow) / (concenHigh - concenLow)) * (val - concenLow) + aqiLow
    );
}