/* eslint-disable */

import { useState, useEffect, createContext, useMemo } from 'react';

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [schoolMetadata, setSchoolMetadata] = useState();
  const [current, setCurrent] = useState();
  const [chartData, setChartData] = useState();
  const [currentSchoolID, setCurrentSchoolID] = useState();

  const providerValue = useMemo(() => ({
    currentSchoolID, setCurrentSchoolID,
    schoolMetadata, setSchoolMetadata,
    current, setCurrent,
    chartData, setChartData
  }), [currentSchoolID, schoolMetadata, current, chartData]);

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
}
