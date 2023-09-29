// import libraries
import { useState, createContext, useMemo } from 'react';

// create context
export const LinkContext = createContext();

// context provider
export function LinkProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [chartsTitlesList, setChartsTitlesList] = useState([]);

  // Memoize the value to be provided to avoid unnecessary re-renders
  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => [currentPage, setCurrentPage, chartsTitlesList, setChartsTitlesList], [currentPage, chartsTitlesList]);

  return (
    <LinkContext.Provider value={providerValue}>
      {children}
    </LinkContext.Provider>
  );
}
