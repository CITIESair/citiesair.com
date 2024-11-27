// disable eslint for this file
/* eslint-disable */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Button, TextField, Box, Typography, Container, Paper } from "@mui/material";

import { UserContext } from "../../ContextProviders/UserContext";
import { getApiUrl } from "../../API/ApiUrls";
import { GeneralAPIendpoints, RESTmethods } from "../../API/Utils";
import { AppRoutes } from "../../Utils/AppRoutes";
import { AlertSeverity, useNotificationContext } from "../../ContextProviders/NotificationContext";
import { fetchDataFromURL } from "../../API/ApiFetch";

const MINIMUM_PASSWORD_LENGTH = 8;

export default function SignUp() {
  const { setUser } = useContext(UserContext);
  const { setShowNotification, setMessage, setSeverity } =
    useNotificationContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setSeverity(AlertSeverity.error);
      setShowNotification(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setSeverity(AlertSeverity.error);
      setShowNotification(true);
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
    })
      .then((data) => {
        setShowNotification(false);
        setLoading(false);

        setUser({
          checkedAuthentication: true,
          authenticated: true,
          email: data.email,
        });

        navigate(AppRoutes.dashboard, { replace: true });
      })
      .catch((error) => {
        setMessage("Sign up unsuccesfully. Please try again.");
        setSeverity(AlertSeverity.error);
        setShowNotification(true);
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500}>
          Sign Up
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor:
                  password.length >= MINIMUM_PASSWORD_LENGTH && password === confirmPassword ? "green" : "",
                "&.Mui-focused fieldset": {
                  borderColor:
                    password.length >= MINIMUM_PASSWORD_LENGTH && password === confirmPassword ? "green" : "",
                },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor:
                  password.length >= 8 && password === confirmPassword ? "green" : "",
                "&.Mui-focused fieldset": {
                  borderColor:
                    password.length >= 8 && password === confirmPassword ? "green" : "",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress disableShrink color="inherit" size="1.5rem" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
        <Typography variant="body1" align="center">
          Already have an account?
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate(`${AppRoutes.login}?redirect_url=${encodeURIComponent(window.location.pathname)}`)}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
}
