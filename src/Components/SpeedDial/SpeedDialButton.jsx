import { Fab, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { scrollToSection } from '../Header/MenuItemAsNavLink';
import * as Tracking from '../../Utils/Tracking';
import FadeInButtonForSpeedDial from './FadeInButtonForSpeedDial';

export default function SpeedDialButton({ topAnchorID, ...props }) {
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
}
