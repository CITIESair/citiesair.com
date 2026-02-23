import { useState, FC, SyntheticEvent } from 'react';
import { Dialog, DialogActions, DialogContent, Typography, Button, Chip, Box, Stack, Divider, Paper, Grid } from "@mui/material";
import { LocalStorage } from "../../Utils/LocalStorage";
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';
import { usePreferences } from '../../ContextProviders/PreferenceContext';
import type { Promo } from '../../types/SectionData';

const PromoDialogBanner: FC<{ promosForBanner: Promo[] }> = ({ promosForBanner }) => {
  const { hiddenPromos, setHiddenPromos } = usePreferences();
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason && reason === "backdropClick") return;

    setOpen(false);

    const existingHiddenPromos = hiddenPromos || [];
    const newHiddenPromos = [...new Set([...existingHiddenPromos, ...promosForBanner.map((promo) => promo.id)])];
    setHiddenPromos(newHiddenPromos);
    localStorage.setItem(LocalStorage.hiddenPromos, JSON.stringify(newHiddenPromos));
  }

  const Content: FC<{ banner: Promo["banner"] }> = ({ banner }) => {
    const { title, subtitle, img } = banner;
    const { width, src, alt } = img;

    return (
      <Box>
        <Typography variant="h5" fontWeight="500" color="text.primary" gutterBottom>
          {parse(title, {
            replace: replacePlainHTMLWithMuiComponents,
          })}
        </Typography>

        <Typography variant="body1" component="div" color="text.secondary">
          {parse(subtitle, {
            replace: replacePlainHTMLWithMuiComponents,
          })}
        </Typography>

        {src !== '' && (
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
                  alt={alt}
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
          {promosForBanner.map((promo) => (
            <Content key={promo.id} banner={promo.banner} />
          ))}
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
