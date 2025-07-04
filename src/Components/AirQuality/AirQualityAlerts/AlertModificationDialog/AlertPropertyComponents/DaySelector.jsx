import { Box, Grid, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DAYS_OF_WEEK } from './DAYS_OF_WEEK';
import { AirQualityAlertKeys, getAlertDefaultPlaceholder } from '../../../../../ContextProviders/AirQualityAlertContext';
import { useTheme } from '@mui/material';
import MultiDaysCalendarPicker from './MultiDaysCalendarPicker';

export default function DateSelector(props) {
  const { daysOfWeek, excludedDates, handleDaysOfWeekChange, handleExcludedDatesChange, disabled } = props;
  const theme = useTheme();

  return (
    <Grid
      container
      rowSpacing={0.5}
      columnSpacing={2}
      alignItems="center"
      justifyContent="stretch"
    >
      <Grid item xs={12} md={6}>
        <Stack
          direction="row"
          gap={1}
          alignItems="start"
        >
          <Box
            aria-hidden
            sx={{
              '& .MuiSvgIcon-root': {
                color: disabled
                  ? theme.palette.text.secondary
                  : theme.palette.primary.main,
                verticalAlign: "middle"
              }
            }}
          >
            <CalendarMonthIcon sx={{ mt: 0.75 }} />
          </Box>

          <ToggleButtonGroup
            value={daysOfWeek || getAlertDefaultPlaceholder()[AirQualityAlertKeys.days_of_week]}
            onChange={handleDaysOfWeekChange}
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
      </Grid>

      <Grid item xs={12} md={6} ml={{ xs: 3, sm: 0 }}>
        <MultiDaysCalendarPicker
          selectedDates={excludedDates}
          disabled={disabled}
          handleChange={handleExcludedDatesChange}
        />
      </Grid>
    </Grid>

  );
}
