import { Box, useScrollTrigger, Fade } from '@mui/material';
import { ReactNode } from 'react';

export const { innerHeight } = window;

interface FadeInButtonForSpeedDialProps {
  children: ReactNode;
  window?: Window;
  distanceFromBottomOfWindow: number | string;
  triggerThreshold?: number;
}

export function FadeInButtonForSpeedDial(props: FadeInButtonForSpeedDialProps) {
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
          zIndex: 1
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default FadeInButtonForSpeedDial;