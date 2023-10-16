import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [checkAuthentication, setCheckAuthentication] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setContextUsername] = useState();

  useEffect(() => {
    if (!checkAuthentication) {
      const url = 'https://api.citiesair.com/me';
      try {
        fetchDataFromURL(url, 'json', true)
          .then((data) => {
            if (data.username) {
              setContextUsername(data.username);
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
  const providerValue = useMemo(() => ({
    authenticated,
    checkAuthentication,
    username,
    setAuthenticated,
    setContextUsername
  }), [checkAuthentication, authenticated, username]);

  // return context provider
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
