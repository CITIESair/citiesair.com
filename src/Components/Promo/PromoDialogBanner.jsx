import { Dialog, DialogActions, DialogContent, Typography, Button, Chip, Box, Stack, Divider, Paper, Grid } from "@mui/material";
import { useContext, useState } from "react";
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import { LocalStorage } from "../../Utils/LocalStorage";
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';

const PromoDialogBanner = ({ promosForBanner }) => {
  const { showPromoDialogPreference, setShowPromoDialogPreference } = useContext(PreferenceContext);
  const [open, setOpen] = useState(showPromoDialogPreference);

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;

    setOpen(false);
    setShowPromoDialogPreference(false);
    localStorage.setItem(LocalStorage.showPromoDialog, false);
  }

  const Content = ({ title, subtitle, img }) => {
    const { width, src, atl } = img || {};

    return (
      <Box>
        <Typography variant="h5" fontWeight="500" color="text.primary" gutterBottom>
          {title ? parse(title, {
            replace: replacePlainHTMLWithMuiComponents,
          }) : ''}
        </Typography>

        <Typography variant="body1" component="div" color="text.secondary">
          {subtitle ? parse(subtitle, {
            replace: replacePlainHTMLWithMuiComponents,
          }) : ''}
        </Typography>

        {img.src && img.src !== '' && (
          <Grid container justifyContent="center">
            <Grid item xs={11}>
              <Paper
                elevation={3}
                sx={{
                  my: 1,
                  p: 1,
                  width: width,
                  minWidth: '400px',
                  mx: 'auto',
                }}
              >
                <img
                  src={src}
                  alt={atl}
                  width="100%"
                />
              </Paper>
            </Grid>
          </Grid>

        )}
      </Box>
    )
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
        <Chip
          size="small"
          color="info"
          sx={{ mb: 2 }}
          label={
            <b>NEW FEATURE</b>
          }
        />

        <Stack spacing={2} divider={<Divider flexItem />}>
          {promosForBanner.map((promo, index) => {
            const { title, subtitle, img } = promo;
            return (
              <Content
                key={index}
                title={title}
                subtitle={subtitle}
                img={img}
              />
            )
          })}
        </Stack>

      </DialogContent>

      <DialogActions sx={{ justifyContent: "start" }}>
        <Button sx={{ marginLeft: "auto" }} onClick={handleClose}>
          CLOSE AND DON'T SHOW THIS BANNER AGAIN
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PromoDialogBanner;