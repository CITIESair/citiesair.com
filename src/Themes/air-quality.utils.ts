import { colors } from "@mui/material";
import { SensorStatus } from '../Components/AirQuality/SensorStatus';
import { darkShade, lightShade, INACTIVE_SENSOR_COLORS } from './CustomColors';
import ThemePreferences from './ThemePreferences';
import { type DataTypeKey, DataTypes } from '../business-domain/data-types/data-type.types';
import { GradientColorAxisResult, getCategoryDatabaseForDataType, AQI_Database } from '../business-domain/air-quality/air-quality.database';
import type { ThemeColor } from '../business-domain/air-quality/air-quality.types';

export const getCategoryColorAxis = ({
    themePreference = ThemePreferences.light, dataTypeKey, isGradient
}: {
    themePreference?: keyof ThemeColor;
    dataTypeKey: DataTypeKey;
    isGradient: boolean;
}): GradientColorAxisResult | string[] => {
    const database = getCategoryDatabaseForDataType(dataTypeKey);
    const defaultValueForAlert = database[3][dataTypeKey].low;
    const defaultValueForChildAlert = database[2][dataTypeKey].low;

    // Return an object with a color gradient of colors associated with different categories for this dataType
    if (isGradient) {
        // If the minimum value is -Infinity, set it to a reasonable finite value for gradient axis
        let minValue = database[0][dataTypeKey].low;
        if (minValue === -Infinity) {
            // Stack another interval of the next higher category if the lowest category has a -Infinity low threshold
            const secondLowestEntry = database[1][dataTypeKey];
            const secondLowestCategoryRange = secondLowestEntry.high - secondLowestEntry.low;
            minValue = secondLowestEntry.low - secondLowestCategoryRange;
        }

        let maxValue = database[database.length - 1][dataTypeKey].high;
        if (maxValue === Infinity) {
            // just stack another interval of the next lower category if the highest category has an Infinity high threshold
            const secondHighestEntry = database[database.length - 2][dataTypeKey];
            const secondHighestCategoryRange = secondHighestEntry.high - secondHighestEntry.low;
            maxValue = secondHighestEntry.high + secondHighestCategoryRange;
        }

        return {
            minValue,
            maxValue,
            defaultValueForAlert,
            defaultValueForChildAlert,
            gradientSteps: DataTypes[dataTypeKey].gradient_steps,
            colors: database.flatMap(category => {
                const thresholds = category[dataTypeKey] as { low: number; high: number; };
                const { low, high } = thresholds;
                return [
                    { color: category.color[themePreference], offset: low === -Infinity ? minValue : low },
                    { color: category.color[themePreference], offset: high === Infinity ? maxValue : high }
                ];
            })
        };
    }


    // Just return an array with colors associated with different categories for this dataType
    else {
        const colorArray = database.map(category => category.color[themePreference]);
        const noDataColor = colors.grey[themePreference === ThemePreferences.dark ? darkShade + 400 : lightShade - 300];
        colorArray.push(noDataColor);

        return colorArray;
    }
};

export const getTextColorsForAQI = ({ themePreference = ThemePreferences.light }: {
    themePreference?: keyof ThemeColor;
}): Record<number | string, string> => {
    const obj = AQI_Database
        .reduce<Record<number | string, string>>((acc, category) => {
            return ({
                ...acc,
                [category.id]: category.color[themePreference]
            });
        }, {});

    obj[SensorStatus.offline] = INACTIVE_SENSOR_COLORS[themePreference];
    obj.screen = INACTIVE_SENSOR_COLORS.screen;

    return obj;
};
