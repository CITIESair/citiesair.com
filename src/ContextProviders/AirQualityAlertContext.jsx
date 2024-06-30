import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { DashboardContext } from './DashboardContext';
import { fetchDataFromURL } from '../Utils/ApiFunctions/ApiCalls';
import { GeneralEndpoints, getAlertsApiUrl } from '../Utils/ApiFunctions/ApiUtils';

const AirQualityAlertContext = createContext();

export function AirQualityAlertProvider({ children }) {
  const [selectedAlert, setSelectedAlert] = useState();
  const [alerts, setAlerts] = useState([]);

  const { currentSchoolID } = useContext(DashboardContext);

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
    alerts, setAlerts
  }), [selectedAlert, alerts]);

  return (
    <AirQualityAlertContext.Provider value={contextValue}>
      {children}
    </AirQualityAlertContext.Provider>
  );
}

// Custom hook 
export const useAirQualityAlert = () => useContext(AirQualityAlertContext);