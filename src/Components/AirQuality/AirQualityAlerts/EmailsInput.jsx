import React, { useEffect, useState } from 'react';
import { Box, TextField, Chip, Menu, MenuItem, Snackbar, Alert, Grid, Typography, Button, Stack, useMediaQuery } from '@mui/material';

const EmailsInput = (props) => {
  const { schoolContactEmail } = props;

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState(null);

  const maxEmails = 10;
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // If no email recipient has been added before, add the admin email as the default one first
  useEffect(() => {
    if (emails.length === 0 && schoolContactEmail) {
      setEmails([schoolContactEmail]);
    }
  }, [schoolContactEmail, emails.length]);

  const handleAddEmail = (passedEmail) => {
    const email = passedEmail.toLowerCase();

    // If email address follows email format
    if (validateEmail(email)) {
      const newEmails = [...emails, email];

      // Make sure currentEmail hasn't been added before
      if (emails.includes(email)) {
        setAlertMessage(`Already added: ${email}`);
        setAlertSeverity('error');
        setAlertOpen(true);

        setCurrentEmail('');
        return;
      }

      // Display alert if reached maximum number of email recipients
      if (newEmails.length === maxEmails) {
        setAlertMessage('Maximum number of recipients reached');
        setAlertSeverity('warning');
        setAlertOpen(true);
      }

      setEmails(newEmails);
      setCurrentEmail('');
    } else {
      setAlertMessage('Invalid email address. Valid format: abc@def.xyz');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDeleteEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleEditEmail = (index) => {
    setCurrentEmail(emails[index]);
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

  const saveEmails = () => {
    return;
  }

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
            {emails.map((email, index) => {
              // Do not allow actions (click / delete) if the Chip is the first one (mandatory 1 email recipient, aka admin)
              const allowActions = index !== 0;

              return (
                <Grid item key={index} sx={{ m: 0.5 }}>
                  <Chip
                    label={email}
                    onDelete={allowActions ? () => handleDeleteEmail(index) : undefined}
                    onClick={allowActions ? (event) => handleMenuOpen(event, index) : undefined}
                  />
                </Grid>
              );
            })}
            {
              emails.length < maxEmails ? (
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
          {emails.length} / {maxEmails} recipient{emails.length > 1 ? 's' : null} added
        </Typography>

        <Button
          onClick={saveEmails}
          variant="contained"
          sx={{ width: smallScreen ? "100%" : "fit-content" }}
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
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailsInput;
