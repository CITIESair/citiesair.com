import { Grid, Typography } from "@mui/material";
import { ThresholdSlider } from "./ThresholdSlider";
import { ThresholdTypeToggle } from "./ThresholdTypeToggle";
import { DataTypeKeys, DataTypes } from "../../../../../../Utils/AirQuality/DataTypes";
import { AirQualityAlertKeys, useAirQualityAlert } from "../../../../../../ContextProviders/AirQualityAlertContext";
import { AQI_Database, HeatIndex_Database, VOC_Database } from "../../../../../../Utils/AirQuality/AirQualityIndexHelper";
import { useTheme } from '@mui/material';
import { generateCssBackgroundGradient } from "../../../../../../Utils/Gradient/GradientUtils";
import { ThresholdAlertTypes } from "../../../AlertTypes";

export const ThresholdComponentWrapper = ({ disabledToggle, disabledSlider }) => {
    const { editingAlert, setEditingAlert } = useAirQualityAlert();

    const handleCurrentThresholdValueChange = (value) => {
        setEditingAlert({
            ...editingAlert,
            [AirQualityAlertKeys.threshold_value]: value
        });
    }

    const handleCurrentAlertTypeChange = (event) => {
        setEditingAlert({
            ...editingAlert,
            [AirQualityAlertKeys.alert_type]: event.target.value
        });
    }

    const theme = useTheme();

    let thresholdSlider = null;

    const currentDataTypeKey = editingAlert[AirQualityAlertKeys.datatypekey];
    if (currentDataTypeKey && currentDataTypeKey !== "") {
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
        const invertSelection = editingAlert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.below_threshold.id;

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
                .map((elem) => {
                    const val = elem[dataType.threshold_mapping_name].low;
                    return {
                        value: val,
                        label: elem.category
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
                value={editingAlert[AirQualityAlertKeys.threshold_value]}
                stepsForThreshold={stepsForThreshold}
                disabled={disabledSlider}
                backgroundCssGradient={backgroundCssGradient}
                invertSelection={invertSelection}
                handleChange={handleCurrentThresholdValueChange}
                inputUnit={inputUnit}
            />
        )
    } else {
        thresholdSlider = (
            <ThresholdSlider
                min={0}
                max={100}
                defaultValue={50}
                value={50}
                disabled={true}
                showInput={false}
            />
        )
    }

    return (
        <Grid
            container
            alignItems="stretch"
        >
            <Grid item xs={12}>
                <Typography
                    variant='body1'
                    fontWeight={500}
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Alert me if {DataTypes[currentDataTypeKey]?.name_title || 'selected data type'} is:
                </Typography>
            </Grid>

            <Grid item sx={{ mr: 2 }}>
                <ThresholdTypeToggle
                    thisAlertType={editingAlert[AirQualityAlertKeys.alert_type]}
                    handleChange={handleCurrentAlertTypeChange}
                    disabled={disabledToggle}
                    sx={{
                        height: "100%"
                    }}
                />
            </Grid>

            {thresholdSlider}
        </Grid>
    )
}