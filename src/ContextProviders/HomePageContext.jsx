import { useState, useEffect, createContext, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';

// import data
import JSONData from '../temp_database.json';
import locations from '../temp_locations.json';

// create context
export const HomeDataContext = createContext();

// context provider
export function HomePageProvider({ children }) {
  // state to store data
  const [data, setData] = useState({});

  useEffect(() => {
    const homeData = {};

  }, []);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => [data, setData], [data]);

  // return context provider
  return (
    <HomeDataContext.Provider value={providerValue}>
      {children}
    </HomeDataContext.Provider>
  );
}