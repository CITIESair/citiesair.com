import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    checkedAuthentication: false,
    authenticated: false,
    username: null
  });

  useEffect(() => {
    const url = 'https://api.citiesair.com/me';
    fetchDataFromURL(url, 'json', true)
      .then((data) => {
        if (data.username) {
          setUser({
            checkedAuthentication: true,
            authenticated: true,
            username: data.username
          })
        }
        else {
          setUser({
            checkedAuthentication: true,
            authenticated: false,
            username: null
          })
        }
      })
      .catch((error) => {
        setUser({
          checkedAuthentication: true,
          authenticated: false,
          username: null
        });
        console.log(error);
      });
  }, []);

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => ({
    user, setUser
  }), [user]);

  // return context provider
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
