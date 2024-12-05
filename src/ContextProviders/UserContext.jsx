import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const emptyData = {
    allowedSchools: [],
    username: null,
    email: null,
    isVerified: false
  };

  const [user, setUser] = useState({
    checkedAuthentication: false,
    authenticated: false,
    ...emptyData
  });

  useEffect(() => {
    const url = getApiUrl({ endpoint: GeneralAPIendpoints.me });
    fetchDataFromURL({ url })
      .then((data) => {
        if (data.username) {
          setUser({
            checkedAuthentication: true,
            authenticated: true,
            email: data.email,
            username: data.username,
            is_verified: data.is_verified,
            allowedSchools: data.allowedSchools
          })
        }
        else {
          setUser({
            checkedAuthentication: true,
            authenticated: false,
            ...emptyData
          })
        }
      })
      .catch((error) => {
        setUser({
          checkedAuthentication: true,
          authenticated: false,
          ...emptyData
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
