import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Chip, Menu, MenuItem, Snackbar, Alert, Grid, Typography, Button, Stack, useMediaQuery } from '@mui/material';
import { RESTmethods, fetchDataFromURL } from "../../../Utils/ApiFunctions/ApiCalls";
import { GeneralEndpoints, getApiUrl } from '../../../Utils/ApiFunctions/ApiUtils';
import { DashboardContext } from '../../../ContextProviders/DashboardContext';
import { isValidArray } from '../../../Utils/Utils';

const compareArrays = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const EmailsInput = (props) => {
  const { schoolContactEmail } = props;

  const { currentSchoolID } = useContext(DashboardContext);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [serverEmails, setServerEmails] = useState([]);
  const [localEmails, setLocalEmails] = useState([]);

  const [currentEmail, setCurrentEmail] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');

  const maxEmails = 10;
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Fetch emails from backend
  useEffect(() => {
    fetchDataFromURL({
      url: getApiUrl({
        endpoint: GeneralEndpoints.alertsEmails,
        school_id: currentSchoolID
      }),
      extension: 'json',
      needsAuthorization: true
    }).then((data) => {
      setServerEmails(data);

      // If no email recipient has been added before, add the admin email as the default one first
      // then save to backend
      if (data.length === 0 && schoolContactEmail) {
        handleSaveEmails([schoolContactEmail]);
      }
    })
      .catch((error) => {
        setAlertMessage("There was an error loading the email list, please try again.");
        setAlertSeverity("error");
      });
  }, [currentSchoolID]);

  useEffect(() => {
    setLocalEmails(serverEmails);
  }, [serverEmails])

  const handleAddEmail = (passedEmail) => {
    const email = passedEmail.toLowerCase();

    // If email address follows email format
    if (validateEmail(email)) {
      const newEmails = [...localEmails, email];

      // Make sure currentEmail hasn't been added before
      if (localEmails.includes(email)) {
        setAlertMessage(`Already added: ${email}`);
        setAlertSeverity('error');

        setCurrentEmail('');
        return;
      }

      // Display alert if reached maximum number of email recipients
      if (newEmails.length === maxEmails) {
        setAlertMessage('Maximum number of recipients reached');
        setAlertSeverity('warning');
      }

      setLocalEmails(newEmails);
      setCurrentEmail('');
      setAlertMessage();
    } else {
      setAlertMessage('Invalid email address. Valid format: abc@def.xyz');
      setAlertSeverity('error');
    }
  };

  const handleDeleteEmail = (index) => {
    const newEmails = localEmails.filter((_, i) => i !== index);
    setLocalEmails(newEmails);
  };

  const handleEditEmail = (index) => {
    setCurrentEmail(localEmails[index]);
    handleDeleteEmail(index);
  };

  const handleMenuOpen = (event, index) => {
    setMenuAnchor({ index, element: event.currentTarget });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handlePaste = (event) => {
    const pastedText = event.clipboardData.getData('text');
    setCurrentEmail(pastedText);
    handleAddEmail(pastedText);
    event.preventDefault();
  };

  const handleSaveEmails = (_emails) => {
    const emailsToSave = isValidArray(_emails) ? _emails : (isValidArray(localEmails) ? localEmails : []);

    fetchDataFromURL({
      url: getApiUrl({
        endpoint: GeneralEndpoints.alertsEmails,
        school_id: currentSchoolID
      }),
      restMethod: RESTmethods.POST,
      body: emailsToSave
    }).then((data) => {
      setServerEmails(data);
      setAlertSeverity('success');
      setAlertMessage('Email list saved successfully!');
    }).catch(() => {
      setAlertMessage('There was an error saving the email. Please try again.');
      setAlertSeverity('error');
    })

    return;
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (localEmails !== serverEmails) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [localEmails, serverEmails]);

  return (
    <Box>
      <Grid container alignItems="center" wrap="wrap">
        <Grid item>
          <Typography
            variant='body1'
            fontWeight={500}
            sx={{ p: 0, mb: smallScreen && 1, mr: !smallScreen && 2 }}
          >
            Email Recipients:
          </Typography>
        </Grid>
        <Grid item xs={12} sm>
          <Grid
            container
            alignItems="center"
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: 2,
              p: 0.5,
              flexWrap: 'wrap',
              width: '100%'
            }}
          >
            {localEmails.map((email, index) => (
              <Grid item key={index} sx={{ m: 0.5 }}>
                <Chip
                  label={email}
                  onDelete={() => handleDeleteEmail(index)}
                  onClick={(event) => handleMenuOpen(event, index)}
                />
              </Grid>
            )
            )}
            {
              localEmails.length < maxEmails ? (
                <Grid item xs={12} sm minWidth="200px">
                  <TextField
                    fullWidth
                    variant="standard"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        handleAddEmail(currentEmail);
                      }
                    }}
                    onPaste={handlePaste}
                    placeholder="Add recipient"
                    sx={{
                      mx: 0.5,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { textTransform: "lowercase" }
                    }}
                  />
                </Grid>
              ) : null
            }

          </Grid>
        </Grid>
      </Grid>

      <Stack sx={{ mt: 1 }} spacing={0.5} alignItems={smallScreen ? "stretch" : "end"}>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          textAlign="right"
        >
          {localEmails.length} / {maxEmails} recipient{localEmails.length > 1 ? 's' : null} added
        </Typography>
        <Grid container spacing={1} width="fit-content">
          {alertMessage &&
            (
              <Grid item xs={12} sm="auto">
                <Alert
                  onClose={() => setAlertMessage()}
                  severity={alertSeverity}
                  sx={{
                    py: 0.5,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    "& div": {
                      fontSize: "0.75rem",
                      p: 0
                    },
                    "& .MuiAlert-icon": {
                      fontSize: "1rem",
                      mr: 0.5
                    }
                  }}
                >
                  {alertMessage}
                </Alert>
              </Grid>
            )
          }
          <Grid item xs={12} sm="auto">
            <Button
              onClick={handleSaveEmails}
              variant="contained"
              sx={{ width: smallScreen ? "100%" : "fit-content" }}
              disabled={compareArrays(localEmails, serverEmails)}
            >
              SAVE EMAIL LIST
            </Button>
          </Grid>

        </Grid>

      </Stack>

      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleEditEmail(menuAnchor.index);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmailsInput;
