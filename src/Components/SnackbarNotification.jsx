import { React, useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material/';
import { useNotificationContext } from '../ContextProviders/NotificationContext';

const SnackbarNotification = () => {
  const { showNotification, setShowNotification, message, severity } = useNotificationContext();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    setShowNotification(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      onClick={handleClose}
    >
      <Close color="secondary" fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      size="small"
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={showNotification}
      onClose={handleClose}
      autoHideDuration={10000} // 10 seconds
      action={action}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarNotification;

// export function DeviceOrientationNotification() {
//   // Default is to hide the notification
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(orientation: portrait)');

//     // If the device orientation is portrait --> show the notification, and vice versa
//     const handleOrientationChange = (e) => {
//       if (e.matches) {
//         setOpen(true);
//       } else {
//         setOpen(false);
//       }
//     };

//     handleOrientationChange(mediaQuery);

//     mediaQuery.addEventListener('change', handleOrientationChange);

//     return () => {
//       mediaQuery.removeEventListener('change', handleOrientationChange);
//     };
//   }, []);

//   const handleClose = (event, reason) => {
//     // If the user click away from the notification, don't close it
//     // Only close when clicking on the X button
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpen(false);
//   };

//   return (
//     <SimpleSnackBar
//       message="Best experienced on computers/landscape"
//       open={open}
//       handleClose={handleClose}
//       autoHideDuration={10000}
//     />
//   );
// }
