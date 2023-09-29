import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import { Fab, Fade, Popper, Paper, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AirIcon from '@mui/icons-material/Air';
import { FadeInButtonForSpeedDial } from './Header/FadeInButtonForSpeedDial';

import * as Tracking from '../Utils/Tracking';
import AirQualityIndexTable from '../Graphs/ChartSubstituteComponents/AirQualityIndexTable';

export default function AirQualityIndexLegendQuickGlance(props) {
  // Mechanism for opening and closing the Quick Glance on hover
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopperOpen = (event) => {
    setAnchorEl(event.currentTarget);
    Tracking.sendEventAnalytics(Tracking.Events.airQualityIndexLegendQuickGlance);
  };
  const handlePopperClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // Air quality index legend
  const theme = useTheme();

  return (
    <>
      <FadeInButtonForSpeedDial {...props} distanceFromBottomOfWindow="5.5rem">
        <Fab
          sx={{ mt: 1 }}
          aria-owns={open ? Tracking.Events.airQualityIndexLegendQuickGlance : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopperOpen}
          onMouseLeave={handlePopperClose}
          onClick={(event) => isMobile && (open ? handlePopperClose() : handlePopperOpen(event))}
          aria-label={Tracking.Events.airQualityIndexLegendQuickGlance}
          color="primary"
        >
          <Stack direction="column" alignItems="center">
            <AirIcon fontSize="1rem" />
            <Typography variant="body2" fontWeight="500">
              AQI
            </Typography>
          </Stack>
        </Fab>
      </FadeInButtonForSpeedDial>

      <Popper
        id={Tracking.Events.airQualityIndexLegendQuickGlance}
        sx={{
          pointerEvents: 'none',
          mt: -1
        }}
        open={open}
        anchorEl={anchorEl}
        placement="top-end"
        onClose={handlePopperClose}
        keepMounted
        disableRestoreFocus
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={8} sx={{ py: 0.5, mb: 1 }}>
              <Typography sx={{ mx: 2, mt: 1 }} color="text.disabled" variant="body1" fontWeight={500}>
                AQI at quick glance
              </Typography>
              <AirQualityIndexTable isTiny hideAQIDescription />
            </Paper>
          </Fade>
        )}

      </Popper>
    </>
  );
}
