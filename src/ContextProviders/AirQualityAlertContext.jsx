import { createContext, useMemo, useState, useContext } from 'react';

const AirQualityAlertContext = createContext();

export function AirQualityAlertProvider({ children }) {
  const [selectedAlert, setSelectedAlert] = useState();
  const [alerts, setAlerts] = useState([
    {
      "id": 1,
      "location_short": "outdoors",
      "sensor_id": 8,
      "alert_type": "daily",
      "alert_threshold": null,
      "minutespastmidnight": 720,
      "datatypekey": "pm10_raw"
    },
    {
      "id": 2,
      "location_short": "outdoors",
      "sensor_id": 8,
      "alert_type": "above_threshold",
      "alert_threshold": "150.0",
      "minutespastmidnight": null,
      "datatypekey": "pm10_raw"
    }
  ]);

  const [emails, setEmails] = useState([]);

  const contextValue = useMemo(() => ({
    selectedAlert, setSelectedAlert,
    alerts, setAlerts,
    emails, setEmails
  }), [selectedAlert, alerts, emails]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}

// Custom hook 
export const useAirQualityAlert = () => useContext(AirQualityAlertContext);