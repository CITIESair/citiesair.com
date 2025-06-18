import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import EventBusyIcon from '@mui/icons-material/EventBusy';
import { Link, Typography } from '@mui/material';
import ExpandableSection from '../../../../ExpandableSection/ExpandableSection';

// Custom styling for the selected days
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "selected"
})(({ theme, selected }) => ({
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark
    },
    borderRadius: "50%",
  })
}));

// Custom day component that highlights the selected dates
const CustomDayComponent = (props) => {
  const { day, selectedDates, ...other } = props;

  // Check if the day is selected
  const isSelected = selectedDates.includes(dayjs(day).format('YYYY-MM-DD'));

  return (
    <CustomPickersDay {...other} day={day} selected={isSelected} />
  )
}

export default function MultiDaysCalendarPicker(props) {
  const { selectedDates, handleChange, disabled } = props;

  // Ensure selectedDates is formatted as "YYYY-MM-DD"
  const parsedSelectedDates = selectedDates.map((date) => dayjs(date).format('YYYY-MM-DD'));

  const returnSectionLabelString = () => {
    const len = selectedDates.length;
    if (len > 0) {
      return `Excluded Dates (${len} Days)`
    } else {
      return `Excluded Dates`
    }
  }

  return (
    <ExpandableSection
      title={returnSectionLabelString()}
      icon={<EventBusyIcon sx={{ fontSize: "1rem", verticalAlign: "middle" }} />}
      disabled={disabled}
      content={(
        <>
          <Typography color="text.secondary" variant='body2' gutterBottom>
            Select dates when you do <b>NOT</b> want to receive alerts. Useful for holidays or school breaks.
          </Typography>

          <Link
            variant="caption"
            sx={{
              cursor: "pointer",
              display: "block",
              textAlign: "right"
            }}
            onClick={(e) => {
              e.preventDefault();
              handleChange(selectedDates);
            }}
          >
            Clear All
          </Link>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{
              calendarWeekNumberHeaderText: 'Week',
              calendarWeekNumberText: (weekNumber) => `${weekNumber}.`,
            }}
          >
            <DateCalendar
              displayWeekNumber
              slots={{
                day: (dayProps) => (
                  <CustomDayComponent
                    {...dayProps}
                    selectedDates={parsedSelectedDates}
                  />
                ),
              }}
              onChange={(value, selectionState) => {
                if (selectionState === 'finish') {
                  handleChange([dayjs(value).format('YYYY-MM-DD')]);
                }
              }}
              disableHighlightToday
              minDate={dayjs().startOf('month')} // Restrict to dates after the start of the current month
            />
          </LocalizationProvider>
        </>
      )}
    />
  );
}
