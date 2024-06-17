import { Dialog, DialogActions, DialogContent, Typography, Button, Chip, Checkbox, FormGroup, FormControlLabel, Box } from "@mui/material";
import { useContext, useState } from "react";
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import { LocalStorage } from "../../Utils/LocalStorage";
import promoGIF from '../../selecting-data-types.gif';

const PromoData = {
  title: "[JUNE 2024 UPDATE]: Visualize Different Data Types",
  subtitle: <>
    CITIESair is excited to announce that you can now <b>visualize all data types</b> provided by the sensors:
    <Box component={"ul"} sx={{ mt: 0.5 }}>
      <li>United States' Air Quality Index (US AQI)</li>
      <li>PM2.5</li>
      <li>PM10</li>
      <li>Volatile Organic Compounds index (VOC)</li>
      <li>Temperature, Humidity, and Pressure</li>
      <li>CO2 (supported sensors)</li>
    </Box>
  </>
}

const PromoDialog = (props) => {
  const { showPromoDialogPreference, setShowPromoDialogPreference } = useContext(PreferenceContext);
  const [open, setOpen] = useState(showPromoDialogPreference);

  const handleClose = () => {
    setOpen(false);
  }

  const handleCheckboxChanged = (event) => {
    const newVal = !event.target.checked; // invert because this is a "Don't show checkbox"
    setShowPromoDialogPreference();
    localStorage.setItem(LocalStorage.showPromoDialog, newVal);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      keepMounted
      zIndex={10000}
    >
      <DialogContent sx={{
        px: 3
      }}>
        <Chip label={<b>NEW FEATURE</b>} color="info" sx={{ mb: 2 }} />

        <Typography variant="h5" fontWeight="500" color="text.primary" gutterBottom>{PromoData.title}</Typography>
        <Typography variant="body1" color="text.secondary">{PromoData.subtitle}</Typography>

        <Box sx={{ m: 1, mt: 2 }}>
          <img
            src={promoGIF}
            alt="GIF of new feature showing the ability to switch between different data types"
            width="100%"
          />
        </Box>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChanged}
              />}
            label="Don't show this banner again"
          />
        </FormGroup>

      </DialogContent>



      <DialogActions sx={{ justifyContent: "start" }}>
        <Button sx={{ marginLeft: "auto" }} onClick={handleClose}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PromoDialog;