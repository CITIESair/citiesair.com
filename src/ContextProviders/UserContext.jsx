import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../Components/DatasetDownload/DatasetFetcher';
import { GeneralEndpoints, getApiUrl } from '../Utils/ApiUtils';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    checkedAuthentication: false,
    authenticated: false,
    allowedSchools: [],
    username: null
  });

  useEffect(() => {
    const url = getApiUrl({ endpoint: GeneralEndpoints.me });
    fetchDataFromURL({ url, extension: 'json', needsAuthorization: true })
      .then((data) => {
        if (data.username) {
          setUser({
            checkedAuthentication: true,
            authenticated: true,
            allowedSchools: data.allowedSchools,
            username: data.username
          })
        }
        else {
          setUser({
            checkedAuthentication: true,
            authenticated: false,
            allowedSchools: [],
            username: null
          })
        }
      })
      .catch((error) => {
        setUser({
          checkedAuthentication: true,
          authenticated: false,
          allowedSchools: [],
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
