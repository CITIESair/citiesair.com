// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';

import { Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, Paper, useMediaQuery, Tooltip, IconButton, Alert } from "@mui/material";

import { useTheme } from '@mui/material/styles';

import DataObjectIcon from '@mui/icons-material/DataObject';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HelpIcon from '@mui/icons-material/Help';
import { UserContext } from '../ContextProviders/UserContext';

async function loginUser(credentials) {
  return fetch('https://api.citiesair.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(credentials)
  })
    .then(data => data)
}

export default function LogIn({ onLogin }) {
  const [_, __, setAuthenticated, setContextUserName] = useContext(UserContext);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState();
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);

  const prefabErrorMessage = 'Incorrect school ID or access code. Please try again or contact CITIESair if you think there is a mistake.';
  const prefabSuccessMessage = 'Successfully logged in.';

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (event) => {
    event.preventDefault();

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
          setMessage(prefabSuccessMessage);
          setContextUserName(username);

          // Introduce a delay of 1 second before setting authenticated to true
          // for the user to read success message
          setTimeout(() => {
            setAuthenticated(true);
          }, 1000);

        }
        else {
          throw new Error(`Error authenticating`);
        }
      })
      .catch((error) => {
        setMessage(prefabErrorMessage);
        setIsWrongCredentials(true);
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
            LogIn
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