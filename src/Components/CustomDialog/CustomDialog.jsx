import React, { useState, useContext } from 'react';
import { Chip, Tooltip, IconButton, Dialog, Button, DialogActions, DialogTitle, DialogContent, useMediaQuery } from '@mui/material';
import * as Tracking from '../../Utils/Tracking';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { useTheme } from '@emotion/react';

const CustomDialog = (props) => {
  const {
    buttonIcon,
    buttonIconAria,
    buttonLabel,
    trackingEvent,
    dialogTitle,
    dialogOpenHandler = null,
    dialogCloseHandler = null,
    displaySchoolID = true,
    maxWidth = "lg",
    children
  } = props;

  let iconOnly;
  if (buttonIcon && !buttonLabel) iconOnly = true;
  else iconOnly = false;

  const { currentSchoolID } = useContext(DashboardContext);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
    if (trackingEvent) Tracking.sendEventAnalytics(trackingEvent);
    if (dialogOpenHandler) dialogOpenHandler();
  }

  const onClose = () => {
    setOpen(false);
    if (dialogCloseHandler) dialogCloseHandler();
  }

  const theme = useTheme();

  const displayButton = () => {
    if (iconOnly) return (
      <Tooltip title={buttonIconAria}>
        <IconButton
          onClick={onOpen}
          aria-label={buttonIconAria}
          size="small"
          sx={{ "&:hover,:focus": { color: theme.palette.primary.main } }}
        >
          {buttonIcon}
        </IconButton>
      </Tooltip>
    );

    else return (
      <Button
        onClick={onOpen}
        variant="contained"
      >
        {buttonIcon}&nbsp;{buttonLabel}
      </Button>
    )
  }

  return (
    <>
      {displayButton()}

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        fullScreen={smallScreen}
        keepMounted
        sx={{
          zIndex: 10000
        }}
      >
        {(
          smallScreen &&
          <DialogActions sx={{ justifyContent: "start" }}>
            <Button onClick={onClose}>
              <ChevronLeftIcon sx={{ fontSize: '1rem' }} />Back
            </Button>
          </DialogActions>
        )}

        <DialogTitle>
          {displaySchoolID &&
            (<>
              <Chip
                label={currentSchoolID ? `School: ${currentSchoolID.toUpperCase()}` : "No School"}
                size="small"
                display="block"
                sx={{ mb: 1 }}
              />
              <br />
            </>
            )}

          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'stretch',
          alignItems: 'start'
        }}>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomDialog;
