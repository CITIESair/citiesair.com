import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [checkAuthentication, setCheckAuthentication] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setContextUserName] = useState();

  useEffect(() => {
    if (!checkAuthentication) {
      const url = 'https://api.citiesair.com/me';
      try {
        fetchDataFromURL(url, 'json')
          .then((data) => {
            if (data.userName) {
              setContextUserName(data.userName);
              setAuthenticated(true);
            }
          });
        setCheckAuthentication(true);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => [authenticated, userName, setAuthenticated, setContextUserName], [authenticated, userName]);

  // return context provider
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
