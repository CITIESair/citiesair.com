import { AirQualityAlertKeys, getAlertDefaultPlaceholder, useAirQualityAlert } from "../../../../../ContextProviders/AirQualityAlertContext";
import AlertTypes from "../../AlertTypes";
import { SimplePicker } from "./SimplePicker";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';
import { SharedColumnHeader } from "../../Utils";
import TimeRangeSelector from "./TimeRangeSelector";
import { DataTypes } from "../../../../../Utils/AirQuality/DataTypes";
import { capitalizePhrase } from "../../../../../Utils/UtilFunctions";
import { useContext } from "react";
import { DashboardContext } from "../../../../../ContextProviders/DashboardContext";
import { HOURS } from "./HOURS";
import { Box, DialogContentText, Stack, Switch, Typography, useTheme } from "@mui/material";

import CustomMessage from "./CustomMessage";
import DaysOfWeekToggle from "./DayOfTheWeekToggle";
import MultiDaysCalendarPicker from "./MultiDaysCalendarPicker";
import { ThresholdComponentWrapper } from "./ThresholdAlertComponents/ThresholdComponentWrapper";

import { DialogData } from "../DialogData";

const returnFormattedStatusString = (editingAlert) => {
    const status = editingAlert[AirQualityAlertKeys.is_enabled] ? "enabled" : "disabled";
    const tense = editingAlert[AirQualityAlertKeys.id] ? "is" : "will be"; // if this alert doesn't have id, it's not saved in DB yet, thus we use future tense 

    return `This alert ${tense} ${status}`;
}

export const AlertPropertyComponents = ({ alertTypeKey, crudType }) => {
    const { schoolMetadata } = useContext(DashboardContext);
    const { editingAlert, allowedDataTypesForSensor, setEditingAlert } = useAirQualityAlert();

    const theme = useTheme();

    // Get the available sensors (locations) for this school
    const allSensorsOfSchool = schoolMetadata?.sensors?.map(sensor => (
        {
            value: sensor.sensor_id,
            label: capitalizePhrase(sensor.location_short)
        }
    ));

    // Helper function to check if the previous field has a value to disable this field
    const isDisabled = (key) => {
        const dependencies = {
            [AirQualityAlertKeys.sensor_id]: null,
            [AirQualityAlertKeys.datatypekey]: AirQualityAlertKeys.sensor_id,
            [AirQualityAlertKeys.days_of_week]: AirQualityAlertKeys.datatypekey,
            [AirQualityAlertKeys.excluded_dates]: AirQualityAlertKeys.datatypekey,
            [AirQualityAlertKeys.time_range]: AirQualityAlertKeys.datatypekey,
            [AirQualityAlertKeys.alert_type]: AirQualityAlertKeys.datatypekey,
            [AirQualityAlertKeys.threshold_value]: AirQualityAlertKeys.datatypekey,
            [AirQualityAlertKeys.minutespastmidnight]: AirQualityAlertKeys.datatypekey
        };

        const dependentKey = dependencies[key];

        if (!dependentKey) return false; // if this datatypekey doesnt depend on another one, always return disabled == false

        const placeholder = getAlertDefaultPlaceholder(alertTypeKey);
        return editingAlert[dependentKey] === placeholder[dependentKey];
    };

    const displayHourPicker = () => {
        switch (alertTypeKey) {
            case AlertTypes.daily.id:
                return (
                    <SimplePicker
                        icon={<AccessTimeIcon />}
                        label={AlertTypes.daily.tableColumnHeader}
                        value={editingAlert[AirQualityAlertKeys.minutespastmidnight]}
                        options={HOURS}
                        disabled={isDisabled(AirQualityAlertKeys.minutespastmidnight)}
                        handleChange={(event) => {
                            setEditingAlert({
                                ...editingAlert,
                                [AirQualityAlertKeys.minutespastmidnight]: event.target.value
                            });
                        }}
                    />
                );
            case AlertTypes.threshold.id:
                return (
                    <TimeRangeSelector
                        value={editingAlert[AirQualityAlertKeys.time_range]}
                        disabled={isDisabled(AirQualityAlertKeys.time_range)}
                        handleChange={(newRange) => {
                            setEditingAlert({
                                ...editingAlert,
                                [AirQualityAlertKeys.time_range]: newRange
                            });
                        }}
                    />
                );
            default:
                return null;
        }
    }

    const handleExcludedDatesChange = (valueArray) => {
        // Get the current excluded dates or initialize as an empty array
        const currentExcludedDates = editingAlert[AirQualityAlertKeys.excluded_dates] || [];

        // Create a new array that updates the excluded dates
        const updatedExcludedDates = valueArray.reduce((acc, date) => {
            // Check if the date is already excluded
            if (acc.includes(date)) {
                // If it exists, filter it out (remove the date)
                return acc.filter(excludedDate => excludedDate !== date);
            } else {
                // If it doesn't exist, add the date to the array
                return [...acc, date];
            }
        }, currentExcludedDates); // Start with the current excluded dates

        // Update the state with the new excluded_dates array
        setEditingAlert({
            ...editingAlert,
            [AirQualityAlertKeys.excluded_dates]: updatedExcludedDates
        });
    };

    return (
        <Stack
            direction="column"
            spacing={3}
            mt={1}
            width="100%"
        >
            {
                DialogData[crudType]?.contentText ?
                    (
                        <DialogContentText fontWeight="500">
                            {DialogData[crudType].contentText}
                        </DialogContentText>
                    ) : null
            }

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
            >
                <Switch
                    size='small'
                    checked={editingAlert[AirQualityAlertKeys.is_enabled]}
                    onChange={(event) => {
                        setEditingAlert({
                            ...editingAlert,
                            [AirQualityAlertKeys.is_enabled]: event.target.checked
                        });
                    }}
                    disabled={isDisabled(AirQualityAlertKeys.is_enabled)}
                />
                <Typography
                    fontWeight={500}
                    color="text.secondary"
                >
                    {returnFormattedStatusString(editingAlert)}
                </Typography>
            </Stack>

            <SimplePicker
                icon={<PlaceIcon />}
                label={SharedColumnHeader.location}
                value={editingAlert[AirQualityAlertKeys.sensor_id]}
                options={allSensorsOfSchool}
                disabled={isDisabled(AirQualityAlertKeys.sensor_id)}
                handleChange={(event) => {
                    setEditingAlert({
                        ...editingAlert,
                        [AirQualityAlertKeys.sensor_id]: event.target.value,
                        [AirQualityAlertKeys.datatypekey]: ''
                    });
                }}
            />

            <SimplePicker
                icon={<CategoryIcon />}
                label={SharedColumnHeader.dataType}
                value={editingAlert[AirQualityAlertKeys.datatypekey]}
                options={allowedDataTypesForSensor}
                disabled={isDisabled(AirQualityAlertKeys.datatypekey)}
                handleChange={(event) => {
                    const selectedDataTypeKey = event.target.value;
                    const dataType = DataTypes[selectedDataTypeKey];

                    setEditingAlert({
                        ...editingAlert,
                        [AirQualityAlertKeys.datatypekey]: selectedDataTypeKey,
                        [AirQualityAlertKeys.threshold_value]: theme.palette.chart.colorAxes[dataType.color_axis]?.defaultValueForAlert
                    });
                }}
            />

            <DaysOfWeekToggle
                value={editingAlert[AirQualityAlertKeys.days_of_week]}
                disabled={isDisabled(AirQualityAlertKeys.days_of_week)}
                handleChange={(_, newValue) => {
                    const validDaysOfWeek = Array.isArray(newValue) ? newValue : [];

                    setEditingAlert({
                        ...editingAlert,
                        [AirQualityAlertKeys.days_of_week]: validDaysOfWeek.sort()
                    });
                }}
            />

            {displayHourPicker(alertTypeKey)}

            <Box
                sx={{ marginTop: "0 !important" }}
            >
                <MultiDaysCalendarPicker
                    selectedDates={editingAlert[AirQualityAlertKeys.excluded_dates] || []}
                    disabled={isDisabled(AirQualityAlertKeys.excluded_dates)}
                    handleChange={handleExcludedDatesChange}
                />
            </Box>

            {alertTypeKey === AlertTypes.threshold.id ?
                (
                    <ThresholdComponentWrapper
                        disabledToggle={isDisabled(AirQualityAlertKeys.alert_type)}
                        disabledSlider={isDisabled(AirQualityAlertKeys.threshold_value)}
                    />
                ) : null}

            <CustomMessage
                value={editingAlert[AirQualityAlertKeys.message]}
                handleChange={(event) => {
                    setEditingAlert({
                        ...editingAlert,
                        [AirQualityAlertKeys.message]: event.target.value
                    });
                }}
                maxLength={200}
            />
        </Stack>
    );
}