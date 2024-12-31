import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function EmailVerificationDialog({ open, onClose, email }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Your Email</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Thank you for signing up!
          We sent a verification link to <b>{email}</b>.
          Please check your inbox and click on the link to activate your account.
          <br />
          <br />
          <small><i>*Refresh this page if you have clicked on the verification on a different browser.</i></small>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
