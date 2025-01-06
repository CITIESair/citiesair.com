// disable eslint for this file
/* eslint-disable */
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { StyledMenuItem } from '../Header/MenuItemAsNavLink';

import { UserContext } from '../../ContextProviders/UserContext';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { fetchDataFromURL } from '../../API/ApiFetch';
import { RESTmethods } from "../../API/Utils";
import { EMPTY_USER_DATA } from '../../Utils/GlobalVariables';
import { useSnackbar } from 'notistack';
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';

export default function LogOut() {
  const { setUser, setAuthenticationState } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar()

  const logOut = async () => {
    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: GeneralAPIendpoints.logout }),
      restMethod: RESTmethods.GET
    })
      .then((data) => {
        setLoading(false);

        setAuthenticationState({
          checkedAuthentication: true,
          authenticated: false,
        })
        setUser(EMPTY_USER_DATA);

        if (data.message) enqueueSnackbar(data.message, {
          variant: SnackbarMetadata.success.name,
          duration: SnackbarMetadata.success.duration
        });


        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

        enqueueSnackbar(data.message, {
          variant: SnackbarMetadata.error.name,
          duration: SnackbarMetadata.error.duration
        });
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