import { useContext, useEffect, useRef, useState } from 'react';
import { Box, TextField, Chip, Menu, MenuItem, Grid, Typography, Button, Stack, useMediaQuery, Alert, Tooltip, Link, CircularProgress } from '@mui/material';
import { fetchDataFromURL } from "../../../API/ApiFetch";
import { RESTmethods } from "../../../API/Utils";
import { getApiUrl } from '../../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../../API/Utils";
import { DashboardContext } from '../../../ContextProviders/DashboardContext';
import { isValidArray } from '../../../Utils/UtilFunctions';
import { SnackbarMetadata } from '../../../Utils/SnackbarMetadata';
import { validateEmail } from '../../../Utils/UtilFunctions';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const compareArrays = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const EmailsInput = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { currentSchoolID } = useContext(DashboardContext);
  const { data: alertEmails = [] } = useQuery({
    queryKey: [GeneralAPIendpoints.alertsEmails, currentSchoolID],
    queryFn: async () => {
      const url = getApiUrl({
        endpoint: GeneralAPIendpoints.alertsEmails,
        school_id: currentSchoolID
      });
      return fetchDataFromURL({
        url,
        extension: 'json',
        needsAuthorization: true
      });
    },
    enabled: !!currentSchoolID,
    staleTime: 0
  });

  const queryClient = useQueryClient();
  const saveEmailsMutation = useMutation({
    mutationFn: async (emailsToSave) => {
      const url = getApiUrl({
        endpoint: GeneralAPIendpoints.alertsEmails,
        school_id: currentSchoolID
      });
      return fetchDataFromURL({
        url,
        restMethod: RESTmethods.POST,
        body: emailsToSave
      });
    },
    onSuccess: (data) => {
      // Update cache immediately so UI updates without refetch
      queryClient.setQueryData([GeneralAPIendpoints.alertsEmails, currentSchoolID], data);
      enqueueSnackbar('Email recipients saved successfully.', SnackbarMetadata.success);
    },
    onError: () => {
      enqueueSnackbar('There was an error saving email recipients. Please try again.', SnackbarMetadata.error);
    }
  });

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [localEmails, setLocalEmails] = useState([]);
  const [emailsListChanged, setEmailsListChanged] = useState(false);

  const [currentEmail, setCurrentEmail] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [saveButtonTooltipTitle, setSaveButtonTooltipTitle] = useState('');

  const maxEmails = 150;

  useEffect(() => {
    setLocalEmails(alertEmails);
  }, [alertEmails]);

  useEffect(() => {
    setEmailsListChanged(!compareArrays(localEmails, alertEmails));
  }, [localEmails, alertEmails]);

  useEffect(() => {
    setSaveButtonTooltipTitle(emailsListChanged ? "Click to save new changes on server" : "No changes detected to save");
  }, [emailsListChanged]);

  const handleAddEmail = (passedEmail, isBulkAdding = false) => {
    let email = passedEmail.trim().toLowerCase();

    // Strip <> if present
    if (email.startsWith('<') && email.endsWith('>')) {
      email = email.slice(1, -1).trim();
    }

    // Skip if email is empty
    if (!email) return;

    // If email is invalid
    if (!validateEmail(email)) {
      if (!isBulkAdding) enqueueSnackbar(`Invalid email address: ${email}`, SnackbarMetadata.error);
      return;
    }

    // Skip if email already exists
    if (localEmails.includes(email)) {
      enqueueSnackbar(isBulkAdding ? `Some pasted email addresses already existed` : `Already existed: ${email}`, SnackbarMetadata.error);
      return;
    }

    // Add email if max not reached
    if (localEmails.length >= maxEmails) {
      enqueueSnackbar('Maximum number of recipients reached', SnackbarMetadata.warning);
      return;
    }

    setLocalEmails(prev => [...prev, email]);
    setCurrentEmail('');
  };

  const handleDeleteEmail = (index) => {
    const newEmails = localEmails.filter((_, i) => i !== index);
    setLocalEmails(newEmails);
  };

  const handleEditEmail = (index) => {
    setCurrentEmail(localEmails[index]);
    handleDeleteEmail(index);
  };

  const handleCopyEmail = (index) => {
    const emailToCopy = localEmails[index];
    if (!emailToCopy) return;

    navigator.clipboard.writeText(emailToCopy)
      .then(() => {
        enqueueSnackbar(`Copied to clipboard: ${emailToCopy}`, SnackbarMetadata.success);
      })
      .catch(() => {
        enqueueSnackbar('Failed to copy email to clipboard.', SnackbarMetadata.error);
      });
  };

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const prevInputRef = useRef('');
  const [allSelected, setAllSelected] = useState(false);

  // Document-level keyboard handler
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!e?.key) return;

      const key = e.key.toLowerCase();
      const isMeta = e.metaKey || e.ctrlKey;
      const active = document.activeElement;
      const isInputFocused = active === inputRef.current;

      // 1️⃣ Select All (Cmd/Ctrl + A)
      if (isMeta && key === 'a') {
        // only when input is empty
        if (isInputFocused && currentEmail.trim() === '') {
          e.preventDefault();
          setAllSelected(true);

          // move focus to wrapper for subsequent keys
          if (wrapperRef.current) wrapperRef.current.focus({ preventScroll: true });
        }
        return;
      }

      // 2️⃣ Copy (Cmd/Ctrl + C)
      if (isMeta && key === 'c' && allSelected) {
        e.preventDefault();
        if (localEmails.length === 0) {
          enqueueSnackbar('No emails to copy.', SnackbarMetadata.warning);
          return;
        }

        navigator.clipboard.writeText(localEmails.join(', '))
          .then(() => enqueueSnackbar('All emails copied to clipboard.', SnackbarMetadata.success))
          .catch(() => enqueueSnackbar('Failed to copy emails.', SnackbarMetadata.error));
        return;
      }

      // 3️⃣ Delete all (Backspace or Delete)
      if (allSelected && (key === 'backspace' || key === 'delete')) {
        e.preventDefault();
        if (localEmails.length === 0) return;

        setLocalEmails([]);
        setAllSelected(false);
        enqueueSnackbar('All emails deleted.', SnackbarMetadata.info);
        return;
      }

      // 4️⃣ Escape clears selection
      if (key === 'escape' && allSelected) {
        e.preventDefault();
        setAllSelected(false);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentEmail, allSelected, localEmails, enqueueSnackbar]);


  // Clear selection on click outside of wrapper (or any click that isn't selecting)
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!wrapperRef.current) return;

      // if click is inside wrapper, do nothing (we keep selection)
      if (wrapperRef.current.contains(e.target)) return;

      // clicking outside clears selection
      if (allSelected) setAllSelected(false);
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [allSelected]);

  // Optional: clear selection when editing or adding a new email
  useEffect(() => {
    if (currentEmail !== '' && allSelected) {
      setAllSelected(false);
    }
  }, [currentEmail, allSelected]);

  const handleMenuOpen = (event, index) => {
    setMenuAnchor({ index, element: event.currentTarget });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handlePaste = (event) => {
    const pastedText = event.clipboardData.getData('text');
    event.preventDefault();

    const emails = pastedText
      .split(/[\s,;\t]+/) // splits on comma, semicolon, any whitespace, or tab
      .map(email => email.trim())
      .filter(email => email !== '');

    emails.forEach(email => handleAddEmail(email, emails.length > 1));
    setCurrentEmail(''); // clear input after pasting
  };

  const handleSaveEmails = (_emails) => {
    const emailsToSave = isValidArray(_emails) ? _emails : (isValidArray(localEmails) ? localEmails : []);
    saveEmailsMutation.mutate(emailsToSave);
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!compareArrays(localEmails, alertEmails)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [localEmails, alertEmails]);

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
            ref={wrapperRef}
            id="emails-container"
            tabIndex={-1} // focusable programmatically
            container
            alignItems="center"
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: 2,
              p: 0.5,
              flexWrap: 'wrap',
              width: '100%',
              outline: 'none'
            }}
          >
            {localEmails.map((email, index) => (
              <Grid item key={index} sx={{ m: 0.5 }}>
                <Chip
                  label={email}
                  onDelete={() => handleDeleteEmail(index)}
                  onClick={(event) => handleMenuOpen(event, index)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleMenuOpen(event, index)
                  }}
                  color={allSelected || (Boolean(menuAnchor) && menuAnchor.index === index) ? "primary" : "default"}
                />
              </Grid>
            ))}

            {
              localEmails.length < maxEmails ? (
                <Grid item xs={12} sm minWidth="200px" >
                  <TextField
                    inputRef={inputRef}
                    fullWidth
                    variant="standard"
                    value={currentEmail}
                    onChange={(e) => {
                      const tmp = e.target.value;
                      const native = e.nativeEvent || {};
                      const inputType = (native.inputType || '').toString();
                      const isComposing = !!native.isComposing || !!e.isComposing;

                      setCurrentEmail(tmp);
                      if (tmp !== '') {
                        setSaveButtonTooltipTitle("Finalize currently edited email by pressing Enter/Return");
                      }

                      if (isComposing) {
                        prevInputRef.current = tmp;
                        return;
                      }

                      const maybeEmail = tmp.trim();

                      // Only trigger on autofill-like updates, paste, or other non-manual input
                      const autofillLike = /insertReplacementText|insertFromPaste|insertFromDrop|insertFromAutocomplete/i.test(inputType);
                      const jumpedIn = prevInputRef.current === '' && tmp.length > 1 && inputType !== 'insertText';

                      if (validateEmail(maybeEmail) && (autofillLike || jumpedIn)) {
                        // Let autofill finish internal update before adding
                        setTimeout(() => handleAddEmail(tmp), 0);
                      }

                      prevInputRef.current = tmp;
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
          alertEmails.length === 0 ?
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
              disabled={!emailsListChanged || saveEmailsMutation.isPending}
            >
              {saveEmailsMutation.isPending ? <CircularProgress disableShrink color="inherit" size="1.5rem" /> : "SAVE EMAIL LIST"}
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

        <MenuItem
          onClick={() => {
            handleCopyEmail(menuAnchor.index);
            handleMenuClose();
          }}
        >
          Copy
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmailsInput;
