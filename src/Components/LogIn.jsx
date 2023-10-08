// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';

import { Button, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, Dialog, DialogActions, DialogContent, useMediaQuery, Tooltip, IconButton } from "@mui/material";

import { useTheme } from '@mui/material/styles';

import DataObjectIcon from '@mui/icons-material/DataObject';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HelpIcon from '@mui/icons-material/Help';

export default function LogIn() {

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          handleOpen();
          Tracking.sendEventAnalytics(Tracking.Events.rawDatasetButtonClicked, {
            project_id: project.id
          });
        }}
        variant="contained"
      >
        <DataObjectIcon sx={{ fontSize: '1rem' }} />&nbsp;Raw Dataset
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={smallScreen}
        keepMounted
      >
        {(
          smallScreen &&
          <DialogActions justifyContent="flex-start">
            <Button autoFocus onClick={handleClose}>
              <ChevronLeftIcon sx={{ fontSize: '1rem' }} />Back
            </Button>
          </DialogActions>
        )}

        <DialogContent sx={{
          px: smallScreen ? 2 : 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          height: '100%'
        }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="schoolID"
              label="School ID"
              name="schoolID"
              autoFocus
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
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember this device"
              sx={{ mb: -1 }}
            />
            <br />
            <Typography variant="caption" sx={{ ml: 3.75 }}>
              (Recommended for public air quality screens that need to run autonomously)
            </Typography>
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
        </DialogContent>
      </Dialog>
    </>

  );
}