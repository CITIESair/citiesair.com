import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Button, TextField, FormControlLabel, Checkbox, Box, Typography, Container, Paper, Divider, Stack } from "@mui/material";
import { UserContext } from '../../ContextProviders/UserContext';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { AppRoutes } from '../../Utils/AppRoutes';
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { RESTmethods } from "../../API/Utils";
import { MetadataContext } from '../../ContextProviders/MetadataContext';
import GoogleOAuthButtonAndPopupHandler from './OAuth/GoogleOAuthButtonAndPopupHandler';
import { LoginTypes, UserRoles } from './Utils';
import { useSnackbar } from "notistack";
import UserTypeSelector from './UserTypeSelector';
import sectionData from "../../section_data.json";

export default function Login() {
  const { enqueueSnackbar } = useSnackbar()

  const [isPopupItself, setIsPopupItself] = useState(false);

  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      setIsPopupItself(true);
      enqueueSnackbar("You must be logged in to access this functionality.", SnackbarMetadata.info);
    }
  }, [enqueueSnackbar]);

  const navigate = useNavigate();

  const { setUser, authenticationState, setAuthenticationState, userRole } = useContext(UserContext);

  useEffect(() => {
    if (authenticationState.authenticated && authenticationState.checkedAuthentication) navigate("/");
  }, [authenticationState, navigate]);

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
        <Stack direction="column" gap={3}>
          <Typography variant="h5" fontWeight={500}>
            {sectionData.login.title}
          </Typography>

          <UserTypeSelector route={AppRoutes.login} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={UserRoles[userRole]?.loginLabels.username}
              name="username"
              autoComplete="username"
              onChange={e => setUserName(e.target.value)}
              sx={{ mt: 0, mb: 1 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={UserRoles[userRole]?.loginLabels.password}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              sx={{ my: 1 }}
            />
            <FormControlLabel
              control={<Checkbox value={rememberMe} color="primary" />}
              onChange={e => setRememberMe(e.target.checked)}
              label="Remember Me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ my: 1 }}
            >
              {
                loading
                  ? <CircularProgress disableShrink color="inherit" size="1.5rem" />
                  : sectionData.login.title
              }
            </Button>

            {
              userRole === UserRoles.individual.id &&
              (
                <>
                  <Divider sx={{ mx: "40%", mb: 1 }}>
                    <Typography color="text.secondary">or</Typography>
                  </Divider>

                  <Box width="100%">
                    <GoogleOAuthButtonAndPopupHandler />
                  </Box>
                </>
              )
            }

          </Box>
        </Stack>
      </Paper>

      {
        userRole === UserRoles.individual.id &&
        (
          <>
            <Divider textAlign="center" sx={{ my: 3 }}>
              <Typography variant="body1" align="center" color="text.secondary">
                {sectionData.login.content.exception}
              </Typography>
            </Divider>

            <Paper sx={{ p: 0 }} elevation={3}>
              <Button
                fullWidth
                onClick={() => navigate(AppRoutes.signUp)}
              >
                {sectionData.signup.title}
              </Button>
            </Paper>
          </>
        )
      }

    </Container >

  );
}