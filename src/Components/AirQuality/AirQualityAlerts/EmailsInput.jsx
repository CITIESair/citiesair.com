import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Chip, Menu, MenuItem, Grid, Typography, Button, Stack, useMediaQuery } from '@mui/material';
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { RESTmethods } from "../../../API/Utils";
import { getApiUrl } from '../../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../../API/Utils";
import { DashboardContext } from '../../../ContextProviders/DashboardContext';
import { isValidArray } from '../../../Utils/UtilFunctions';
import { AlertSeverity, useNotificationContext } from '../../../ContextProviders/NotificationContext';

const compareArrays = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const EmailsInput = (props) => {
  const { schoolContactEmail } = props;

  const { currentSchoolID } = useContext(DashboardContext);

  const { setShowNotification, setMessage, setSeverity } = useNotificationContext();

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [serverEmails, setServerEmails] = useState([]);
  const [localEmails, setLocalEmails] = useState([]);

  const [currentEmail, setCurrentEmail] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const maxEmails = 20;
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
        endpoint: GeneralAPIendpoints.alertsEmails,
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
        setMessage("There was an error loading the email list, please try again.");
        setSeverity(AlertSeverity.error);
        setShowNotification(true);
      });
  }, [currentSchoolID]);

  useEffect(() => {
    setLocalEmails(serverEmails);
  }, [serverEmails]);

  const handleAddEmail = (passedEmail) => {
    const email = passedEmail.trim().toLowerCase();

    // If email address follows email format
    if (validateEmail(email)) {
      const newEmails = [...localEmails, email];

      // Make sure currentEmail hasn't been added before
      if (localEmails.includes(email)) {
        setMessage(`Already added: ${email}`);
        setSeverity(AlertSeverity.error);
        setShowNotification(true);

        setCurrentEmail('');
        return;
      }

      // Display alert if reached maximum number of email recipients
      if (newEmails.length === maxEmails) {
        setMessage('Maximum number of recipients reached');
        setSeverity(AlertSeverity.warning);
        setShowNotification(true);
      }

      setLocalEmails(newEmails);
      setCurrentEmail('');
      setMessage();
    } else {
      setMessage('Invalid email address. Valid format: abc@def.xyz');
      setSeverity(AlertSeverity.error);
      setShowNotification(true);
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
        endpoint: GeneralAPIendpoints.alertsEmails,
        school_id: currentSchoolID
      }),
      restMethod: RESTmethods.POST,
      body: emailsToSave
    }).then((data) => {
      setServerEmails(data);

      setSeverity(AlertSeverity.success);
      setMessage('Email list saved successfully!');
      setShowNotification(true);
    }).catch(() => {
      setMessage('There was an error saving the email. Please try again.');
      setSeverity(AlertSeverity.error);
      setShowNotification(true);
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
                      if (['Enter', 'Spacebar', ' '].includes(e.key)) {
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

        <Button
          onClick={handleSaveEmails}
          variant="contained"
          sx={{ width: smallScreen ? "100%" : "fit-content" }}
          disabled={compareArrays(localEmails, serverEmails)}
        >
          SAVE EMAIL LIST
        </Button>
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
