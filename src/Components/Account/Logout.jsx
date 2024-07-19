// disable eslint for this file
/* eslint-disable */
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { StyledMenuItem } from '../Header/MenuItemAsNavLink';

import { UserContext } from '../../ContextProviders/UserContext';
import { GeneralEndpoints, getApiUrl } from '../../Utils/ApiFunctions/ApiUrls';
import { fetchDataFromURL, RESTmethods } from '../../Utils/ApiFunctions/ApiCalls';

export default function LogOut() {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: GeneralEndpoints.logout }),
      restMethod: RESTmethods.GET
    })
      .then(() => {
        setUser({
          checkedAuthentication: true,
          authenticated: false,
          username: null
        });
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
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
            <LogoutIcon />&nbsp;Log Out
          </>
        )
      }
    </StyledMenuItem>
  );
}