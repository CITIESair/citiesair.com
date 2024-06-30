import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ThresholdAlertTypes } from '../AlertTypes';

export const ThresholdTypeToggle = ({ thisAlertType, handleChange, disabled }) => {
  return (
    <ToggleButtonGroup
      color={disabled ? "standard" : "primary"}
      defaultValue={ThresholdAlertTypes.above_threshold.id}
      value={thisAlertType}
      exclusive
      aria-label="toggle to choose alert below or above a threshold"
      size="small"
      onChange={handleChange}
    >
      {Object.keys(ThresholdAlertTypes).map((key) => {
        const thresholdAlertType = ThresholdAlertTypes[key];

        return (
          <ToggleButton
            key={thresholdAlertType.id}
            size="small"
            sx={{
              textTransform: "capitalize !important",
              px: 1.25,
              py: 0.5
            }}
            value={thresholdAlertType.id}
            aria-label={thresholdAlertType.id}
          >
            {thresholdAlertType.sign}&nbsp;{thresholdAlertType.name}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};
