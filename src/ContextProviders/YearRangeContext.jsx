import { createContext, useMemo, useState, useContext } from 'react';

/*
  This context is used in the implementation of the year range slider.
  It ensures that all subcharts in a chart share the same year range.
  The year range is modified by the slider in `SubChart.jsx`.
*/

const YearRangeContext = createContext();

export function YearRangeProvider({ children }) {
    const [yearRange, setYearRange] = useState([]);

    const contextValue = useMemo(() => ({ yearRange, setYearRange }), [yearRange]);

    return (
        <YearRangeContext.Provider value={contextValue}>
            {children}
        </YearRangeContext.Provider>
    );
}

// Custom hook to use the YearRangeContext
export const useYearRange = () => useContext(YearRangeContext);