import { useState, useEffect, createContext, useMemo, ReactNode, Dispatch, SetStateAction, useContext } from 'react';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { SnackbarMetadata } from '../Utils/SnackbarMetadata';
import { EMPTY_USER_DATA, UserData } from '../types/UserData';
import { useSnackbar } from 'notistack';
import { UserRoles, type UserRoleId } from '../Components/Account/Utils';
import { AuthenticationState, defaultAuthenticationState, failedAuthenticationState } from '../types/AuthenticationState';

type UserContextValue = {
  authenticationState: AuthenticationState;
  setAuthenticationState: Dispatch<SetStateAction<AuthenticationState>>;
  user: UserData;
  setUser: Dispatch<SetStateAction<UserData>>;
  userRole: UserRoleId;
  setUserRole: Dispatch<SetStateAction<UserRoleId>>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>(defaultAuthenticationState);
  const [user, setUser] = useState<UserData>(EMPTY_USER_DATA);
  const [userRole, setUserRole] = useState<UserRoleId>('school');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (authenticationState.checkedAuthentication === true) return;

    const url = getApiUrl({ endpoint: 'me' });
    fetchDataFromURL({ url })
      .then((data: UserData) => {
        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: !!data.authenticated,
        });
        setUser(data);
      })
      .catch((error: any) => {
        setAuthenticationState(failedAuthenticationState);
        setUser(EMPTY_USER_DATA);
        enqueueSnackbar(error?.message ?? String(error), SnackbarMetadata.error);
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
      enqueueSnackbar(
        'Your account is unverified. Please click on the verification link in the email we sent after signing up.',
        { ...SnackbarMetadata.error, persist: true }
      );
    }
  }, [user, authenticationState, enqueueSnackbar]);

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};