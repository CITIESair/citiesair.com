import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';

export default function AlertDeletionDialog(props) {
  const { onConfirmedDelete } = props;

  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Button
        variant="text"
        color="error"
        onClick={() => {
          setOpen(true)
        }}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-deletion-confirmation-dialog-title"
        aria-describedby="alert-deletion-confirmation-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle id="alert-deletion-confirmation-dialog-title">
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-deletion-confirmation-dialog-description">
            Deletion is permanent. If you simply wish to pause this alert, disable it with the toggle switch instead.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "end" }}>
          <Button
            onClick={() => {
              setOpen(false)
            }}
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              onConfirmedDelete();
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}