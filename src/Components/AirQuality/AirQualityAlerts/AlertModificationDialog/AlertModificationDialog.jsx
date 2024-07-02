import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Stack, Alert, useMediaQuery, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import AlertTypes from '../AlertTypes';
import { ThresholdAlertTypes } from '../AlertTypes';
import { CrudTypes, SharedColumnHeader } from '../Utils';

import { AirQualityAlertKeys, useAirQualityAlert } from '../../../../ContextProviders/AirQualityAlertContext';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';

import { capitalizePhrase } from '../../../../Utils/Utils';
import AQIDataTypes from '../../../../Utils/AirQuality/DataTypes';
import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../../../../ContextProviders/DashboardContext';
import { RESTmethods, fetchDataFromURL } from '../../../../Utils/ApiFunctions/ApiCalls';
import { GeneralEndpoints, getAlertsApiUrl } from '../../../../Utils/ApiFunctions/ApiUtils';
import { generateCssBackgroundGradient } from '../../../../Utils/Gradient/GradientUtils';
import AQIdatabase, { vocDatabase } from '../../../../Utils/AirQuality/AirQualityIndexHelper';

import { DialogData } from './DialogData';
import { ThresholdTypeToggle } from './ThresholdTypeToggle';
import { SimplePicker } from './SimplePicker';
import { HOURS } from './HOURS';
import { ThresholdSlider } from './ThresholdSlider';

const AlertModificationDialog = (props) => {
  const {
    alertTypeKey,
    openAlertModificationDialog,
    crudType,
    handleClose
  } = props;

  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const { selectedAlert, editingAlert, allowedDataTypesForSensor, setEditingAlert, setAlerts } = useAirQualityAlert();

  const [shouldDisableButton, setShouldDisableButton] = useState(false);

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    setAlertMessage();
  }, [crudType]);

  const handleCurrentSensorChange = (event) => {
    const newSensor = event.target.value;
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.sensor_id]: newSensor,
      [AirQualityAlertKeys.datatypekey]: ''
    });
  }

  const handleCurrentDataTypeChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.datatypekey]: event.target.value
    });
  }

  const handleCurrentThresholdValueChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.threshold_value]: event.target.value
    });
  }

  const handleCurrentAlertTypeChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.alert_type]: event.target.value
    });
  }

  const handleCurrentMinutesPastMidnightChange = (event) => {
    setEditingAlert({
      ...editingAlert,
      [AirQualityAlertKeys.minutespastmidnight]: event.target.value
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
    const disabled = crudType === CrudTypes.delete;

    let alertTypeSpecificData = null;

    switch (alertTypeKey) {
      case AlertTypes.daily.id:
        alertTypeSpecificData = (
          <SimplePicker
            icon={<AccessTimeIcon />}
            label={AlertTypes.daily.tableColumnHeader}
            value={editingAlert[AirQualityAlertKeys.minutespastmidnight]}
            options={HOURS}
            disabled={disabled}
            handleChange={handleCurrentMinutesPastMidnightChange}
          />
        );
        break;
      case AlertTypes.threshold.id:
        let thresholdSlider = null;

        const currentDataTypeKey = editingAlert[AirQualityAlertKeys.datatypekey];
        if (currentDataTypeKey) {
          const dataType = AQIDataTypes[currentDataTypeKey];
          const dataTypeColorAxis = theme.palette.chart.colorAxes[dataType.color_axis];
          const { colors, minValue, maxValue, defaultValueForAlert } = dataTypeColorAxis;

          const backgroundCssGradient = generateCssBackgroundGradient({
            gradientDirection: 'to top',
            colors: colors
          });

          // Check if this dataType exists in the AQIdatabase
          // If yes, return value and label accordingly to the marks
          let marks, database;
          const invertSelection = editingAlert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.below_threshold.id;

          if (dataType === AQIDataTypes.voc) {
            database = vocDatabase;
          } else if ([AQIDataTypes.aqi, AQIDataTypes['pm2.5'], AQIDataTypes.pm10_raw].includes(dataType)) {
            database = AQIdatabase;
          }
          if (database) {
            marks = database.map((elem) => {
              const val = elem[dataType.threshold_mapping_name].low;
              return {
                value: val,
                label: elem.category
              }
            })
          }

          thresholdSlider = (
            <ThresholdSlider
              min={minValue}
              max={maxValue}
              marks={marks}
              defaultValue={defaultValueForAlert}
              value={editingAlert[AirQualityAlertKeys.threshold_value]}
              disabled={disabled}
              backgroundCssGradient={backgroundCssGradient}
              invertSelection={invertSelection}
              handleChange={handleCurrentThresholdValueChange}
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
          <Stack direction="column" spacing={1}>
            <Typography variant='body1' fontWeight={500} color="text.secondary">
              Alert me if {AQIDataTypes[currentDataTypeKey]?.name_short || 'selected data type'} is:
            </Typography>
            <ThresholdTypeToggle
              thisAlertType={editingAlert[AirQualityAlertKeys.alert_type]}
              handleChange={handleCurrentAlertTypeChange}
              disabled={disabled}
            />
            {thresholdSlider}
          </Stack>
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
              <DialogContentText>
                {DialogData[crudType].contentText}
              </DialogContentText>
            ) : null
        }

        <SimplePicker
          icon={<PlaceIcon />}
          label={SharedColumnHeader.location}
          value={editingAlert[AirQualityAlertKeys.sensor_id]}
          options={locations}
          disabled={disabled}
          handleChange={handleCurrentSensorChange}
        />

        <SimplePicker
          icon={<CategoryIcon />}
          label={SharedColumnHeader.dataType}
          value={editingAlert[AirQualityAlertKeys.datatypekey]}
          options={allowedDataTypesForSensor}
          disabled={disabled}
          handleChange={handleCurrentDataTypeChange}
        />

        {alertTypeSpecificData}

      </Stack>
    );
  }

  const handleAlertModification = () => {
    const handleFetchError = (error) => {
      console.log(error);
      setAlertSeverity("error");
      setAlertMessage(DialogData[crudType].errorMessage);
    };

    switch (crudType) {
      case CrudTypes.add:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralEndpoints.alerts,
            school_id: currentSchoolID
          }),
          restMethod: RESTmethods.POST,
          body: editingAlert
        }).then((data) => {
          setAlerts(prevAlerts => [...prevAlerts, data]);
          handleClose();
        }).catch((error) => handleFetchError(error));

        break;
      case CrudTypes.edit:
        const alert_id = selectedAlert[AirQualityAlertKeys.id];
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralEndpoints.alerts,
            school_id: currentSchoolID,
            alert_id: alert_id
          }),
          restMethod: RESTmethods.PUT,
          body: editingAlert
        }).then((data) => {
          setAlertSeverity("success");
          setAlertMessage("Changes saved successfully.");
          // setShouldDisableButton(true);
          setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
              alert.id === alert_id ? data : alert
            )
          );
        }).catch((error) => handleFetchError(error));

        break;
      case CrudTypes.delete:
        fetchDataFromURL({
          url: getAlertsApiUrl({
            endpoint: GeneralEndpoints.alerts,
            school_id: currentSchoolID,
            alert_id: selectedAlert.id
          }),
          restMethod: RESTmethods.DELETE
        }).then(() => {
          setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== selectedAlert.id));
          handleClose();
        }).catch((error) => handleFetchError(error));

        break;
      default:
        break;
    }
  }

  // useEffect(() => {
  //   switch (alertTypeKey) {
  //     case AlertTypes.daily.id:
  //       setShouldDisableButton(!currentSensorId || !currentDataTypeKey || !currentMinutesPastMidnight);
  //       break;
  //     case AlertTypes.threshold.id:
  //       setShouldDisableButton(!currentSensorId || !currentDataTypeKey || !currentAlertThreshold);
  //       break;
  //     default:
  //       setShouldDisableButton(false);
  //       break;
  //   }
  // }, [crudType, currentSensorId, currentAlertThreshold, currentDataTypeKey, currentDataTypeKey, currentMinutesPastMidnight]);

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

      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {alertMessage ?
          (
            <Alert
              severity={alertSeverity}
              sx={{ mb: 3, width: "100%" }}
            >
              {alertMessage}
            </Alert>
          ) : null}

        {returnDialogContent()}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.palette.text.secondary
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAlertModification}
          color="primary"
          disabled={crudType === CrudTypes.delete ? false : shouldDisableButton} // Delete dialog button can never be disabled
        >
          {DialogData[crudType]?.primaryButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModificationDialog;


