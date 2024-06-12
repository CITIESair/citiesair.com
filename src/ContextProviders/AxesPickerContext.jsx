import { createContext, useMemo, useState, useContext } from 'react';

const AxesPickerContext = createContext();

export function AxesPickerProvider({ children }) {
    const [hAxis, setHAxis] = useState();
    const [vAxis, setVAxis] = useState();

    const contextValue = useMemo(() => ({
        hAxis, setHAxis,
        vAxis, setVAxis
    }), [hAxis, vAxis]);

    return (
        <AxesPickerContext.Provider value={contextValue}>
            {children}
        </AxesPickerContext.Provider>
    );
}

// Custom hook 
export const useAxesPicker = () => useContext(AxesPickerContext);