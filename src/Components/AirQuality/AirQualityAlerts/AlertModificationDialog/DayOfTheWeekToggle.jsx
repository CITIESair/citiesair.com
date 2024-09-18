import { useState } from 'react';
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', shortLabel: 'Mo' },
  { value: 2, label: 'Tuesday', shortLabel: 'Tu' },
  { value: 3, label: 'Wednesday', shortLabel: 'We' },
  { value: 4, label: 'Thursday', shortLabel: 'Th' },
  { value: 5, label: 'Friday', shortLabel: 'Fr' },
  { value: 6, label: 'Saturday', shortLabel: 'Sa' },
  { value: 7, label: 'Sunday', shortLabel: 'Su' }
];

// Custom styled ToggleButton to make it circular and add spacing
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: '50%', // Makes it circular
  width: '50px',       // Adjust width to make it a circle
  height: '50px',      // Adjust height to match width
  margin: theme.spacing(1), // Adds some space between buttons
  textTransform: 'none', // Disable default uppercasing of text
}));

export default function DaysOfWeekToggle() {
  const [selectedDays, setSelectedDays] = useState(() => [0, 1]);

  const handleDayChange = (_, newDays) => {
    setSelectedDays(newDays);
  };

  return (
    <Stack direction="row">
      <CalendarMonthIcon />
      <ToggleButtonGroup
        value={selectedDays}
        onChange={handleDayChange}
        aria-label="days of the week"
        sx={{ display: 'flex', justifyContent: 'center' }} // Center the buttons horizontally
      >
        {DAYS_OF_WEEK.map((day) => (
          <Tooltip key={day.value} title={day.label} arrow>
            <StyledToggleButton value={day.value} aria-label={day.label}>
              {day.shortLabel}
            </StyledToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </Stack>

  );
}
