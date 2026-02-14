import { useState, useEffect, createContext, useMemo } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { EMPTY_USER_DATA } from "../types/UserData";
import { useSnackbar } from 'notistack';
import { UserRoles } from '../Components/Account/Utils';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [authenticationState, setAuthenticationState] = useState({
    checkedAuthentication: false,
    authenticated: false,
  });
  const [user, setUser] = useState(EMPTY_USER_DATA);
  const [userRole, setUserRole] = useState(UserRoles.school.id);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (authenticationState.checkedAuthentication === true) return;

    const url = getApiUrl({ endpoint: "me" });
    fetchDataFromURL({ url })
      .then((data) => {
        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: data.authenticated
        });
        setUser(data);
      })
      .catch((error) => {
        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: false
        });
        setUser(EMPTY_USER_DATA);
        enqueueSnackbar(error.message, SnackbarMetadata.error);
      });
  }, [authenticationState.checkedAuthentication, enqueueSnackbar]);

  const providerValue = useMemo(() => ({
    authenticationState, setAuthenticationState,
    user, setUser,
    userRole, setUserRole
  }), [user, authenticationState, userRole]);

  useEffect(() => {
    // If the user is authenticated but unverified, show it via SnackbarNotification
    if (!(authenticationState.authenticated && authenticationState.checkedAuthentication)) return;
    if (user.recently_registered) return; // don't show the snackbar either when the user has just signed up

    if (user.is_verified === false) {
      enqueueSnackbar("Your account is unverified. Please click on the verification link in the email we sent after signing up.", {
        ...SnackbarMetadata.error, persist: true
      });
    }
  }, [user, authenticationState, enqueueSnackbar]);

  // return context provider
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}
