import AlertTypes, { ThresholdAlertTypes } from "../../AlertTypes";
import { SimplePicker } from "./SimplePicker";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import { AirQualityAlertKeys, getAlertDefaultPlaceholder, SharedColumnHeader } from "../../AlertUtils";
import TimeRangeSelector from "../../../../TimeRange/TimeRangeSelector";
import { DataTypes } from "../../../../../Utils/AirQuality/DataTypes";
import { capitalizePhrase } from "../../../../../Utils/UtilFunctions";
import { HOURS } from "../../../../TimeRange/TimeRangeUtils";
import { Checkbox, DialogContentText, FormControlLabel, FormGroup, Grid, Stack, Switch, Typography, useTheme } from "@mui/material";

import OptionalMessage from "./OptionalMessage";
import DateSelector from "./DaySelector";
import { ThresholdComponentWrapper } from "./ThresholdAlertComponents/ThresholdComponentWrapper";

import { DialogData } from "../DialogData";
import { MaxOnceADayCheckbox } from "./MaxOnceADayCheckbox";
import { ThresholdType, ThresholdTypeToggle } from "./ThresholdAlertComponents/ThresholdTypeToggle";

import useSchoolMetadata from "../../../../../hooks/useSchoolMetadata";
import { useContext } from "react";
import { AirQualityAlertContext } from "../../../../../ContextProviders/AirQualityAlertContext";

const returnFormattedStatusString = (editingAlert) => {
    const status = editingAlert[AirQualityAlertKeys.is_enabled] ? "enabled" : "disabled";
    const tense = editingAlert[AirQualityAlertKeys.id] ? "is" : "will be"; // if this alert doesn't have id, it's not d in DB yet, thus we use future tense 

    return `This alert ${tense} ${status}`;
}

export const AlertPropertyComponents = ({ alertTypeKey, crudType }) => {
    const { data: schoolMetadata } = useSchoolMetadata();
    const { editingAlert, allowedDataTypesForSensor, setEditingAlert } = useContext(AirQualityAlertContext);

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
        switch (key) {
            case AirQualityAlertKeys.sensor_id:
            case AirQualityAlertKeys.is_enabled:
                // sensor_id and is_enabled can never be disabled because it's the first field
                return false;

            case AirQualityAlertKeys.datatypekey:
                // datatypekey depends on sensor_id having a placeholder value
                return editingAlert[AirQualityAlertKeys.sensor_id] === getAlertDefaultPlaceholder(alertTypeKey)[AirQualityAlertKeys.sensor_id];

            case AirQualityAlertKeys.child_alert:
                // child_alert depends on has_child_alert being true
                return editingAlert[AirQualityAlertKeys.has_child_alert] !== true;

            default:
                // all other fields depends on datatypekey having a placeholder value
                return editingAlert[AirQualityAlertKeys.datatypekey] === getAlertDefaultPlaceholder(alertTypeKey)[AirQualityAlertKeys.datatypekey];
        }
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
                    <Grid container columnSpacing={2} rowSpacing={0.5}>
                        <Grid item xs={12} md={6}>
                            <TimeRangeSelector
                                timeRange={editingAlert[AirQualityAlertKeys.time_range]}
                                defaultTimeRange={getAlertDefaultPlaceholder(AlertTypes.threshold.id)[AirQualityAlertKeys.time_range]}
                                disabled={isDisabled(AirQualityAlertKeys.time_range)}
                                handleChange={(newRange) => {
                                    setEditingAlert({
                                        ...editingAlert,
                                        [AirQualityAlertKeys.time_range]: newRange
                                    });
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MaxOnceADayCheckbox
                                value={editingAlert[AirQualityAlertKeys.max_once_a_day]}
                                handleChange={(event) => {
                                    setEditingAlert({
                                        ...editingAlert,
                                        [AirQualityAlertKeys.max_once_a_day]: event.target.checked
                                    })
                                }}
                                disabled={isDisabled(AirQualityAlertKeys.max_once_a_day)}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    }

    return (
        <Stack
            direction="column"
            gap={2}
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
                gap={1}
                alignItems="center"
                mb={2}
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

            <Grid
                container
                columnSpacing={2}
                alignItems="center"
            >
                <Grid item xs={6}>
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
                </Grid>

                <Grid item xs={6}>
                    <SimplePicker
                        label={SharedColumnHeader.dataType}
                        value={editingAlert[AirQualityAlertKeys.datatypekey]}
                        options={allowedDataTypesForSensor}
                        disabled={isDisabled(AirQualityAlertKeys.datatypekey)}
                        handleChange={(event) => {
                            const selectedDataTypeKey = event.target.value;
                            const dataType = DataTypes[selectedDataTypeKey];

                            // After data type is determined, set the threshold value to defaultValueForAlert
                            setEditingAlert({
                                ...editingAlert,
                                [AirQualityAlertKeys.datatypekey]: selectedDataTypeKey,
                                [AirQualityAlertKeys.threshold_value]: theme.palette.chart.colorAxes[dataType.color_axis]?.defaultValueForAlert,
                                [AirQualityAlertKeys.child_alert]: {
                                    ...editingAlert[AirQualityAlertKeys.child_alert],
                                    [AirQualityAlertKeys.threshold_value]: theme.palette.chart.colorAxes[dataType.color_axis]?.defaultValueForChildAlert
                                }
                            });
                        }}
                        flex={1}
                    />
                </Grid>
            </Grid>

            <DateSelector
                daysOfWeek={editingAlert[AirQualityAlertKeys.days_of_week]}
                excludedDates={editingAlert[AirQualityAlertKeys.excluded_dates] || []}
                disabled={isDisabled(AirQualityAlertKeys.days_of_week)}
                handleDaysOfWeekChange={(_, newValue) => {
                    const validDaysOfWeek = Array.isArray(newValue) ? newValue : [];

                    setEditingAlert({
                        ...editingAlert,
                        [AirQualityAlertKeys.days_of_week]: validDaysOfWeek.sort()
                    });
                }}
                handleExcludedDatesChange={(valueArray) => {
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
                }}
            />


            {displayHourPicker(alertTypeKey)}

            {alertTypeKey === AlertTypes.threshold.id ?
                (
                    <Grid container alignItems="start" spacing={2}>
                        <Grid container item xs={12} sm={6}>
                            <Grid item xs={12}>
                                <Typography
                                    variant='body1'
                                    fontWeight={500}
                                    color="text.secondary"
                                    sx={{ mt: "2px", mb: "12px" }} // absolute value to align with the other side
                                >
                                    1. Alert if it is:
                                </Typography>
                            </Grid>

                            <Grid item sx={{ mr: 2 }}>
                                <ThresholdTypeToggle
                                    currentAlertType={editingAlert[AirQualityAlertKeys.alert_type]}
                                    handleChange={(event) => {
                                        const selectedAlertType = event.target.value;
                                        const oppositeAlertTypeForChildAlert = selectedAlertType === ThresholdAlertTypes.above_threshold.id
                                            ? ThresholdAlertTypes.below_threshold.id
                                            : ThresholdAlertTypes.above_threshold.id;

                                        setEditingAlert({
                                            ...editingAlert,
                                            [AirQualityAlertKeys.alert_type]: selectedAlertType,
                                            [AirQualityAlertKeys.child_alert]: {
                                                ...editingAlert[AirQualityAlertKeys.child_alert],
                                                [AirQualityAlertKeys.alert_type]: oppositeAlertTypeForChildAlert
                                            }
                                        });
                                    }}
                                    disabled={isDisabled(AirQualityAlertKeys.alert_type)}
                                    sx={{
                                        height: "100%"
                                    }}
                                />
                            </Grid>

                            <ThresholdComponentWrapper
                                value={editingAlert[AirQualityAlertKeys.threshold_value]}
                                invertSelection={editingAlert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.below_threshold.id}
                                handleValueChange={(value) => {
                                    setEditingAlert({
                                        ...editingAlert,
                                        [AirQualityAlertKeys.threshold_value]: value
                                    });
                                }}
                                disabledToggle={isDisabled(AirQualityAlertKeys.alert_type)}
                                disabledSlider={isDisabled(AirQualityAlertKeys.threshold_value)}
                                placeholderValueBeforeDataTypeSelection={2 / 3}
                            />

                            <Grid item xs={12} mt={2}>
                                <OptionalMessage
                                    value={editingAlert[AirQualityAlertKeys.message]}
                                    handleChange={(event) => {
                                        setEditingAlert({
                                            ...editingAlert,
                                            [AirQualityAlertKeys.message]: event.target.value
                                        });
                                    }}
                                    maxLength={200}
                                    label="Optional Message for Main Alert"
                                    disabled={isDisabled(AirQualityAlertKeys.message)}
                                />
                            </Grid>

                        </Grid>
                        <Grid container item xs={12} sm={6}>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel
                                        disabled={isDisabled(AirQualityAlertKeys.has_child_alert)}
                                        control={
                                            <Checkbox
                                                checked={!!editingAlert[AirQualityAlertKeys.has_child_alert]} // fallback in case undefined in first render
                                                onChange={(event) => {
                                                    setEditingAlert({
                                                        ...editingAlert,
                                                        [AirQualityAlertKeys.has_child_alert]: event.target.checked
                                                    });
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography
                                                variant={'body1'}
                                                fontWeight={500}
                                                color="text.secondary"
                                            >
                                                2. [Optional] Follow-up alert if it changes to:
                                            </Typography>
                                        }
                                        color="text.secondary"
                                    />
                                </FormGroup>
                            </Grid>

                            {
                                editingAlert[AirQualityAlertKeys.child_alert] && (
                                    <>
                                        <Grid item sx={{ mr: 2 }}>
                                            <ThresholdType
                                                currentAlertType={editingAlert[AirQualityAlertKeys.child_alert]?.[AirQualityAlertKeys.alert_type]}
                                                sx={{
                                                    height: "100%"
                                                }}
                                            />
                                        </Grid>

                                        <ThresholdComponentWrapper
                                            value={editingAlert[AirQualityAlertKeys.child_alert][AirQualityAlertKeys.threshold_value]}
                                            invertSelection={editingAlert[AirQualityAlertKeys.child_alert]?.[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.below_threshold.id || true}
                                            handleValueChange={(value) => {
                                                setEditingAlert({
                                                    ...editingAlert,
                                                    [AirQualityAlertKeys.child_alert]: {
                                                        ...editingAlert[AirQualityAlertKeys.child_alert],
                                                        [AirQualityAlertKeys.threshold_value]: value
                                                    }
                                                });
                                            }}
                                            disabledToggle={isDisabled(AirQualityAlertKeys.child_alert)}
                                            disabledSlider={isDisabled(AirQualityAlertKeys.child_alert)}
                                            showTip={false}
                                            placeholderValueBeforeDataTypeSelection={1 / 3}
                                        />

                                        <Grid item xs={12} mt={2}>
                                            <OptionalMessage
                                                value={editingAlert[AirQualityAlertKeys.child_alert][AirQualityAlertKeys.message]}
                                                handleChange={(event) => {
                                                    setEditingAlert({
                                                        ...editingAlert,
                                                        [AirQualityAlertKeys.child_alert]: {
                                                            ...editingAlert[AirQualityAlertKeys.child_alert],
                                                            [AirQualityAlertKeys.message]: event.target.value
                                                        }
                                                    });
                                                }}
                                                maxLength={200}
                                                label="Optional Message for Follow-up Alert"
                                                showTip={false}
                                                disabled={isDisabled(AirQualityAlertKeys.child_alert)}
                                            />
                                        </Grid>
                                    </>
                                )
                            }
                        </Grid>
                    </Grid>

                ) : (
                    <OptionalMessage
                        value={editingAlert[AirQualityAlertKeys.message]}
                        handleChange={(event) => {
                            setEditingAlert({
                                ...editingAlert,
                                [AirQualityAlertKeys.message]: event.target.value
                            });
                        }}
                        maxLength={200}
                        disabled={isDisabled(AirQualityAlertKeys.message)}
                    />
                )}
        </Stack>
    );
}