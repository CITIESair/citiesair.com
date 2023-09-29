import { useState, createContext, useMemo } from 'react';

// create context
export const TabContext = createContext();

// context provider
export function TabProvider(props) {
  const { children } = props;
  // state to store tab data
  const [tab, setTab] = useState({});

  const providerValue = useMemo(() => [tab, setTab], [tab]);
  // return context provider
  return (
    <TabContext.Provider value={providerValue}>
      {children}
    </TabContext.Provider>
  );
}
