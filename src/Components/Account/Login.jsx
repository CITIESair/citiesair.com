// disable eslint for this file
/* eslint-disable */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { CircularProgress, Button, TextField, FormControlLabel, Checkbox, Box, Typography, Container, Paper, Divider } from "@mui/material";

import { UserContext } from '../../ContextProviders/UserContext';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { AppRoutes } from '../../Utils/AppRoutes';
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { RESTmethods } from "../../API/Utils";
import { MetadataContext } from '../../ContextProviders/MetadataContext';
import GoogleOAuthButtonAndPopupHandler from './OAuth/GoogleOAuthButtonAndPopupHandler';
import { LoginTypes } from './Utils';

import { useSnackbar } from "notistack";
import UserTypeSelector from './UserTypeSelector';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import jsonData from '../../section_data.json';


export default function Login() {
  const { enqueueSnackbar } = useSnackbar()

  const [isPopupItself, setIsPopupItself] = useState(false);

  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      setIsPopupItself(true);
      enqueueSnackbar("You must be logged in to access this functionality.", SnackbarMetadata.info);
    }
  }, []);

  const navigate = useNavigate();

  const { setUser, authenticationState, setAuthenticationState, isSchoolForLogin } = useContext(UserContext);

  useEffect(() => {
    if (authenticationState.authenticated && authenticationState.checkedAuthentication) navigate("/");
  }, [authenticationState]);

  const { setCurrentPage } = useContext(MetadataContext);

  // set current page to login
  useEffect(() => {
    setCurrentPage(AppRoutes.login);
  }, [setCurrentPage]);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  // After login succeeds, navigate to /dashboard if no redirect_url string query is detected
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect_url = queryParams.get(AppRoutes.redirectQuery)?.toLowerCase() || AppRoutes.dashboard;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Alert error if the credential is missing
    if (username === "" || password === "") {
      enqueueSnackbar("Credentials cannot be empty.", SnackbarMetadata.error);
      return;
    }

    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: GeneralAPIendpoints.login }),
      restMethod: RESTmethods.POST,
      body: {
        username,
        password,
        remember_me: rememberMe
      }
    })
      .then((data) => {
        setLoading(false);

        if (isPopupItself) {
          // Send the result to the main window
          window.opener.postMessage(
            {
              type: LoginTypes.password,
              success: true,
              user: data,
            },
            window.location.origin
          );

          window.close(); // Close the popup
        } else {
          setAuthenticationState({
            checkedAuthentication: true,
            authenticated: true
          });
          setUser(data);

          if (data.message) {
            enqueueSnackbar(data.message, SnackbarMetadata.success);
          }

          navigate(redirect_url, { replace: true });
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.message, SnackbarMetadata.error);
        setLoading(false);
      })
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          Login
        </Typography>

        <UserTypeSelector />

        {
          isSchoolForLogin === null ? null :
            (
              <>
                <Typography variant="caption" fontStyle="italic">
                  {
                    parse(isSchoolForLogin ? jsonData.login.content.school : jsonData.login.content.nyuad, {
                      replace: replacePlainHTMLWithMuiComponents,
                    })
                  }
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="schoolID"
                    label={isSchoolForLogin ? "School ID" : "Email"}
                    name="schoolID"
                    autoComplete="username"
                    autoFocus
                    onChange={e => setUserName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={isSchoolForLogin ? "Access Code" : "Password"}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox value={rememberMe} color="primary" />}
                    onChange={e => setRememberMe(e.target.checked)}
                    sx={{
                      mb: isSchoolForLogin ? -1 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      ...(isSchoolForLogin && {
                        '& .MuiCheckbox-root': {
                          pt: 0.25
                        }
                      })
                    }}
                    label={
                      <Typography lineHeight={isSchoolForLogin ? 1.25 : "unset"}>
                        Remember this device
                        {
                          isSchoolForLogin === true ?
                            (
                              <>
                                <br />
                                <Typography variant='caption' color='text.secondary'>
                                  (Recommended for public air quality screens that need to run autonomously)
                                </Typography>
                              </>
                            ) : null
                        }
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}
                  >
                    {
                      loading
                        ? <CircularProgress disableShrink color="inherit" size="1.5rem" />
                        : "Log In"
                    }
                  </Button>

                  {
                    isSchoolForLogin === true ? null :
                      (
                        <>
                          <Divider sx={{ mb: 1 }}>
                            <Typography color="text.secondary">or</Typography>
                          </Divider>

                          <Box width="100%">
                            <GoogleOAuthButtonAndPopupHandler />
                          </Box>
                        </>
                      )
                  }

                </Box>
              </>
            )
        }
      </Paper>

      {
        isSchoolForLogin === false ?
          (
            <>
              <Divider textAlign="center" sx={{ my: 3 }}>
                <Typography variant="body1" align="center" color="text.secondary">
                  Don't have an account?
                </Typography>
              </Divider>

              <Paper sx={{ p: 0, mx: 3 }} elevation={3}>
                <Button
                  fullWidth
                  onClick={() => navigate(AppRoutes.signUp)}
                >
                  Sign Up
                </Button>
              </Paper>
            </>
          ) : null
      }

    </Container >

  );
}