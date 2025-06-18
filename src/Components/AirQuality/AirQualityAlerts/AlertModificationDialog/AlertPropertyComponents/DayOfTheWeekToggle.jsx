import { Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DAYS_OF_WEEK } from './DAYS_OF_WEEK';

export default function DaysOfWeekToggle(props) {
  const { value, handleChange, disabled } = props;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <CalendarMonthIcon />
      <ToggleButtonGroup
        value={value || [0, 1, 2, 3, 4]}
        onChange={handleChange}
        aria-label="days of the week to receive alert"
        sx={{ display: 'flex', justifyContent: 'center' }} // Center the buttons horizontally
        size="small"
        fullWidth
        disabled={disabled}
        color={disabled ? "standard" : "primary"}
      >
        {DAYS_OF_WEEK.map((day) => (
          <Tooltip key={day.value} title={day.label} arrow>
            <ToggleButton value={day.value} aria-label={day.label} sx={{ textTransform: 'none' }}>
              {day.label.slice(0, 3)}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </Stack>

  );
}
