// disable eslint for this file
/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { StyledMenuItem } from '../Header/MenuItemAsNavLink';
import { getApiUrl } from '../../API/APIUtils';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { EMPTY_USER_DATA } from "../../types/UserData";
import { useSnackbar } from 'notistack';
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';
import { defaultAuthenticationState } from '../../types/AuthenticationState';
import { useUser } from '../../ContextProviders/UserContext';

export default function LogOut() {
  const { setUser, setAuthenticationState } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar()

  const logOut = async () => {
    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: "logout" }),
      RESTmethod: "GET"
    })
      .then((data) => {
        setLoading(false);
        setAuthenticationState(defaultAuthenticationState);
        setUser(EMPTY_USER_DATA);
        enqueueSnackbar(data.message || "Logout successfully", SnackbarMetadata.success);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.message, SnackbarMetadata.error);
      })
  };

  return (
    <StyledMenuItem
      onClick={logOut}
      sx={{ '& *': { fontSize: '1rem' } }}
    >
      {loading
        ? (
          <>
            <CircularProgress disableShrink color="inherit" size="1.5rem" />
          </>
        )
        : (
          <>
            <LogoutIcon />&nbsp;Logout
          </>
        )
      }
    </StyledMenuItem>
  );
}