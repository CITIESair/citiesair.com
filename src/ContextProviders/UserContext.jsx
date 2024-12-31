import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";
import { AlertSeverity, useNotificationContext } from './NotificationContext';
import { EMPTY_USER_DATA } from '../Utils/GlobalVariables';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [authenticationState, setAuthenticationState] = useState({
    checkedAuthentication: false,
    authenticated: false,
  })

  const [user, setUser] = useState(EMPTY_USER_DATA);

  const { setShowNotification, setMessage, setSeverity } = useNotificationContext();

  useEffect(() => {
    if (authenticationState.checkedAuthentication) return;

    const url = getApiUrl({ endpoint: GeneralAPIendpoints.me });
    fetchDataFromURL({ url })
      .then((data) => {
        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: true
        });
        setUser(data);
      })
      .catch((error) => {
        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: false
        });
        setUser(EMPTY_USER_DATA);
        console.log(error);
      });
  }, []);

  const providerValue = useMemo(() => ({
    authenticationState, setAuthenticationState,
    user, setUser
  }), [user, authenticationState]);

  useEffect(() => {
    // If the user is authenticated but unverified, show it via SnackbarNotification
    if (!(authenticationState.authenticated && authenticationState.checkedAuthentication)) return;
    if (user.recently_registered) return; // don't show the snackbar either when the user has just signed up

    if (user.is_verified === false) {
      setShowNotification(true);
      setMessage("Your account is unverified. Please click on the verification link in the email we sent after signing up.");
      setSeverity(AlertSeverity.error);
    }
  }, [user]);

  // return context provider
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
