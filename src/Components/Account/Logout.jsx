// disable eslint for this file
/* eslint-disable */
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { StyledMenuItem } from '../Header/MenuItemAsNavLink';

import { UserContext } from '../../ContextProviders/UserContext';

export default function LogOut() {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    setLoading(true);
    fetch('https://api.citiesair.com/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          setUser({
            checkedAuthentication: true,
            authenticated: false,
            username: null
          });
          navigate('/');
        }
        else {
          throw new Error(`Error authenticating`);
        }
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