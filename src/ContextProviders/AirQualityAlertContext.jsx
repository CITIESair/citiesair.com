import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { DashboardContext } from './DashboardContext';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getAlertsApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";
import AlertTypes, { ThresholdAlertTypes } from '../Components/AirQuality/AirQualityAlerts/AlertTypes';
import { isValidArray } from '../Utils/UtilFunctions';
import AQIDataTypes from '../Utils/AirQuality/DataTypes';

const AirQualityAlertContext = createContext();

export const AirQualityAlertKeys = {
  id: "id",
  alert_type: "alert_type",
  sensor_id: "sensor_id",
  location_short: "location_short",
  datatypekey: "datatypekey",
  threshold_value: "threshold_value",
  minutespastmidnight: "minutespastmidnight"
};

export const getAlertPlaceholder = (alert_type = AlertTypes.daily.id) => {
  let localAlertType;
  if (alert_type === AlertTypes.threshold.id) localAlertType = ThresholdAlertTypes.above_threshold.id;

  return {
    [AirQualityAlertKeys.id]: '',
    [AirQualityAlertKeys.alert_type]: localAlertType || alert_type,
    [AirQualityAlertKeys.sensor_id]: '',
    [AirQualityAlertKeys.datatypekey]: '',
    [AirQualityAlertKeys.threshold_value]: -1,
    [AirQualityAlertKeys.minutespastmidnight]: ''
  }
}

export function AirQualityAlertProvider({ children }) {
  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const [selectedAlert, setSelectedAlert] = useState(getAlertPlaceholder());

  const [editingAlert, setEditingAlert] = useState(selectedAlert);

  const [allowedDataTypesForSensor, setAllowedDataTypesForSensor] = useState([]);

  const [alerts, setAlerts] = useState([]);

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
  }, [editingAlert]);

  const returnAllowedDataTypesForThisSensor = (sensor) => {
    if (!schoolMetadata) return;

    const { sensors } = schoolMetadata;
    if (!isValidArray(sensors)) return;

    const sensorData = sensors.find(elem => elem.sensor_id === sensor) || [];
    const allowedDataTypesForThisSensor = sensorData.allowedDataTypes;

    if (allowedDataTypesForThisSensor) {
      return allowedDataTypesForThisSensor
        .map(dataType => ({ value: dataType, label: AQIDataTypes[dataType].name_title }));
    }
    else return [];
  }

  // Fetch alerts for individual school
  useEffect(() => {
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

  }, [currentSchoolID]);

  const contextValue = useMemo(() => ({
    selectedAlert, setSelectedAlert,
    editingAlert, setEditingAlert,
    allowedDataTypesForSensor, setAllowedDataTypesForSensor,
    alerts, setAlerts
  }), [selectedAlert, editingAlert, allowedDataTypesForSensor, alerts]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}

// Custom hook 
export const useAirQualityAlert = () => useContext(AirQualityAlertContext);