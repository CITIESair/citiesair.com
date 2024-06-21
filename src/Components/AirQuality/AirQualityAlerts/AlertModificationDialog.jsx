import { Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, ToggleButtonGroup, ToggleButton, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { useTheme } from '@emotion/react';
import AlertTypes from './AlertTypes';
import { ThresholdAlertTypes } from './AlertTypes';
import { returnHoursFromMinutesPastMidnight, CrudTypes, SharedColumnHeader } from './Utils';

import { useAirQualityAlert } from '../../../ContextProviders/AirQualityAlertContext';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';

import { capitalizePhrase } from '../../../Utils/Utils';
import AQIDataTypes from '../../../Utils/AirQuality/DataTypes';
import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '../../../ContextProviders/DashboardContext';

const DialogData = {
  [CrudTypes.add]: {
    title: "Add A New Alert",
    primaryButtonLabel: "Save Alert"
  },
  [CrudTypes.edit]: {
    title: "Edit Alert",
    primaryButtonLabel: "Save Edit"
  },
  [CrudTypes.delete]: {
    title: "Delete Alert",
    contentText: "Are you sure you want to delete this alert?",
    primaryButtonLabel: "Delete"
  }
};

const AlertModificationDialog = (props) => {
  const {
    alertTypeKey,
    openAlertModificationDialog,
    crudType,
    handleCloseWithoutModification,
    handleAlertModification
  } = props;

  const { selectedAlert, setSelectedAlert, setAlerts } = useAirQualityAlert();

  const { schoolMetadata } = useContext(DashboardContext);

  const { id, alert_type, sensor_id, datatypekey, alert_threshold, minutespastmidnight } = selectedAlert || {};

  const [currentSensorId, setCurrentSensorId] = useState(sensor_id);
  const [currentDataTypeKey, setCurrentDataTypeKey] = useState(datatypekey);
  const [currentAlertType, setCurrentAlertType] = useState(alert_type);
  const [currentAlertThreshold, setCurrentAlertThreshold] = useState(alert_threshold);
  const [currentMinutesPastMidnight, setCurrentMinutesPastMidnight] = useState(minutespastmidnight);

  useEffect(() => {
    setCurrentSensorId(sensor_id);
    setCurrentDataTypeKey(datatypekey);
    setCurrentAlertType(alert_type);
    setCurrentAlertThreshold(alert_threshold)
    setCurrentMinutesPastMidnight(minutespastmidnight);

    setAllowedDataTypes(returnAllowedDataTypesForThisSensor(selectedAlert?.sensor_id))
  }, [selectedAlert]);

  const returnAllowedDataTypesForThisSensor = (sensor) => {
    if (!schoolMetadata) return;

    const newSensorData = schoolMetadata?.sensors?.find(elem => elem.sensor_id === sensor) || [];
    const allowedDataTypesForThisSensor = newSensorData.allowedDataTypes;

    if (allowedDataTypesForThisSensor) return allowedDataTypesForThisSensor.map(dataType => ({ value: dataType, label: AQIDataTypes[dataType].name_title }));
    else return [];
  }

  const [allowedDataTypes, setAllowedDataTypes] = useState([]);

  const handleCurrentSensorChange = (event) => {
    const newSensor = event.target.value;
    setCurrentSensorId(newSensor);

    setCurrentDataTypeKey(null);
    setAllowedDataTypes(returnAllowedDataTypesForThisSensor(newSensor))
  }

  const handleCurrentDataTypeChange = (event) => {
    setCurrentDataTypeKey(event.target.value);
  }

  const handleCurrentThresholdValueChange = (event) => {
    setCurrentAlertThreshold(event.target.value);
  }

  const handleCurrentAlertTypeChange = (event) => {
    setCurrentAlertType(event.target.value);
  }

  const handleCurrentMinutesPastMidnightChange = (event) => {
    setCurrentMinutesPastMidnight(event.target.value);
  }

  const theme = useTheme();

  const locations = schoolMetadata?.sensors?.map(sensor => (
    {
      value: sensor.sensor_id,
      label: capitalizePhrase(sensor.location_short)
    }
  ));
  const returnAlertTypeSpecificData = () => {
    switch (alertTypeKey) {
      case AlertTypes.daily.id:
        const minutes = minutespastmidnight;
        if (minutes) {
          return (
            <DialogContentText>
              <b>{AlertTypes.daily.tableColumnHeader}: </b>{returnHoursFromMinutesPastMidnight(minutes)}
            </DialogContentText>
          );
        }
        else return null;

      case AlertTypes.threshold.id:
        return (
          <DialogContentText>
            <b>{AlertTypes.threshold.tableColumnHeader}: </b>{ThresholdAlertTypes[alert_type]}{alert_threshold}
          </DialogContentText>
        );
    }
  };
  const returnDialogContent = () => {
    const disabled = crudType === CrudTypes.delete;

    let alertTypeSpecificData = null;

    switch (alertTypeKey) {
      case AlertTypes.daily.id:
        alertTypeSpecificData = (
          <SimplePicker
            icon={<AccessTimeIcon />}
            label={AlertTypes.daily.tableColumnHeader}
            value={currentMinutesPastMidnight}
            values={HOURS}
            disabled={disabled}
            handleChange={handleCurrentMinutesPastMidnightChange}
          />
        );
        break;
      case AlertTypes.threshold.id:
        alertTypeSpecificData = (
          <>
            <ThresholdTypeToggle
              thisAlertType={currentAlertType}
              handleChange={handleCurrentAlertTypeChange}
              disabled={disabled}
            />
          </>
        )
        break;
      default:
        break;

    }
    return (
      <Stack direction="column" spacing={3} mt={1}>
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
          value={currentSensorId}
          values={locations}
          disabled={disabled}
          handleChange={handleCurrentSensorChange}
        />

        <SimplePicker
          icon={<CategoryIcon />}
          label={SharedColumnHeader.dataType}
          value={currentDataTypeKey}
          values={allowedDataTypes}
          disabled={disabled}
          handleChange={handleCurrentDataTypeChange}
        />

        {alertTypeSpecificData}

      </Stack>
    );
    return (
      DialogData[crudType].contentText ?
        (
          <>
            <DialogContentText>
              {DialogData[crudType].contentText}
            </DialogContentText>
            <br />
            <DialogContentText textTransform="capitalize">
              <b>{SharedColumnHeader.location}: </b>{sensor_id}
            </DialogContentText>
            <DialogContentText>
              <b>{SharedColumnHeader.dataType}: </b>{datatypekey}
            </DialogContentText>
            {returnAlertTypeSpecificData()}
          </>
        ) : null
    );
  }

  return (
    <Dialog
      open={openAlertModificationDialog}
      onClose={handleCloseWithoutModification}
      aria-labelledby="alert-modification-dialog"
      maxWidth="md"
    >
      <DialogTitle id="alert-modification-dialog">
        {DialogData[crudType]?.title}
      </DialogTitle>

      <DialogContent>
        {returnDialogContent()}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseWithoutModification}
          sx={{
            color: theme.palette.text.secondary
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAlertModification(crudType);
          }}
          color="primary"
        >
          {DialogData[crudType]?.primaryButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ThresholdTypeToggle = ({ thisAlertType, handleChange, disabled }) => {
  console.log(thisAlertType)
  return (
    <ToggleButtonGroup
      color={disabled ? "standard" : "primary"}
      value={thisAlertType}
      exclusive
      aria-label="toggle to choose alert below or above a threshold"
      size="small"
      onChange={handleChange}
      disabled
    >
      {Object.keys(ThresholdAlertTypes).map((key) => {
        const thresholdAlertType = ThresholdAlertTypes[key];

        return (
          <ToggleButton
            key={thresholdAlertType.id}
            size="small"
            sx={{ textTransform: "capitalize !important", px: 1.25, py: 0.5 }}
            value={thresholdAlertType.id}
            aria-label={thresholdAlertType.id}
          >
            {thresholdAlertType.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  )
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const minutesPastMidnight = i * 60;
  return {
    label: returnHoursFromMinutesPastMidnight(minutesPastMidnight),
    value: minutesPastMidnight
  };
});

const SimplePicker = (props) => {
  const { icon, label, value, values, handleChange, disabled } = props;
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        aria-hidden={true}
        sx={{
          '& .MuiSvgIcon-root': {
            color: theme.palette.text.secondary
          }
        }}
      >
        {icon}
      </Box>
      <FormControl fullWidth size='small' disabled={disabled}>
        <InputLabel id={`${label}-picker-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-picker-label`}
          id={`${label}-picker`}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {values.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>

  );
};

export default AlertModificationDialog;


