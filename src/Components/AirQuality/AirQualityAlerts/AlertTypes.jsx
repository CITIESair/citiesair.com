import SpeedIcon from '@mui/icons-material/Speed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const AlertTypes = {
  threshold: {
    id: "threshold",
    index: 0,
    name: "Threshold Alerts",
    tableColumnHeader: "Threshold",
    icon: <SpeedIcon />
  },
  daily: {
    id: "daily",
    index: 1,
    name: "Daily Alerts",
    tableColumnHeader: "Alert Hour",
    icon: <CalendarMonthIcon />
  }
};

export const ThresholdAlertTypes = {
  below_threshold: {
    id: 'below_threshold',
    sign: "<",
    label: "< Below"
  },
  above_threshold: {
    id: 'above_threshold',
    sign: ">",
    label: "> Above"
  }
}

export default AlertTypes;