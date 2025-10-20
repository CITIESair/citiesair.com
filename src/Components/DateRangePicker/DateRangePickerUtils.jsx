/* eslint-disable */

import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

import { addDays, endOfDay, startOfDay, format, addHours } from "date-fns";
import AggregationType from './AggregationType';

const today = new Date();

const yesterday = {
  label: "Yesterday",
  range: () => ({
    startDate: startOfDay(addHours(today, -48)),
    endDate: today
  })
};

const last14Days = {
  label: "Last 14d",
  range: () => ({
    startDate: startOfDay(addDays(today, -14)),
    endDate: endOfDay(today)
  })
};

const last30Days = {
  label: "Last 30d",
  range: () => ({
    startDate: startOfDay(addDays(today, -30)),
    endDate: endOfDay(today)
  })
};

const last365Days = {
  label: "Last 365d",
  range: () => ({
    startDate: startOfDay(addDays(today, -365)),
    endDate: endOfDay(today)
  })
};

const allTime = ({ minDateOfDataset }) => {
  const formattedMinDate = format(minDateOfDataset, "MMM yyyy");
  return {
    label: `All Time (${formattedMinDate} - Now)`,
    range: () => ({
      startDate: minDateOfDataset,
      endDate: endOfDay(today)
    })
  }
};

export const returnCustomStaticRanges = ({ minDateOfDataset, aggregationType }) => {
  switch (aggregationType) {
    case AggregationType.minute:
      return [yesterday];
    case AggregationType.day:
      return [last30Days, last365Days];
    case AggregationType.month:
    case AggregationType.year:
      return [allTime({ minDateOfDataset })];
    default:
      return [last14Days, last30Days];
  }
};

export const AggregationTypeMetadata = {
  [AggregationType.minute]: {
    maxDays: 2,
    label: "Real-time"
  },
  [AggregationType.hour]: {
    maxDays: 30,
    label: "Hourly"
  },
  [AggregationType.day]: {
    maxDays: 365,
    label: "Daily"
  },
  [AggregationType.month]: {
    maxDays: Infinity,
    label: "Monthly"
  },
  [AggregationType.year]: {
    maxDays: Infinity,
    label: "Yearly"
  }
}

export const StyledDateRangePicker = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'showPickerPanel' && prop !== 'smallScreen',
})(({ theme, showPickerPanel, smallScreen }) => ({
  zIndex: showPickerPanel === true && 1,
  position: "relative",
  padding: showPickerPanel ? theme.spacing(1) : 0,
  margin: (showPickerPanel && !smallScreen) ? theme.spacing(-1) : 0,
  maxWidth: '100%',
  background: showPickerPanel ? theme.palette.customAlternateBackground : 'transparent',
  boxShadow: showPickerPanel === false && 'none',
  '& .rdrDateInput::before': {
    display: "none !important"
  },
  '& .rdrDateInput': {
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    padding: 0
  },
  '& .rdrDayToday .rdrDayNumber span:after': {
    background: theme.palette.secondary
  },
  '& .rdrDateDisplayWrapper, .rdrCalendarWrapper, .rdrDefinedRangesWrapper, .rdrStaticRange, .rdrDateDisplayItem': {
    background: 'transparent'
  },
  '& .rdrDateDisplayItemActive': {
    border: showPickerPanel === false && 'none'
  },
  '& .rdrDateDisplay': {
    margin: 0,
    minWidth: "10rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2rem"
  },
  '& .rdrDateDisplayItem': {
    margin: 0,
    borderRadius: showPickerPanel ? theme.shape.borderRadius : 0,
    "&:hover:not(.rdrDateDisplayItemActive)": {
      border: showPickerPanel ? `1px solid ${theme.palette.action.disabled}` : "none"
    }
  },
  '& .rdrDateDisplayItem:hover:not(.rdrDateDisplayItemActive)': {
    border: showPickerPanel === false && '1px solid transparent'
  },
  '& .rdrDateDisplayItem + .rdrDateDisplayItem': {
    margin: 0
  },
  '& .rdrDateDisplayItem:first-of-type': {
    borderRight: showPickerPanel === false && `1px solid ${theme.palette.action.disabled} !important`
  },
  '& .rdrMonthAndYearWrapper, .rdrInputRanges': {
    display: showPickerPanel === false && 'none !important',
    padding: 0
  },
  '& .rdrMonthName': {
    display: 'none',
  },
  '& .rdrDefinedRangesWrapper, .rdrMonths': {
    display: showPickerPanel === false && 'none'
  },
  '&  .rdrInfiniteMonths': {
    visibility: showPickerPanel === false && 'hidden',
    width: "100% !important",
    maxWidth: "675px",
    margin: "auto"
  },
  '& .rdrDateDisplayWrapper': {
    minWidth: '9rem',
    height: '2rem',
    borderRadius: theme.shape.borderRadius,
    border: showPickerPanel ? "none" : `1px solid ${theme.palette.action.disabled}`,
    "&:hover": {
      border: showPickerPanel ? "none" : `1px solid ${theme.palette.text.primary}`,
    }
  },
  '& .rdrDateRangePickerWrapper': {
    width: '100%',
    flexDirection: 'column-reverse'
  },
  '& .rdrStaticRanges': {
    flexDirection: 'row',
    minWidth: '10.5rem'
  },
  '& .rdrStaticRangeLabel': {
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`
  },
  '& .rdrDefinedRangesWrapper': {
    border: 'none',
    width: '100%'
  },
  '& .rdrNextPrevButton': {
    background: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    opacity: 1,
    '&:hover': {
      opacity: 0.5,
      background: theme.palette.primary.main
    }
  },
  '& .rdrNextPrevButton > i': {
    color: "white"
  },
  '& .rdrNextButton > i': {
    borderColor: `transparent transparent transparent white`
  },
  '& .rdrPprevButton > i': {
    borderColor: `transparent white transparent transparent`
  },
  '& .rdrStaticRange': {
    border: 'none'
  },
  '& .rdrStaticRangeSelected > .rdrStaticRangeLabel, .rdrMonthAndYearPickers': {
    color: theme.palette.primary.main
  },
  '& .rdrMonthAndYearPickers': {
    fontSize: '1rem'
  },
  '& .rdrStaticRange:hover .rdrStaticRangeLabel, .rdrStaticRange:focus .rdrStaticRangeLabel': {
    background: theme.palette.customBackground.toString()
  },
  '& .rdrDayNumber span': {
    color: theme.palette.text.primary.toString()
  },
  '& .rdrDayPassive .rdrDayNumber span': {
    opacity: 0.5
  },
  '& .rdrMonthAndYearWrapper select': {
    color: theme.palette.text.secondary.toString(),
    background: 'none',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    '&:hover': {
      border: `1px solid ${theme.palette.text.secondary}`
    }
  },
  '& .rdrDateDisplayItem input': {
    color: theme.palette.text.secondary
  },
  '& .rdrDayDisabled': {
    backgroundColor: theme.palette.customBackground
  },
  '& .rdrDayEndOfMonth .rdrInRange, .rdrDayEndOfMonth .rdrStartEdge, .rdrDayEndOfWeek .rdrInRange, .rdrDayEndOfWeek .rdrStartEdge, .rdrEndEdge, .rdrDayEndOfMonth .rdrDayInPreview, .rdrDayEndOfMonth .rdrDayStartPreview, .rdrDayEndOfWeek .rdrDayInPreview, .rdrDayEndOfWeek .rdrDayStartPreview, .rdrDayEndPreview': {
    borderTopRightRadius: '2rem',
    borderBottomRightRadius: '2rem'
  },
  '& .rdrStartEdge, .rdrDayStartOfMonth .rdrInRange, .rdrDayStartOfMonth .rdrEndEdge, .rdrDayStartOfWeek .rdrInRange, .rdrDayStartOfWeek .rdrEndEdge, .rdrDayStartOfMonth .rdrDayInPreview, .rdrDayStartOfMonth .rdrDayEndPreview, .rdrDayStartOfWeek .rdrDayInPreview, .rdrDayStartOfWeek .rdrDayEndPreview, .rdrDayStartPreview': {
    borderTopLeftRadius: '2rem',
    borderBottomLeftRadius: '2rem'
  },
  '& .rdrStartEdge, .rdrDayStartOfWeek .rdrInRange, .rdrDayStartOfMonth .rdrInRange, .rdrDayStartOfMonth .rdrEndEdge, .rdrDayStartOfWeek .rdrEndEdge': {
    left: 0
  },
  '& .rdrEndEdge, .rdrDayEndOfWeek .rdrInRange, .rdrDayEndOfMonth .rdrInRange, .rdrDayEndOfWeek .rdrStartEdge': {
    right: 0
  },
  '& .rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge': {
    top: '0px',
    bottom: '0px',
  },
  '& .rdrMonths': {
    justifyContent: 'center',
    alignItems: 'center'
  },
  '& .rdrDay': {
    marginBottom: "1px",
    '& span': {
      top: '0px',
      bottom: '0px'
    }
  },
  '& .rdrMonthsHorizontal': {
    overflowY: 'hidden'
  },
  '& .rdrDateInput:first-of-type:before': {
    content: '""',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='MuiSvgIcon-root' focusable='false' aria-hidden='true' viewBox='0 0 24 24' data-testid='DateRangeIcon'%3E%3Cpath d='M9 11H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14z' fill='${theme.palette.text.secondary}'/%3E%3C/svg%3E")`,
    width: "0.75rem",
    height: "0.75rem",
    display: "block",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "0.75rem"
  },
  '& .rdrStaticRangeSelected span': {
    color: theme.palette.primary.main
  },
  '& .rdrDayToday .rdrDayNumber span:after': {
    background: theme.palette.secondary.main,
    width: "0.25rem",
    height: "0.25rem",
    borderRadius: "50%"
  }
}));

export const returnFormattedDates = ({ startDateObject, endDateObject }) => {
  return {
    startDate: format(startDateObject, 'yyyy-MM-dd'),
    endDate: format(endDateObject, 'yyyy-MM-dd')
  }
}