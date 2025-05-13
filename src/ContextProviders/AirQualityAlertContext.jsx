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
  is_enabled: "is_enabled",
  excluded_dates: "excluded_dates"
};

export const getAlertPlaceholder = (alert_type = AlertTypes.daily.id) => {
  let localAlertType;
  if (alert_type === AlertTypes.threshold.id) localAlertType = ThresholdAlertTypes.above_threshold.id;

  return {
    [AirQualityAlertKeys.id]: '',
    [AirQualityAlertKeys.alert_type]: localAlertType || alert_type,
    [AirQualityAlertKeys.sensor_id]: '',
    [AirQualityAlertKeys.datatypekey]: '',
    [AirQualityAlertKeys.days_of_week]: [0, 1, 2, 3, 4],
    [AirQualityAlertKeys.threshold_value]: -1,
    [AirQualityAlertKeys.minutespastmidnight]: '',
    [AirQualityAlertKeys.is_enabled]: true,
    [AirQualityAlertKeys.excluded_dates]: []
  }
}

export function AirQualityAlertProvider({ children }) {
  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const [selectedAlert, setSelectedAlert] = useState(getAlertPlaceholder());

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

  // Fetch alerts for individual school
  const fetchAlerts = useCallback(() => {
    if (!currentSchoolID) return;

    fetchDataFromURL({
      url: getAlertsApiUrl({
        endpoint: GeneralAPIendpoints.alerts,
        school_id: currentSchoolID
      })
    }).then((data) => {
      setAlerts(data);
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
    alertEmails, setAlertEmails
  }), [selectedAlert, editingAlert, allowedDataTypesForSensor, alerts, fetchAlerts, hasFetchedAlerts, setHasFetchedAlerts, alertEmails, setAlertEmails]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}

// Custom hook 
export const useAirQualityAlert = () => useContext(AirQualityAlertContext);