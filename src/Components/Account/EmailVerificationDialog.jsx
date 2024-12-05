import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export default function EmailVerificationDialog({ open, onClose, email }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Your Email</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Thank you for signing up! We’ve sent a verification link to{" "}
          <b>{email}</b>. Please check your inbox and click on the link to
          activate your account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
