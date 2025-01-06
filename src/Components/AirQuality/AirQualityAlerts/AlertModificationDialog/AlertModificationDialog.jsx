import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Stack, useMediaQuery, Typography, Grid, Switch } from '@mui/material';
import { useTheme } from '@emotion/react';
import AlertTypes from '../AlertTypes';
import { ThresholdAlertTypes } from '../AlertTypes';
import { CrudTypes, SharedColumnHeader } from '../Utils';

import { AirQualityAlertKeys, getAlertPlaceholder, useAirQualityAlert } from '../../../../ContextProviders/AirQualityAlertContext';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';

import { capitalizePhrase } from '../../../../Utils/UtilFunctions';
import { DataTypeKeys, DataTypes } from '../../../../Utils/AirQuality/DataTypes';
import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../../../../ContextProviders/DashboardContext';
import { fetchDataFromURL } from '../../../../API/ApiFetch';
import { RESTmethods } from "../../../../API/Utils";
import { getAlertsApiUrl } from '../../../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../../../API/Utils";
import { generateCssBackgroundGradient } from '../../../../Utils/Gradient/GradientUtils';
import { AQI_Database, VOC_Database } from '../../../../Utils/AirQuality/AirQualityIndexHelper';

import { DialogData } from './DialogData';
import { ThresholdTypeToggle } from './ThresholdTypeToggle';
import { SimplePicker } from './SimplePicker';
import { HOURS } from './HOURS';
import { ThresholdSlider } from './ThresholdSlider';
import { SnackbarMetadata } from '../../../../Utils/SnackbarMetadata';

import isEqual from 'lodash.isequal';
import DaysOfWeekToggle from './DayOfTheWeekToggle';
import MultiDaysCalendarPicker from './MultiDaysCalendarPicker';
import AlertDeletionDialog from './AlertDeletionDialog';
import { useSnackbar } from 'notistack';

const returnFormattedStatusString = (editingAlert) => {
  const status = editingAlert[AirQualityAlertKeys.is_enabled] ? "enabled" : "disabled";
  const tense = editingAlert[AirQualityAlertKeys.id] ? "is" : "will be"; // if this alert doesn't have id, it's not saved in DB yet, thus we use future tense 

  return `This alert ${tense} ${status}`;
}

const AlertModificationDialog = (props) => {
  const {
    alertTypeKey,
    openAlertModificationDialog,
    crudType,
    handleClose
  } = props;

  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const { selectedAlert, setSelectedAlert, editingAlert, allowedDataTypesForSensor, setEditingAlert, setAlerts } = useAirQualityAlert();

  const [shouldDisableButton, setShouldDisableButton] = useState(false);

  const { enqueueSnackbar } = useSnackbar()

  const handleCurrentSensorChange = (event) => {
    const newSensor = event.target.value;
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.sensor_id]: newSensor,
      [AirQualityAlertKeys.datatypekey]: ''
    });
  }

  const handleCurrentDataTypeChange = (event) => {
    const selectedDataTypeKey = event.target.value;
    const dataType = DataTypes[selectedDataTypeKey];
    const dataTypeColorAxis = theme.palette.chart.colorAxes[dataType.color_axis];
    const { defaultValueForAlert } = dataTypeColorAxis;

    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.datatypekey]: selectedDataTypeKey,
      [AirQualityAlertKeys.threshold_value]: defaultValueForAlert
    });
  }

  const handleCurrentDaysOfWeekChange = (_, newDaysOfWeek) => {
    const validDaysOfWeek = Array.isArray(newDaysOfWeek) ? newDaysOfWeek : [];

    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.days_of_week]: validDaysOfWeek.sort()
    });
  }

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


  const handleCurrentMinutesPastMidnightChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.minutespastmidnight]: event.target.value
    });
  }

  const handleIsEnabledChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.is_enabled]: event.target.checked
    });
  }

  const theme = useTheme();

  const locations = schoolMetadata?.sensors?.map(sensor => (
    {
      value: sensor.sensor_id,
      label: capitalizePhrase(sensor.location_short)
    }
  ));

  const returnDialogContent = () => {

    // Helper function to check if the previous field has a value to disable this field
    const isDisabled = (key) => {
      const dependencies = {
        [AirQualityAlertKeys.sensor_id]: null,
        [AirQualityAlertKeys.datatypekey]: AirQualityAlertKeys.sensor_id,
        [AirQualityAlertKeys.days_of_week]: AirQualityAlertKeys.datatypekey,
        [AirQualityAlertKeys.excluded_dates]: AirQualityAlertKeys.datatypekey,
        [AirQualityAlertKeys.alert_type]: AirQualityAlertKeys.datatypekey,
        [AirQualityAlertKeys.threshold_value]: AirQualityAlertKeys.datatypekey,
        [AirQualityAlertKeys.minutespastmidnight]: AirQualityAlertKeys.datatypekey
      };

      const dependentKey = dependencies[key];

      if (!dependentKey) return false; // if this datatypekey doesnt depend on another one, always return disabled == false

      const placeholder = getAlertPlaceholder(alertTypeKey);
      return editingAlert[dependentKey] === placeholder[dependentKey];
    };

    let alertTypeSpecificData = null;

    switch (alertTypeKey) {
      case AlertTypes.daily.id:
        alertTypeSpecificData = (
          <SimplePicker
            icon={<AccessTimeIcon />}
            label={AlertTypes.daily.tableColumnHeader}
            value={editingAlert[AirQualityAlertKeys.minutespastmidnight]}
            options={HOURS}
            disabled={isDisabled(AirQualityAlertKeys.minutespastmidnight)}
            handleChange={handleCurrentMinutesPastMidnightChange}
          />
        );
        break;
      case AlertTypes.threshold.id:
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

          if (currentDataTypeKey === DataTypeKeys.voc) {
            database = VOC_Database;
          } else if ([DataTypeKeys.aqi, DataTypeKeys.pm2_5, DataTypeKeys.pm10_raw, DataTypeKeys.co2].includes(currentDataTypeKey)) {
            database = AQI_Database;
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
              disabled={isDisabled(AirQualityAlertKeys.threshold_value)}
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

        alertTypeSpecificData = (
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
                disabled={isDisabled(AirQualityAlertKeys.alert_type)}
                sx={{
                  height: "100%"
                }}
              />
            </Grid>

            {thresholdSlider}
          </Grid>
        )
        break;
      default:
        break;

    }
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
            onChange={handleIsEnabledChange}
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
          options={locations}
          disabled={isDisabled(AirQualityAlertKeys.sensor_id)}
          handleChange={handleCurrentSensorChange}
        />

        <SimplePicker
          icon={<CategoryIcon />}
          label={SharedColumnHeader.dataType}
          value={editingAlert[AirQualityAlertKeys.datatypekey]}
          options={allowedDataTypesForSensor}
          disabled={isDisabled(AirQualityAlertKeys.datatypekey)}
          handleChange={handleCurrentDataTypeChange}
        />

        <DaysOfWeekToggle
          value={editingAlert[AirQualityAlertKeys.days_of_week]}
          disabled={isDisabled(AirQualityAlertKeys.days_of_week)}
          handleChange={handleCurrentDaysOfWeekChange}
        />

        <MultiDaysCalendarPicker
          selectedDates={editingAlert[AirQualityAlertKeys.excluded_dates] || []}
          disabled={isDisabled(AirQualityAlertKeys.excluded_dates)}
          handleChange={handleExcludedDatesChange}
        />

        {alertTypeSpecificData}

      </Stack>
    );
  }

  const handleAlertModification = ({ passedCrudType }) => {
    const handleFetchError = (error) => {
      enqueueSnackbar(DialogData[passedCrudType].errorMessage, {
        variant: SnackbarMetadata.error.name,
        duration: SnackbarMetadata.error.duration
      });
    };

    const handleFetchSuccess = () => {
      enqueueSnackbar(DialogData[passedCrudType].successMessage, {
        variant: SnackbarMetadata.success.name,
        duration: SnackbarMetadata.success.duration
      });
      handleClose();
    }

    switch (passedCrudType) {
      case CrudTypes.add:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID
          }),
          restMethod: RESTmethods.POST,
          body: editingAlert
        }).then((data) => {
          setAlerts(prevAlerts => [...prevAlerts, data]);
          handleFetchSuccess();

          const placeholder = getAlertPlaceholder(alertTypeKey);
          setSelectedAlert(placeholder);
          setEditingAlert(placeholder);
        }).catch((error) => handleFetchError(error));

        break;
      case CrudTypes.edit:
        const alert_id = selectedAlert[AirQualityAlertKeys.id];
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID,
            alert_id: alert_id
          }),
          restMethod: RESTmethods.PUT,
          body: editingAlert
        }).then((data) => {
          setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
              alert.id === alert_id ? data : alert
            )
          );
          handleFetchSuccess();
        }).catch((error) => handleFetchError(error));

        break;
      case CrudTypes.delete:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralAPIendpoints.alerts,
            school_id: currentSchoolID,
            alert_id: selectedAlert.id
          }),
          restMethod: RESTmethods.DELETE
        }).then(() => {
          setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== selectedAlert.id));
          handleFetchSuccess();
        }).catch((error) => handleFetchError(error));

        break;
      default:
        break;
    }
  }

  // Disable / Enable save button depends on context
  useEffect(() => {
    switch (crudType) {
      case CrudTypes.add:
        const placeholder = getAlertPlaceholder(alertTypeKey);

        if (editingAlert[AirQualityAlertKeys.sensor_id] === placeholder[AirQualityAlertKeys.sensor_id] ||
          editingAlert[AirQualityAlertKeys.datatypekey] === placeholder[AirQualityAlertKeys.datatypekey]) {
          if (alertTypeKey === AlertTypes.daily.id) {
            setShouldDisableButton(editingAlert[AirQualityAlertKeys.minutespastmidnight] === placeholder[AirQualityAlertKeys.minutespastmidnight]);
          } else {
            setShouldDisableButton(true);
          }
        } else {
          if (alertTypeKey === AlertTypes.daily.id) {
            setShouldDisableButton(editingAlert[AirQualityAlertKeys.minutespastmidnight] === placeholder[AirQualityAlertKeys.minutespastmidnight]);
          } else {
            setShouldDisableButton(false);
          }
        }
        break;

      case CrudTypes.edit:
        setShouldDisableButton(isEqual(selectedAlert, editingAlert));
        break;
      default:
        setShouldDisableButton(false);
        break;
    }
  }, [crudType, selectedAlert, editingAlert, alertTypeKey]);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={openAlertModificationDialog}
      onClose={handleClose}
      aria-labelledby="alert-modification-dialog"
      maxWidth="xs"
      fullWidth
      fullScreen={smallScreen}
    >
      <DialogTitle id="alert-modification-dialog">
        {DialogData[crudType]?.title}
      </DialogTitle>

      <DialogContent>
        {returnDialogContent()}
      </DialogContent>
      <DialogActions sx={{
        justifyContent: "space-between"
      }}>
        {
          crudType === CrudTypes.edit ? (
            <AlertDeletionDialog
              onConfirmedDelete={() => {
                handleAlertModification({ passedCrudType: CrudTypes.delete })
              }}
            />
          ) : null
        }

        <Stack direction="row" width="100%" justifyContent="end">
          <Button
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAlertModification({ passedCrudType: crudType })
            }}
            color="primary"
            disabled={shouldDisableButton}
          >
            Save Edit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModificationDialog;


