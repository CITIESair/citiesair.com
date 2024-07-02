import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { DashboardContext } from './DashboardContext';
import { fetchDataFromURL } from '../Utils/ApiFunctions/ApiCalls';
import { GeneralEndpoints, getAlertsApiUrl } from '../Utils/ApiFunctions/ApiUtils';
import { ThresholdAlertTypes } from '../Components/AirQuality/AirQualityAlerts/AlertTypes';
import { isValidArray } from '../Utils/Utils';
import AQIDataTypes from '../Utils/AirQuality/DataTypes';

const AirQualityAlertContext = createContext();

export const AirQualityAlertKeys = {
  id: "id",
  alert_type: "alert_type",
  sensor_id: "sensor_id",
  datatypekey: "datatypekey",
  threshold_value: "threshold_value",
  minutespastmidnight: "minutespastmidnight"
};

export const emptySelectedAlert = {
  [AirQualityAlertKeys.id]: '',
  [AirQualityAlertKeys.alert_type]: ThresholdAlertTypes.above_threshold.id,
  [AirQualityAlertKeys.sensor_id]: '',
  [AirQualityAlertKeys.datatypekey]: '',
  [AirQualityAlertKeys.threshold_value]: 0,
  [AirQualityAlertKeys.minutespastmidnight]: ''
}

export function AirQualityAlertProvider({ children }) {
  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const [selectedAlert, setSelectedAlert] = useState(emptySelectedAlert);

  const [editingAlert, setEditingAlert] = useState(selectedAlert);

  const [allowedDataTypesForSensor, setAllowedDataTypesForSensor] = useState([]);

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setEditingAlert(selectedAlert);
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
        endpoint: GeneralEndpoints.alerts,
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