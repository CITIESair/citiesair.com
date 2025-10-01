import { ThresholdSlider } from "./ThresholdSlider";
import { DataTypeKeys, DataTypes } from "../../../../../../Utils/AirQuality/DataTypes";
import { AirQualityAlertKeys, useAirQualityAlert } from "../../../../../../ContextProviders/AirQualityAlertContext";
import { AQI_Database, HeatIndex_Database, VOC_Database } from "../../../../../../Utils/AirQuality/AirQualityIndexHelper";
import { useTheme } from '@mui/material';
import { generateCssBackgroundGradient } from "../../../../../../Utils/Gradient/GradientUtils";
import { getTranslation } from "../../../../../../Utils/UtilFunctions";
import { useContext } from "react";
import { PreferenceContext } from "../../../../../../ContextProviders/PreferenceContext";

export const ThresholdComponentWrapper = (props) => {
    const {
        value,
        invertSelection,
        handleValueChange,
        placeholderValueBeforeDataTypeSelection = 0.5,
        disabledSlider,
        showTip = true
    } = props;

    const { editingAlert } = useAirQualityAlert();
    const theme = useTheme();
    const { language } = useContext(PreferenceContext);

    let thresholdSlider = null;

    const currentDataTypeKey = editingAlert[AirQualityAlertKeys.datatypekey];
    if (currentDataTypeKey && DataTypes[currentDataTypeKey]) {
        const dataType = DataTypes[currentDataTypeKey];
        const dataTypeColorAxis = theme.palette.chart.colorAxes[dataType.color_axis];
        const { colors, minValue, maxValue, defaultValueForAlert, stepsForThreshold } = dataTypeColorAxis;

        const backgroundCssGradient = generateCssBackgroundGradient({
            gradientDirection: 'to top',
            colors: colors
        });

        // Check if this dataType exists in the AQI_Database
        // If yes, return value and label accordingly to the marks
        let marks, database;

        switch (currentDataTypeKey) {
            case DataTypeKeys.voc:
                database = VOC_Database;
                break;
            case DataTypeKeys.aqi:
            case DataTypeKeys.pm2_5:
            case DataTypeKeys.pm10_raw:
            case DataTypeKeys.co2:
                database = AQI_Database;
                break;
            case DataTypeKeys.heat_index_C:
                database = HeatIndex_Database;
                break;
            default:
                database = null;
        }

        if (database) {
            marks = database
                .filter((_, index) => index !== 0) // do not return the lowest category
                .map((element) => {
                    const val = element[dataType.threshold_mapping_name].low;
                    return {
                        value: val,
                        label: getTranslation(element.category, language)
                    }
                })
        }

        const inputUnit = Object.keys(DataTypes)
            .filter(key => key === editingAlert[AirQualityAlertKeys.datatypekey])
            .map(key => DataTypes[key].unit)[0]

        thresholdSlider = (
            <ThresholdSlider
                min={minValue}
                max={maxValue}
                marks={marks}
                defaultValue={defaultValueForAlert}
                value={value}
                stepsForThreshold={stepsForThreshold}
                disabled={disabledSlider}
                backgroundCssGradient={backgroundCssGradient}
                invertSelection={invertSelection}
                handleChange={handleValueChange}
                inputUnit={inputUnit}
                showTip={showTip}
            />
        )
    } else {
        thresholdSlider = (
            <ThresholdSlider
                min={0}
                max={1}
                value={placeholderValueBeforeDataTypeSelection}
                disabled={true}
                showInput={false}
                invertSelection={invertSelection}
                valueLabelDisplay="off"
                showTip={showTip}
            />
        )
    }

    return thresholdSlider;
}