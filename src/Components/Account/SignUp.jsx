// disable eslint for this file
/* eslint-disable */
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  Divider,
} from "@mui/material";

import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { AppRoutes } from "../../Utils/AppRoutes";

import { fetchDataFromURL } from "../../API/ApiFetch";
import { validateEmail } from "../../Utils/UtilFunctions";
import { MetadataContext } from "../../ContextProviders/MetadataContext";
import EmailVerificationDialog from "./EmailVerificationDialog";
import GoogleOAuthButtonAndPopupHandler from "./OAuth/GoogleOAuthButtonAndPopupHandler";
import { LoginTypes } from "./Utils";

import { useSnackbar } from "notistack";
import { SnackbarMetadata } from "../../Utils/SnackbarMetadata";

const MINIMUM_PASSWORD_LENGTH = 8;

export default function SignUp() {
  const [isPopupItself, setIsPopupItself] = useState(false);
  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      setIsPopupItself(true);
    }
  }, []);

  const navigate = useNavigate();

  const { setUser, authenticationState, setAuthenticationState } = useContext(UserContext);

  // Navigate back to home page if the user has already logged in
  // except for when the user just signed up and seeing the verification dialog
  useEffect(() => {
    if (showVerificationDialog) return;

    if (authenticationState.authenticated && authenticationState.checkedAuthentication) navigate("/");
  }, [authenticationState]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const [isConfirmPasswordFieldFocused, setIsConfirmPasswordFieldFocused] =
    useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false); // State for dialog

  const { enqueueSnackbar } = useSnackbar();

  const { setCurrentPage } = useContext(MetadataContext);
  useEffect(() => {
    setCurrentPage(AppRoutes.signUp);
  }, [setCurrentPage]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      enqueueSnackbar("Please enter a valid email address", {
        variant: SnackbarMetadata.error.name,
        duration: SnackbarMetadata.error.duration
      });
      return;
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      enqueueSnackbar(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long.`
        , {
          variant: SnackbarMetadata.error.name,
          duration: SnackbarMetadata.error.duration
        });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: SnackbarMetadata.error.name,
        duration: SnackbarMetadata.error.duration
      });
      return;
    }

    setLoading(true);

    fetchDataFromURL({
      url: getApiUrl({ endpoint: GeneralAPIendpoints.signUp }),
      restMethod: RESTmethods.POST,
      body: {
        email,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
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
          setLoading(false);
          setShowVerificationDialog(true);

          setAuthenticationState({
            checkedAuthentication: true,
            authenticated: true
          })
          setUser(data);

          if (data.message) {
            enqueueSnackbar(data.message, {
              variant: SnackbarMetadata.success.name,
              duration: SnackbarMetadata.success.duration
            });
          }
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.message || "Sign up unsuccesfully. Please try again", {
          variant: SnackbarMetadata.error.name,
          duration: SnackbarMetadata.error.duration
        });
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          Sign Up
        </Typography>

        <Typography variant="caption" fontStyle="italic">
          <Typography fontWeight={500} variant="caption" gutterBottom>
            For school admins:
          </Typography>{" "}
          Self sign up is not available for schools yet. Please contact us for
          an account to access your school's private dashboard.
          <br />
          <Typography fontWeight={500} variant="caption">
            For NYU Abu Dhabi community:
          </Typography>{" "}
          Make a personal account to add and manage air quality alerts in the
          NYUAD dashboard.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: validateEmail(email) ? "green" : "",
                },
                "&.Mui-focused fieldset": {
                  borderColor: validateEmail(email) ? "green" : "",
                },
                "&:hover fieldset": {
                  borderColor: validateEmail(email) ? "green" : "",
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
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH
                      ? "green"
                      : "red",
                },
                "& fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH ? "green" : "",
                },
                "&:hover fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH ? "green" : "",
                },
              },
            }}
          />
          {isPasswordFieldFocused && (
            <Typography
              variant="caption"
              color={
                password.length >= MINIMUM_PASSWORD_LENGTH ? "green" : "red"
              }
            >
              {password.length >= MINIMUM_PASSWORD_LENGTH ? (
                <em>
                  <b>✔</b> Password at least {MINIMUM_PASSWORD_LENGTH}{" "}
                  characters
                </em>
              ) : (
                <em>
                  <b>!</b> Password must be at least {MINIMUM_PASSWORD_LENGTH}{" "}
                  characters
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH &&
                      password === confirmPassword
                      ? "green"
                      : "",
                },
                "&.Mui-focused fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH &&
                      password === confirmPassword
                      ? "green"
                      : "red",
                },
                "&:hover fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH &&
                      password === confirmPassword
                      ? "green"
                      : "",
                },
              },
            }}
          />
          {isConfirmPasswordFieldFocused && (
            <Typography
              variant="caption"
              color={
                password.length >= MINIMUM_PASSWORD_LENGTH &&
                  password === confirmPassword
                  ? "green"
                  : "red"
              }
            >
              {password.length >= MINIMUM_PASSWORD_LENGTH &&
                password === confirmPassword ? (
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            {loading ? (
              <CircularProgress disableShrink color="inherit" size="1.5rem" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Divider sx={{ mb: 1 }}>
            <Typography color="text.secondary">or</Typography>
          </Divider>

          <Box width="100%">
            <GoogleOAuthButtonAndPopupHandler />
          </Box>
        </Box>
      </Paper>

      <Divider textAlign="center" sx={{ my: 3 }}>
        <Typography variant="body1" align="center" color="text.secondary">
          Already have an account?
        </Typography>
      </Divider>

      <Paper sx={{ p: 0, mx: 3 }} elevation={3}>
        <Button fullWidth onClick={() => navigate(AppRoutes.login)}>
          Login
        </Button>
      </Paper>
      <EmailVerificationDialog
        open={showVerificationDialog}
        email={email}
      />
    </Container>
  );
}
