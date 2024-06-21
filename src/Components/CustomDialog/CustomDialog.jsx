import { useState, useContext } from 'react';
import { Typography, Chip, Dialog, Button, DialogActions, DialogContent, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Tracking from '../../Utils/Tracking';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DashboardContext } from '../../ContextProviders/DashboardContext';

export default function CustomDialog(props) {
  const {
    buttonIcon,
    buttonLabel,
    trackingEvent,
    dialogTitle,
    dialogOpenHandler = null,
    dialogCloseHandler = null,
    children
  } = props;

  const { currentSchoolID } = useContext(DashboardContext);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
    Tracking.sendEventAnalytics(trackingEvent);
    if (dialogOpenHandler) dialogOpenHandler();
  }

  const onClose = () => {
    setOpen(false);
    if (dialogCloseHandler) dialogCloseHandler();
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="contained"
      >
        {buttonIcon}&nbsp;{buttonLabel}
      </Button>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={smallScreen}
        keepMounted
        zIndex={10000}
      >
        {(
          smallScreen &&
          <DialogActions sx={{ justifyContent: "start" }}>
            <Button onClick={onClose}>
              <ChevronLeftIcon sx={{ fontSize: '1rem' }} />Back
            </Button>
          </DialogActions>
        )}

        <DialogContent sx={{
          px: smallScreen ? 2 : 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start'
        }}>
          <Chip label={currentSchoolID ? `School: ${currentSchoolID.toUpperCase()}` : "No School"} size="small" sx={{ mb: 1 }} />
          <Typography variant="h6" zIndex="10000" sx={{ mb: 1 }}>
            {dialogTitle}
          </Typography>

          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
