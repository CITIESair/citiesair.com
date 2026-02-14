import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { scrollToSection } from '../Header/MenuItemAsNavLink';
import * as Tracking from '../../Utils/Tracking';
import FadeInButtonForSpeedDial from './FadeInButtonForSpeedDial';

interface SpeedDialButtonProps {
  topAnchorID?: string;
  inProp?: boolean;
  window?: Window;
  distanceFromBottomOfWindow?: number | string;
  triggerThreshold?: number;
}

const SpeedDialButton: React.FC<SpeedDialButtonProps> = ({ topAnchorID, ...props }) => {
  return (
    <FadeInButtonForSpeedDial {...props} distanceFromBottomOfWindow="1rem">
      <Tooltip title="Scroll to Top" enterDelay={0} leaveDelay={200}>
        <Fab
          onClick={() => {
            if (topAnchorID) {
              scrollToSection(topAnchorID);
            }
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: topAnchorID,
                origin_id: 'speed-dial',
              }
            );
          }}
          sx={{ mt: 1 }}
          aria-label="scroll to top"
          color="primary"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>
    </FadeInButtonForSpeedDial>
  );
};

export default SpeedDialButton;
