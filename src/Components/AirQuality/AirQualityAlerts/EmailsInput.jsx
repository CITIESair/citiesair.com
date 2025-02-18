import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, Chip, Menu, MenuItem, Grid, Typography, Button, Stack, useMediaQuery, Alert, Tooltip, Link } from '@mui/material';
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { RESTmethods } from "../../../API/Utils";
import { getApiUrl } from '../../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../../API/Utils";
import { DashboardContext } from '../../../ContextProviders/DashboardContext';
import { isValidArray } from '../../../Utils/UtilFunctions';
import { SnackbarMetadata } from '../../../Utils/SnackbarMetadata';
import { validateEmail } from '../../../Utils/UtilFunctions';
import { useSnackbar } from 'notistack';

const compareArrays = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const EmailsInput = () => {
  const { currentSchoolID } = useContext(DashboardContext);

  const { enqueueSnackbar } = useSnackbar()

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [serverEmails, setServerEmails] = useState([]);
  const [localEmails, setLocalEmails] = useState([]);
  const [emailsListChanged, setEmailsListChanged] = useState(false);

  const [currentEmail, setCurrentEmail] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [saveButtonTooltipTitle, setSaveButtonTooltipTitle] = useState('');

  const maxEmails = 150;

  // Fetch emails from backend
  useEffect(() => {
    if (!currentSchoolID) return;

    fetchDataFromURL({
      url: getApiUrl({
        endpoint: GeneralAPIendpoints.alertsEmails,
        school_id: currentSchoolID
      }),
      extension: 'json',
      needsAuthorization: true
    }).then((data) => {
      setServerEmails(data);
    })
      .catch((error) => {
        enqueueSnackbar("There was an error loading the email list, please try again", {
          variant: SnackbarMetadata.error.name,
          duration: SnackbarMetadata.error.duration
        });
      });
  }, [currentSchoolID]);

  useEffect(() => {
    setLocalEmails(serverEmails);
  }, [serverEmails]);

  useEffect(() => {
    setEmailsListChanged(!compareArrays(localEmails, serverEmails));
  }, [localEmails]);

  useEffect(() => {
    setSaveButtonTooltipTitle(emailsListChanged ? "Click to save new changes on server" : "No changes detected to save");
  }, [emailsListChanged]);

  const handleAddEmail = (passedEmail) => {
    const email = passedEmail.trim().toLowerCase();

    // If email address follows email format
    if (validateEmail(email)) {
      const newEmails = [...localEmails, email];

      // Make sure currentEmail hasn't been added before
      if (localEmails.includes(email)) {
        enqueueSnackbar(`Already added: ${email}`, {
          variant: SnackbarMetadata.error.name,
          duration: SnackbarMetadata.error.duration
        });
        setCurrentEmail('');
        return;
      }

      // Display alert if reached maximum number of email recipients
      if (newEmails.length === maxEmails) {
        enqueueSnackbar('Maximum number of recipients reached', {
          variant: SnackbarMetadata.warning.name,
          duration: SnackbarMetadata.warning.duration
        });
      }

      setLocalEmails(newEmails);
      setCurrentEmail('');
    } else {
      enqueueSnackbar('Invalid email address. Valid format: abc@def.xyz', {
        variant: SnackbarMetadata.error.name,
        duration: SnackbarMetadata.error.duration
      });
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
      enqueueSnackbar('Email list saved successfully!', {
        variant: SnackbarMetadata.success.name,
        duration: SnackbarMetadata.success.duration
      });
    }).catch(() => {
      enqueueSnackbar('There was an error saving the email. Please try again.', {
        variant: SnackbarMetadata.error.name,
        duration: SnackbarMetadata.error.duration
      });
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
        <Grid
          item
          xs={12}
          lg
          sx={{
            overflowY: "scroll",
            maxHeight: "300px"
          }}
        >
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
                <Grid item xs={12} sm minWidth="200px" >
                  <TextField
                    fullWidth
                    variant="standard"
                    value={currentEmail}
                    onChange={(e) => {
                      const tmp = e.target.value;
                      setCurrentEmail(tmp);
                      if (tmp !== '') {
                        setSaveButtonTooltipTitle("Finalize currently edited email by pressing Enter/Return")
                      }
                    }}
                    onKeyUp={(e) => {
                      if (['Enter', 'Spacebar', ' '].includes(e.key)) {
                        handleAddEmail(currentEmail);
                      }
                    }}
                    onPaste={handlePaste}
                    placeholder="Add recipient"
                    sx={{
                      mx: 0.5
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

      <Stack sx={{ mt: 1 }} spacing={1} alignItems={smallScreen ? "stretch" : "end"}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            textAlign="right"
          >
            {localEmails.length} / {maxEmails} recipient{localEmails.length > 1 ? 's' : null} added
          </Typography>

          <Link
            variant="caption"
            sx={{
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.preventDefault();
              setCurrentEmail('');
              setLocalEmails([])
            }}
          >
            Clear All
          </Link>
        </Stack>


        {
          serverEmails.length === 0 ?
            (
              <Alert
                severity='error'
                sx={{
                  mt: 1
                }}>
                The alert(s) above will not be sent unless at least one email recipient is saved
              </Alert>
            ) : null
        }

        <Tooltip title={saveButtonTooltipTitle} enterTouchDelay={0}>
          {/* Span is needed to display Tooltip on a disabled Button */}
          <span>
            <Button
              onClick={handleSaveEmails}
              variant="contained"
              sx={{ width: smallScreen ? "100%" : "fit-content" }}
              disabled={!emailsListChanged}
            >
              SAVE EMAIL LIST
            </Button>
          </span>
        </Tooltip>

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
