import { createContext, useMemo, useState, useContext } from 'react';
import AggregationType from '../Components/DateRangePicker/AggregationType';

const DateRangePickerContext = createContext();

const initDateRange = { startDate: null, endDate: null, key: 'selection' };

export function DateRangePickerProvider({ children }) {
    const [dateRange, setDateRange] = useState(initDateRange);
    const [aggregationType, setAggregationType] = useState(AggregationType.hourly);

    const contextValue = useMemo(() => ({
        dateRange, setDateRange,
        aggregationType, setAggregationType
    }), [dateRange, aggregationType]);

    return (
        <DateRangePickerContext.Provider value={contextValue}>
            {children}
        </DateRangePickerContext.Provider>
    );
}

// Custom hook 
export const useDateRangePicker = () => useContext(DateRangePickerContext);