import { Dialog, DialogActions, DialogContent, Typography, Button, Chip, Checkbox, FormGroup, FormControlLabel, Box } from "@mui/material";
import { useContext, useState } from "react";
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import { LocalStorage } from "../../Utils/LocalStorage";

const PromoDialog = ({ title, subtitle, imgSrc, imgAlt, chipLabel }) => {
  const { showPromoDialogPreference, setShowPromoDialogPreference } = useContext(PreferenceContext);
  const [open, setOpen] = useState(showPromoDialogPreference);

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;

    setOpen(false);
    setShowPromoDialogPreference(false);
    localStorage.setItem(LocalStorage.showPromoDialog, false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      keepMounted
    >
      <DialogContent sx={{
        px: 3
      }}>
        <Chip size="small" label={chipLabel} color="info" sx={{ mb: 2 }} />

        <Typography variant="h5" fontWeight="500" color="text.primary" gutterBottom>{title}</Typography>
        <Typography variant="body1" component="div" color="text.secondary">{subtitle}</Typography>

        <Box sx={{ m: 1, mt: 2 }}>
          <img
            src={imgSrc}
            alt={imgAlt}
            width="100%"
          />
        </Box>

      </DialogContent>

      <DialogActions sx={{ justifyContent: "start" }}>
        <Button sx={{ marginLeft: "auto" }} onClick={handleClose}>
          CLOSE AND DON'T SHOW THIS BANNER AGAIN
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PromoDialog;