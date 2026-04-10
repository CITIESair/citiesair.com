import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";

import { fetchDataFromURL } from "../../API/ApiFetch";
import { getApiUrl } from "../../API/APIUtils";
import { usePreferences } from "../../ContextProviders/PreferenceContext";
import { useUser } from "../../ContextProviders/UserContext";
import sectionData from "../../SectionData/sectionData";
import { successfulAuthenticationState } from "../../types/AuthenticationState";
import { UserRoles, type UserData } from "../../types/UserData";
import { AppRoutes } from "../../Utils/AppRoutes";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";
import GoogleOAuthButtonAndPopupHandler from "./OAuth/GoogleOAuthButtonAndPopupHandler";
import UserTypeSelector from "./UserTypeSelector";
import { LoginTypes, UserRoleKeyForLogin, type AuthSuccessMessage } from "./Utils";

type PasswordLoginSuccessMessage = AuthSuccessMessage & {
  type: typeof LoginTypes.password;
};

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();

  const [isPopupItself, setIsPopupItself] = useState<boolean>(false);

  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      setIsPopupItself(true);
      enqueueSnackbar("You must be logged in to access this functionality.", SnackbarMetadata.info);
    }
  }, [enqueueSnackbar]);

  const navigate = useNavigate();
  const { setUser, authenticationState, setAuthenticationState } = useUser();

  const [indicatedUserRole, setIndicatedUserRole] = useState<UserRoleKeyForLogin>('school')

  useEffect(() => {
    if (authenticationState.authenticated && authenticationState.checkedAuthentication) navigate("/");
  }, [authenticationState, navigate]);

  const { setCurrentPage } = usePreferences();

  // set current page to login
  useEffect(() => {
    setCurrentPage(AppRoutes.login);
  }, [setCurrentPage]);

  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // After login succeeds, navigate to /dashboard if no redirect_url string query is detected
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect_url = queryParams.get(AppRoutes.redirectQuery)?.toLowerCase() || AppRoutes.dashboard;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Alert error if the credential is missing
    if (username === "" || password === "") {
      enqueueSnackbar("Credentials cannot be empty.", SnackbarMetadata.error);
      return;
    }

    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: "login" }),
      RESTmethod: "POST",
      body: {
        username,
        password,
        remember_me: rememberMe,
      },
    })
      .then((userData: UserData) => {
        setLoading(false);

        if (isPopupItself) {
          // Send the result to the main window
          const message: PasswordLoginSuccessMessage = {
            type: LoginTypes.password,
            success: true,
            user: userData,
          };

          window.opener?.postMessage(message, window.location.origin);
          window.close(); // Close the popup
        } else {
          setAuthenticationState(successfulAuthenticationState);
          setUser(userData);

          if (userData.message) {
            enqueueSnackbar(userData.message, SnackbarMetadata.success);
          }

          navigate(redirect_url, { replace: true });
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        enqueueSnackbar(message, SnackbarMetadata.error);
        setLoading(false);
      });
  };

  const loginLabels = UserRoles[indicatedUserRole].loginLabels;

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Stack direction="column" gap={3}>
          <Typography variant="h5" fontWeight={500}>
            {sectionData.login.title}
          </Typography>

          <UserTypeSelector
            route={AppRoutes.login}
            indicatedUserRole={indicatedUserRole}
            setIndicatedUserRole={setIndicatedUserRole}
          />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={loginLabels.username}
              name="username"
              autoComplete="username"
              onChange={(e) => setUserName(e.target.value)}
              sx={{ mt: 0, mb: 1 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={loginLabels.password}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ my: 1 }}
            />
            <FormControlLabel
              control={<Checkbox checked={rememberMe} color="primary" />}
              onChange={(e) => setRememberMe((e.target as HTMLInputElement).checked)}
              label="Remember Me"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ my: 1 }}>
              {loading ? <CircularProgress disableShrink color="inherit" size="1.5rem" /> : sectionData.login.title}
            </Button>

            {indicatedUserRole === 'individual' && (
              <>
                <Divider sx={{ mx: "40%", mb: 1 }}>
                  <Typography color="text.secondary">or</Typography>
                </Divider>

                <Box width="100%">
                  <GoogleOAuthButtonAndPopupHandler />
                </Box>
              </>
            )}
          </Box>
        </Stack>
      </Paper>

      {indicatedUserRole === 'individual' && (
        <>
          <Divider textAlign="center" sx={{ my: 3 }}>
            <Typography variant="body1" align="center" color="text.secondary">
              {sectionData.login.content.exception}
            </Typography>
          </Divider>

          <Paper sx={{ p: 0 }} elevation={3}>
            <Button fullWidth onClick={() => navigate(AppRoutes.signUp)}>
              {sectionData.signup.title}
            </Button>
          </Paper>
        </>
      )}
    </Container>
  );
}
