import { Box, useScrollTrigger, Fade } from '@mui/material';

export const { innerHeight } = window;

export function FadeInButtonForSpeedDial(props) {
  const { children, window, distanceFromBottomOfWindow, triggerThreshold } = props;

  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: innerHeight * (triggerThreshold || 0.5),
  });

  return (
    <Fade in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: distanceFromBottomOfWindow,
          left: 'calc(100vw - 5rem)',
          zIndex: 999
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}
