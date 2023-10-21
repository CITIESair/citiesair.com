// disable eslint for this file
/* eslint-disable */
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { CircularProgress, Button, TextField, FormControlLabel, Checkbox, Box, Typography, Container, Paper, useMediaQuery, Alert } from "@mui/material";

import { UserContext } from '../../ContextProviders/UserContext';

export default function LogIn() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user.checkedAuthentication === true && user.authenticated === true) {
      navigate('/dashboard');
    }
  }, [user]);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState();
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);
  const [loading, setLoading] = useState(false);

  const prefabErrorMessage = 'Incorrect school ID or access code. Please try again or contact CITIESair if you think there is a mistake.';

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    fetch('https://api.citiesair.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, password, rememberMe
      }),
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          setIsWrongCredentials(false);
          setLoading(false);
          setUser({
            checkedAuthentication: true,
            authenticated: true,
            username: username
          });
          navigate("/dashboard");
        }
        else {
          throw new Error(`Error authenticating`);
        }
      })
      .catch((error) => {
        setMessage(prefabErrorMessage);
        setIsWrongCredentials(true);
        setLoading(false);
        console.log(error);
      })
  };

  return (
    <Container maxWidth="sm" sx={{ my: 3 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight={500}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {
            message &&
            <Alert severity={isWrongCredentials ? "error" : "success"}>{message}</Alert>
          }

          <TextField
            margin="normal"
            required
            fullWidth
            id="schoolID"
            label="School ID"
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
            label="Access Code"
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
              Login with the provided credentials to see your school's air quality dashboard, including indoor and outdoor devices. If you do not have the credentials, please contact your school admin or CITIESair.
            </i>
          </Typography>
        </Box>
      </Paper>
    </Container>

  );
}