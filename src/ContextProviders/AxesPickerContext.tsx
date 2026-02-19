import { createContext, useMemo, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

export interface AxesPickerContextValue {
  hAxis: string | null;
  setHAxis: Dispatch<SetStateAction<string | null>>;
  vAxis: string | null;
  setVAxis: Dispatch<SetStateAction<string | null>>;
}

const AxesPickerContext = createContext<AxesPickerContextValue | undefined>(undefined);

export function AxesPickerProvider({ children }: { children: ReactNode }) {
  const [hAxis, setHAxis] = useState<string | null>(null);
  const [vAxis, setVAxis] = useState<string | null>(null);

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
export const useAxesPicker = (): AxesPickerContextValue => {
  const context = useContext(AxesPickerContext);
  if (!context) throw new Error('useAxesPicker must be used within AxesPickerProvider');
  return context;
};
