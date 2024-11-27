// disable eslint for this file
/* eslint-disable */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { CircularProgress, Button, TextField, FormControlLabel, Checkbox, Box, Typography, Container, Paper, Divider } from "@mui/material";

import { UserContext } from '../../ContextProviders/UserContext';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { AppRoutes } from '../../Utils/AppRoutes';
import { AlertSeverity, useNotificationContext } from '../../ContextProviders/NotificationContext';
import { CITIESair } from '../../Utils/GlobalVariables';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { RESTmethods } from "../../API/Utils";
import { MetadataContext } from '../../ContextProviders/MetadataContext';

export default function Login() {
  const { setUser } = useContext(UserContext);
  const { setCurrentPage } = useContext(MetadataContext);

  // set current page to login
  useEffect(() => {
    setCurrentPage(AppRoutes.login);
  }, [setCurrentPage]);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  const { setShowNotification, setMessage, setSeverity } = useNotificationContext();
  const [loading, setLoading] = useState(false);

  const prefabErrorMessage = 'Incorrect school ID or access code. Try again or contact us if you think there is a mistake.';

  const navigate = useNavigate();

  // After login succeeds, navigate to /dashboard if no redirect_url string query is detected
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect_url = queryParams.get(AppRoutes.redirectQuery)?.toLowerCase() || AppRoutes.dashboard;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: GeneralAPIendpoints.login }),
      restMethod: RESTmethods.POST,
      body: {
        username,
        password,
        rememberMe
      }
    })
      .then((data) => {
        setShowNotification(false)
        setLoading(false);

        setUser({
          checkedAuthentication: true,
          authenticated: true,
          allowedSchools: data.allowedSchools,
          username: data.username,
        });

        navigate(redirect_url, { replace: true });
      })
      .catch((error) => {
        setMessage(prefabErrorMessage);
        setSeverity(AlertSeverity.error);
        setShowNotification(true);
        setLoading(false);
      })
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="schoolID"
            label="Email / School ID"
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
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value={rememberMe} color="primary" />}
            onChange={e => setRememberMe(e.target.checked)}
            label={
              <Typography lineHeight={1.25}>
                Remember this device.
                <br />
                <Typography variant='caption' color='text.secondary'>
                  (Recommended for public air quality screens that need to run autonomously)
                </Typography>
              </Typography>
            }
            sx={{
              mb: -1,
              display: 'flex',
              alignItems: 'start',
              '& .MuiCheckbox-root': {
                pt: 0.25
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {
              loading
                ? <CircularProgress disableShrink color="inherit" size="1.5rem" />
                : "Log In"
            }
          </Button>
          <Typography variant="caption">
            <i>
              Login with the provided credentials to see your school's air quality dashboard, including indoor and outdoor devices. If you do not have the credentials, please contact your school admin or {CITIESair}.
            </i>
          </Typography>
        </Box>
      </Paper>


      <Divider textAlign="center" sx={{ my: 3 }}>
        <Typography variant="body1" align="center" color="text.secondary">
          Don't have an account?
        </Typography>
      </Divider>

      <Paper sx={{ p: 0, mx: 3 }} elevation={3}>
        <Button
          fullWidth
          onClick={() => navigate(`${AppRoutes.signUp}?redirect_url=${encodeURIComponent(window.location.pathname)}`)}
        >
          Sign Up
        </Button>
      </Paper>

    </Container>

  );
}