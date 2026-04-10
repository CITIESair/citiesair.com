import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
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
import type { UserData } from "../../types/UserData";
import { AppRoutes } from "../../Utils/AppRoutes";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";
import { validateEmail } from "../../Utils/UtilFunctions";
import EmailVerificationDialog from "./EmailVerificationDialog";
import GoogleOAuthButtonAndPopupHandler from "./OAuth/GoogleOAuthButtonAndPopupHandler";
import UserTypeSelector from "./UserTypeSelector";
import { LoginTypes, UserRoleKeyForLogin, type AuthSuccessMessage } from "./Utils";

const MINIMUM_PASSWORD_LENGTH = 8;

type PasswordLoginSuccessMessage = AuthSuccessMessage & {
  type: typeof LoginTypes.password;
};

export default function SignUp() {
  const [isPopupItself, setIsPopupItself] = useState<boolean>(false);

  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      setIsPopupItself(true);
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setUser, authenticationState, setAuthenticationState } = useUser();
  const [indicatedUserRole, setIndicatedUserRole] = useState<UserRoleKeyForLogin>('individual')

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState<boolean>(false);
  const [isConfirmPasswordFieldFocused, setIsConfirmPasswordFieldFocused] = useState<boolean>(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState<boolean>(false);

  // Navigate back to home page if the user has already logged in
  // except for when the user just signed up and seeing the verification dialog
  useEffect(() => {
    if (showVerificationDialog) return;
    if (authenticationState.authenticated && authenticationState.checkedAuthentication) navigate("/");
  }, [authenticationState, showVerificationDialog, navigate]);

  const { setCurrentPage } = usePreferences();
  useEffect(() => {
    setCurrentPage(AppRoutes.signUp);
  }, [setCurrentPage]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      enqueueSnackbar("Please enter a valid email address", SnackbarMetadata.error);
      return;
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      enqueueSnackbar(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long.`, SnackbarMetadata.error);
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", SnackbarMetadata.error);
      return;
    }

    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: "signup" }),
      RESTmethod: "POST",
      body: {
        email,
        password,
      },
    })
      .then((userData: UserData) => {

        if (isPopupItself) {
          const message: PasswordLoginSuccessMessage = {
            type: LoginTypes.password,
            success: true,
            user: userData,
          };

          // Send the result to the main window
          window.opener?.postMessage(message, window.location.origin);
          window.close(); // Close the popup
        } else {
          setLoading(false);
          setShowVerificationDialog(true);

          setAuthenticationState(successfulAuthenticationState);
          setUser(userData);

          if (userData.message) {
            enqueueSnackbar(userData.message, SnackbarMetadata.success);
          }
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Sign up unsuccesfully. Please try again";
        enqueueSnackbar(message, SnackbarMetadata.error);
        setLoading(false);
      });
  };

  const emailValid = !!validateEmail(email);
  const passwordStrongEnough = password.length >= MINIMUM_PASSWORD_LENGTH;
  const passwordsMatch = password === confirmPassword;

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Stack direction="column" gap={3}>
          <Typography variant="h5" fontWeight={500} gutterBottom>
            {sectionData.signup.title}
          </Typography>

          <UserTypeSelector
            route={AppRoutes.signUp}
            indicatedUserRole={indicatedUserRole}
            setIndicatedUserRole={setIndicatedUserRole}
          />

          {indicatedUserRole === 'individual' && (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  my: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: emailValid ? "green" : "",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: emailValid ? "green" : "",
                    },
                    "&:hover fieldset": {
                      borderColor: emailValid ? "green" : "",
                    },
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={`Password (Minimum ${MINIMUM_PASSWORD_LENGTH} characters)`}
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFieldFocused(true)}
                onBlur={() => setIsPasswordFieldFocused(false)}
                sx={{
                  my: 1,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: passwordStrongEnough ? "green" : "red",
                    },
                    "& fieldset": {
                      borderColor: passwordStrongEnough ? "green" : "",
                    },
                    "&:hover fieldset": {
                      borderColor: passwordStrongEnough ? "green" : "",
                    },
                  },
                }}
              />

              {isPasswordFieldFocused && (
                <Typography variant="caption" color={passwordStrongEnough ? "green" : "red"}>
                  {passwordStrongEnough ? (
                    <em>
                      <b>✔</b> Password at least {MINIMUM_PASSWORD_LENGTH} characters
                    </em>
                  ) : (
                    <em>
                      <b>!</b> Password must be at least {MINIMUM_PASSWORD_LENGTH} characters
                    </em>
                  )}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmPasswordFieldFocused(true)}
                onBlur={() => setIsConfirmPasswordFieldFocused(false)}
                sx={{
                  my: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: passwordStrongEnough && passwordsMatch ? "green" : "",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: passwordStrongEnough && passwordsMatch ? "green" : "red",
                    },
                    "&:hover fieldset": {
                      borderColor: passwordStrongEnough && passwordsMatch ? "green" : "",
                    },
                  },
                }}
              />

              {isConfirmPasswordFieldFocused && (
                <Typography variant="caption" color={passwordStrongEnough && passwordsMatch ? "green" : "red"}>
                  {passwordStrongEnough && passwordsMatch ? (
                    <em>
                      <b>✔</b> Passwords matched
                    </em>
                  ) : (
                    <em>
                      <b>!</b> Passwords must match
                    </em>
                  )}
                </Typography>
              )}

              <Button type="submit" fullWidth variant="contained" sx={{ my: 1 }}>
                {loading ? <CircularProgress disableShrink color="inherit" size="1.5rem" /> : "Sign Up"}
              </Button>

              <Divider sx={{ mb: 1 }}>
                <Typography color="text.secondary">or</Typography>
              </Divider>

              <Box width="100%">
                <GoogleOAuthButtonAndPopupHandler />
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>

      <Divider textAlign="center" sx={{ my: 3 }}>
        <Typography variant="body1" align="center" color="text.secondary">
          {sectionData.signup.content.exception}
        </Typography>
      </Divider>

      <Paper sx={{ p: 0 }} elevation={3}>
        <Button fullWidth onClick={() => navigate(AppRoutes.login)}>
          {sectionData.login.title}
        </Button>
      </Paper>

      <EmailVerificationDialog open={showVerificationDialog} email={email} />
    </Container>
  );
}
