import SpeedIcon from '@mui/icons-material/Speed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const AlertTypes = {
  threshold: {
    id: "threshold",
    index: 0,
    name: "Threshold",
    tableColumnHeader: "Threshold",
    icon: <SpeedIcon />
  },
  daily: {
    id: "daily",
    index: 1,
    name: "Daily",
    tableColumnHeader: "Alert Hour",
    icon: <CalendarMonthIcon />
  }
};

export const ThresholdAlertTypes = {
  below_threshold: {
    id: 'below_threshold',
    sign: "<",
    name: "below"
  },
  above_threshold: {
    id: 'above_threshold',
    sign: "≥",
    name: "exceed"
  }
}

export default AlertTypes;