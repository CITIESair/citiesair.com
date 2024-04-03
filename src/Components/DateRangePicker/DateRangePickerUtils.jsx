/* eslint-disable */

import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

import { addDays, endOfDay, startOfDay } from "date-fns";

export const returnCustomStaticRanges = (minDate) => {
  return [
    {
      label: "Last 14 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -14)),
        endDate: endOfDay(new Date())
      })
    },
    {
      label: "Last 30 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -30)),
        endDate: endOfDay(new Date())
      })
    },
    {
      label: "Last 90 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -90)),
        endDate: endOfDay(new Date())
      })
    },
    {
      label: "Last 365 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -365)),
        endDate: endOfDay(new Date())
      })
    },
    {
      label: "All Time",
      range: () => ({
        startDate: minDate,
        endDate: endOfDay(new Date())
      })
    }
  ];
};

export const StyledDateRangePicker = styled(Paper)(({ theme, showPickerPanel, smallScreen }) => ({
  position: 'absolute',
  zIndex: showPickerPanel === true && 10000,
  padding: showPickerPanel ? theme.spacing(1) : 0,
  margin: smallScreen === false && (showPickerPanel ? theme.spacing(-1) : 0),
  width: 'fit-content',
  maxWidth: '100%',
  background: showPickerPanel ? theme.palette.customAlternateBackground : 'transparent',
  boxShadow: showPickerPanel === false && 'none',
  '& .rdrDayToday .rdrDayNumber span:after': {
    background: theme.palette.secondary
  },
  '& .rdrDateDisplayWrapper, .rdrCalendarWrapper, .rdrDefinedRangesWrapper, .rdrStaticRange, .rdrDateDisplayItem': {
    background: 'transparent'
  },
  '& .rdrDateInput': {
    borderRadius: theme.spacing(1),
    boxShadow: 'none'
  },
  '& .rdrDateDisplayItemActive': {
    border: showPickerPanel === false && 'none'
  },
  '& .rdrDateDisplay': {
    margin: 0,
  },
  '& .rdrDateDisplayItem': {
    margin: 0,
    borderRadius: showPickerPanel ? theme.spacing(1) : 0,
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
    display: 'none !important'
  },
  '& .rdrDefinedRangesWrapper, .rdrMonths': {
    display: showPickerPanel === false && 'none'
  },
  '&  .rdrInfiniteMonths': {
    visibility: showPickerPanel === false && 'hidden',
    width: "80vw !important",
    maxWidth: "675px",
    margin: "auto"
  },
  '& .rdrDateDisplayWrapper': {
    minWidth: '18rem',
    width: 'fit-content',
    borderRadius: theme.spacing(1),
    border: showPickerPanel ? "none" : `1px solid ${theme.palette.action.disabled}`,
    "&:hover": {
      border: showPickerPanel ? "none" : `1px solid ${theme.palette.text.primary}`,
    }
  },
  '& .rdrDateRangePickerWrapper': {
    flexDirection: smallScreen ? 'column-reverse' : 'row-reverse',
    gap: smallScreen ? '0.5rem' : '1rem'
  },
  '& .rdrStaticRanges': {
    flexDirection: smallScreen ? 'row' : 'column',
  },
  '& .rdrStaticRangeLabel': {
    color: theme.palette.text.secondary,
    padding: `${smallScreen ? `${theme.spacing(0.5)} ${theme.spacing(1)}` : `${theme.spacing(1)} ${theme.spacing(2)}`}`
  },
  '& .rdrDefinedRangesWrapper': {
    borderRight: 'none',
    borderLeft: `1px solid`,
    borderColor: smallScreen ? "transparent" : theme.palette.action.disabled,
    width: '100%'
  },
  '& .rdrMonthAndYearWrapper > button': {
    background: theme.palette.customBackground.toString()
  },
  '& .rdrNextButton > i': {
    borderColor: `transparent transparent transparent ${theme.palette.primary}`
  },
  '& .rdrPprevButton > i': {
    borderColor: `transparent ${theme.palette.primary} transparent transparent`
  },
  '& .rdrStaticRange': {
    borderColor: smallScreen ? "transparent" : theme.palette.action.disabled
  },
  '& .rdrStaticRangeSelected > .rdrStaticRangeLabel': {
    color: theme.palette.primary
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
  '& .rdrStartEdge, .rdrDayStartOfWeek .rdrInRange, .rdrDayStartOfMonth .rdrInRange': {
    left: 0
  },
  '& .rdrEndEdge, .rdrDayEndOfWeek .rdrInRange, .rdrDayEndOfMonth .rdrInRange': {
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
    borderRadius: "1rem"
  }
}));