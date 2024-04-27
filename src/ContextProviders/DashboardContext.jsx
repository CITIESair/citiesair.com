/* eslint-disable */

import { useState, createContext, useMemo, useEffect } from 'react';

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [schoolMetadata, setSchoolMetadata] = useState();
  const [current, setCurrent] = useState();
  const [allChartsData, setAllChartsData] = useState({});
  const [currentSchoolID, setCurrentSchoolID] = useState();
  const [loadMoreCharts, setLoadMoreCharts] = useState(false);

  const setIndividualChartData = (chartID, chartData) => {
    setAllChartsData(prevData => ({
      ...prevData,
      [chartID]: chartData
    }));
  };

  const providerValue = useMemo(() => ({
    currentSchoolID, setCurrentSchoolID,
    schoolMetadata, setSchoolMetadata,
    current, setCurrent,
    allChartsData, setIndividualChartData,
    loadMoreCharts, setLoadMoreCharts
  }), [currentSchoolID, schoolMetadata, current, allChartsData, loadMoreCharts]);

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
}
