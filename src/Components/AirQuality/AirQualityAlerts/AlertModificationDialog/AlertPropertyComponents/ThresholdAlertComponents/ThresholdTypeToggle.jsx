import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ThresholdAlertTypes } from '../../../AlertTypes';

export const ThresholdTypeToggle = ({ currentAlertType, handleChange, disabled, ...others }) => {
  return (
    <ToggleButtonGroup
      color={disabled ? "standard" : "primary"}
      disabled={disabled}
      defaultValue={ThresholdAlertTypes.above_threshold.id}
      value={currentAlertType}
      exclusive
      aria-label="toggle to choose alert below or above a threshold"
      size="small"
      onChange={handleChange}
      {...others}
    >
      {Object.keys(ThresholdAlertTypes).map((key) => {
        const thresholdAlertType = ThresholdAlertTypes[key];

        return (
          <ToggleButton
            key={thresholdAlertType.id}
            size="small"
            sx={{
              textTransform: "capitalize !important",
              px: 1.25
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

export const ThresholdType = ({ currentAlertType, ...others }) => {

  return (
    <ToggleButtonGroup
      color={"standard"}
      disabled={true}
      defaultValue={ThresholdAlertTypes.below_threshold.id}
      value={currentAlertType}
      exclusive
      aria-label="non-interactive button displaying threshold type"
      size="small"
      {...others}
    >
      {Object.keys(ThresholdAlertTypes).map((key) => {
        const thresholdAlertType = ThresholdAlertTypes[key];
        if (thresholdAlertType.id !== currentAlertType) return null;

        return (
          <ToggleButton
            key={thresholdAlertType.id}
            size="small"
            sx={{
              textTransform: "capitalize !important",
              px: 1.25
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
}
