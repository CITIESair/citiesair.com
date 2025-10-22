import { createContext, useMemo, useState, useEffect, useCallback } from 'react';
import { isValidArray } from '../Utils/UtilFunctions';
import { DataTypes } from '../Utils/AirQuality/DataTypes';
import useSchoolMetadata from '../hooks/useSchoolMetadata';
import { AirQualityAlertKeys, getAlertDefaultPlaceholder } from '../Components/AirQuality/AirQualityAlerts/AlertUtils';

export const AirQualityAlertContext = createContext();

export function AirQualityAlertProvider({ children }) {
  const { data: schoolMetadata } = useSchoolMetadata();

  const [selectedAlert, setSelectedAlert] = useState(getAlertDefaultPlaceholder());
  const [editingAlert, setEditingAlert] = useState(selectedAlert);
  const [allowedDataTypesForSensor, setAllowedDataTypesForSensor] = useState([]);

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

  const contextValue = useMemo(() => ({
    selectedAlert, setSelectedAlert,
    editingAlert, setEditingAlert,
    allowedDataTypesForSensor, setAllowedDataTypesForSensor
  }), [selectedAlert, editingAlert, allowedDataTypesForSensor]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}