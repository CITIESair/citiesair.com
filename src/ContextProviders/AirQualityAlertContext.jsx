import { createContext, useMemo, useState, useContext, useEffect, useCallback } from 'react';
import { DashboardContext } from './DashboardContext';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getAlertsApiUrl, getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";
import AlertTypes, { ThresholdAlertTypes } from '../Components/AirQuality/AirQualityAlerts/AlertTypes';
import { isValidArray } from '../Utils/UtilFunctions';
import { DataTypes } from '../Utils/AirQuality/DataTypes';
import { enqueueSnackbar } from 'notistack';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { PREDEFINED_TIMERANGES } from '../Components/AirQuality/AirQualityAlerts/AlertModificationDialog/AlertPropertyComponents/PREDEFINED_TIMERANGES';

const AirQualityAlertContext = createContext();

export const AirQualityAlertKeys = {
  id: "id",
  alert_type: "alert_type",
  sensor_id: "sensor_id",
  location_short: "location_short",
  datatypekey: "datatypekey",
  threshold_value: "threshold_value",
  days_of_week: "days_of_week",
  minutespastmidnight: "minutespastmidnight",
  time_range: "time_range",
  is_enabled: "is_enabled",
  excluded_dates: "excluded_dates",
  owner_role: "owner_role",
  self_is_owner: "self_is_owner",
  is_allowed_to_modify: "is_allowed_to_modify",
  message: "message",
  max_once_a_day: "max_once_a_day",
  parent_alert_id: "parent_alert_id",
  child_alert: "child_alert",
  has_child_alert: "has_child_alert"
};

export const getAlertDefaultPlaceholder = (alert_type = AlertTypes.daily.id) => {
  let localAlertType, localOppositeAlertType;
  if (alert_type === AlertTypes.threshold.id) {
    localAlertType = ThresholdAlertTypes.above_threshold.id;
    localOppositeAlertType = ThresholdAlertTypes.below_threshold.id;
  }

  return {
    [AirQualityAlertKeys.id]: '',
    [AirQualityAlertKeys.alert_type]: localAlertType || alert_type,
    [AirQualityAlertKeys.sensor_id]: '',
    [AirQualityAlertKeys.datatypekey]: '',
    [AirQualityAlertKeys.days_of_week]: [0, 1, 2, 3, 4],
    [AirQualityAlertKeys.time_range]: alert_type === AlertTypes.threshold.id ? [PREDEFINED_TIMERANGES.schoolHour.from, PREDEFINED_TIMERANGES.schoolHour.to] : null,
    [AirQualityAlertKeys.threshold_value]: -1,
    [AirQualityAlertKeys.minutespastmidnight]: '',
    [AirQualityAlertKeys.is_enabled]: true,
    [AirQualityAlertKeys.excluded_dates]: [],
    [AirQualityAlertKeys.message]: '',
    [AirQualityAlertKeys.max_once_a_day]: true,
    [AirQualityAlertKeys.parent_alert_id]: null,
    [AirQualityAlertKeys.has_child_alert]: false,
    [AirQualityAlertKeys.child_alert]: alert_type === AlertTypes.threshold.id ? {
      [AirQualityAlertKeys.alert_type]: localOppositeAlertType || alert_type,
      [AirQualityAlertKeys.threshold_value]: -1,
      [AirQualityAlertKeys.message]: '',
    } : null,
  }
}

export function AirQualityAlertProvider({ children }) {
  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const [selectedAlert, setSelectedAlert] = useState(getAlertDefaultPlaceholder());

  const [editingAlert, setEditingAlert] = useState(selectedAlert);

  const [allowedDataTypesForSensor, setAllowedDataTypesForSensor] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [hasFetchedAlerts, setHasFetchedAlerts] = useState();

  const [alertEmails, setAlertEmails] = useState([]);

  const returnAllowedDataTypesForThisSensor = useCallback((sensor) => {
    if (!schoolMetadata) return [];

    const { sensors } = schoolMetadata;
    if (!isValidArray(sensors)) return [];

    const sensorData = sensors.find(elem => elem.sensor_id === sensor);
    const allowedDataTypesForThisSensor = sensorData?.allowedDataTypes;

    if (allowedDataTypesForThisSensor) {
      return allowedDataTypesForThisSensor.map(dataType => ({
        value: dataType,
        label: DataTypes[dataType].name_title
      }));
    }

    return [];
  }, [schoolMetadata]);

  useEffect(() => {
    setEditingAlert({ ...selectedAlert });
  }, [selectedAlert]);

  useEffect(() => {
    const sensor_id = editingAlert[AirQualityAlertKeys.sensor_id];
    if (sensor_id && sensor_id !== '') {
      setAllowedDataTypesForSensor(
        returnAllowedDataTypesForThisSensor(sensor_id)
      )
    }
  }, [editingAlert, returnAllowedDataTypesForThisSensor]);

  // Add child alert to parent
  const addChildToAlerts = useCallback((alertList = []) => {
    const processed = [...alertList];

    processed.forEach(alert => {
      if (!alert) return;

      const isChild = !!alert[AirQualityAlertKeys.parent_alert_id];

      if (isChild) {
        const parent = processed.find(
          a => a[AirQualityAlertKeys.id] === alert[AirQualityAlertKeys.parent_alert_id]
        );

        if (parent) {
          parent[AirQualityAlertKeys.has_child_alert] = true;
          parent[AirQualityAlertKeys.child_alert] = {
            [AirQualityAlertKeys.id]: alert[AirQualityAlertKeys.id],
            [AirQualityAlertKeys.alert_type]: alert[AirQualityAlertKeys.alert_type],
            [AirQualityAlertKeys.threshold_value]: alert[AirQualityAlertKeys.threshold_value],
            [AirQualityAlertKeys.message]: alert[AirQualityAlertKeys.message],
          };
        }
      } else {
        if (alert[AirQualityAlertKeys.alert_type] === AlertTypes.daily.id) return;

        alert[AirQualityAlertKeys.has_child_alert] = false;
        alert[AirQualityAlertKeys.child_alert] = {
          [AirQualityAlertKeys.alert_type]:
            alert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.above_threshold.id
              ? ThresholdAlertTypes.below_threshold.id
              : ThresholdAlertTypes.above_threshold.id,
          [AirQualityAlertKeys.threshold_value]: alert[AirQualityAlertKeys.threshold_value],
          [AirQualityAlertKeys.message]: ""
        };
      }
    });

    return processed;
  }, []);

  // Fetch alerts for individual school
  const fetchAlerts = useCallback(() => {
    if (!currentSchoolID) return;

    fetchDataFromURL({
      url: getAlertsApiUrl({
        endpoint: GeneralAPIendpoints.alerts,
        school_id: currentSchoolID
      })
    }).then((data) => {
      if (!isValidArray(data)) return;

      setAlerts(
        addChildToAlerts(data)
      );

    }).catch((error) => {
      console.log(error);
    });

    fetchDataFromURL({
      url: getApiUrl({
        endpoint: GeneralAPIendpoints.alertsEmails,
        school_id: currentSchoolID
      }),
      extension: 'json',
      needsAuthorization: true
    }).then((data) => {
      setAlertEmails(data);
    })
      .catch((error) => {
        enqueueSnackbar("There was an error loading the alert email list, please try again", SnackbarMetadata.error);
      });
  }, [currentSchoolID]);

  useEffect(() => {
    if (!currentSchoolID) return;

    setHasFetchedAlerts(false);
  }, [currentSchoolID, fetchAlerts]);

  const contextValue = useMemo(() => ({
    selectedAlert, setSelectedAlert,
    editingAlert, setEditingAlert,
    allowedDataTypesForSensor, setAllowedDataTypesForSensor,
    alerts, setAlerts,
    fetchAlerts,
    hasFetchedAlerts, setHasFetchedAlerts,
    alertEmails, setAlertEmails,
    addChildToAlerts
  }), [selectedAlert, editingAlert, allowedDataTypesForSensor, alerts, fetchAlerts, hasFetchedAlerts, setHasFetchedAlerts, alertEmails, setAlertEmails, addChildToAlerts]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}

// Custom hook 
export const useAirQualityAlert = () => useContext(AirQualityAlertContext);