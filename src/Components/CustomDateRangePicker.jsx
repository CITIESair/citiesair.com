/* eslint-disable */

import { useState, useRef, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { addDays, endOfDay, startOfDay, startOfYear, startOfMonth, endOfMonth, endOfYear, addMonths, addYears, startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";

import { useMediaQuery, useTheme } from '@mui/material';
import { Paper, Button, Stack } from '@mui/material';

function hexToRGBA(hex, alpha) {
  hex = hex.replace('#', '');
  return `rgba(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}, ${alpha})`;
}

const CustomDateRangePicker = () => {
  // Control displaying / hiding of the date range picker
  const [showComponents, setShowComponents] = useState(false);
  const paperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paperRef.current && !paperRef.current.contains(event.target)) {
        setShowComponents(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [paperRef]);

  const handleApplyButtonClick = (event) => {
    event.stopPropagation(); // Prevents Paper onClick from firing
    setShowComponents(false);
  };

  // Method to handle date range selection changes
  const handleSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
  };

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Convert Material-UI color objects to CSS color strings
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const textSecondaryColor = theme.palette.text.secondary;
  const customAlternateBackground = theme.palette.customAlternateBackground;

  const borderHighOpacity = theme.palette.text.primary;
  const borderLowOpacity = theme.palette.action.disabled;

  // Get the minimum date available for the date range picker
  const minDate = new Date(2021, 1, 1);

  // Define custom static ranges
  const staticRanges = [
    {
      label: "Last 14 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -14)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 30 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -30)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 90 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -90)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "Last 365 Days",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -365)),
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    },
    {
      label: "All Time",
      range: () => ({
        startDate: minDate,
        endDate: endOfDay(new Date())
      }),
      isSelected(range) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      }
    }
  ];

  // Keep track of the date range being selected by the user
  const [selectedRange, setSelectedRange] = useState([
    { ...staticRanges[0].range(), key: 'selection' } // Initialize with the range of the first static range
  ]);

  return (
    <Paper
      ref={paperRef}
      elevation={8}
      sx={{
        position: 'absolute',
        zIndex: showComponents === true && 10000,
        p: showComponents ? 1 : 0,
        m: smallScreen === false && (showComponents ? -1 : 0),
        width: 'fit-content',
        maxWidth: '100%',
        background: showComponents ? customAlternateBackground : 'transparent',
        boxShadow: showComponents === false && 'none',
        '& .rdrDayToday .rdrDayNumber span:after': {
          background: secondaryColor
        },
        '& .rdrDateDisplayWrapper, .rdrCalendarWrapper, .rdrDefinedRangesWrapper, .rdrStaticRange, .rdrDateDisplayItem': {
          background: 'transparent'
        },
        '& .rdrDateInput': {
          borderRadius: theme.spacing(1),
          boxShadow: 'none'
        },
        '& .rdrDateDisplayItemActive': {
          border: showComponents === false && 'none'
        },
        '& .rdrDateDisplay': {
          margin: 0,
        },
        '& .rdrDateDisplayItem': {
          m: 0,
          borderRadius: showComponents ? theme.spacing(1) : 0,
          "&:hover:not(.rdrDateDisplayItemActive)": {
            border: showComponents ? `1px solid ${borderLowOpacity}` : "none"
          }
        },
        '& .rdrDateDisplayItem:hover:not(.rdrDateDisplayItemActive)': {
          border: showComponents === false && '1px solid transparent'
        },
        '& .rdrDateDisplayItem + .rdrDateDisplayItem': {
          m: 0
        },
        '& .rdrDateDisplayItem:first-of-type': {
          borderRight: showComponents === false && `1px solid ${borderLowOpacity} !important`
        },
        '& .rdrMonthAndYearWrapper, .rdrInputRanges': {
          display: 'none !important'
        },
        '& .rdrDefinedRangesWrapper, .rdrMonths': {
          display: showComponents === false && 'none'
        },
        '&  .rdrInfiniteMonths': {
          visibility: showComponents === false && 'hidden',
          width: "80vw !important",
          maxWidth: "675px",
          margin: "auto"
        },
        '& .rdrDateDisplayWrapper': {
          minWidth: '18rem',
          width: 'fit-content',
          borderRadius: theme.spacing(1),
          border: showComponents ? "none" : `1px solid ${borderLowOpacity}`,
          "&:hover": {
            border: showComponents ? "none" : `1px solid ${borderHighOpacity}`,
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
          color: textSecondaryColor,
          px: smallScreen ? 1 : 2,
          py: smallScreen ? 0.5 : 1
        },
        '& .rdrDefinedRangesWrapper': {
          borderRight: 'none',
          borderLeft: `1px solid`,
          borderColor: smallScreen ? "transparent" : borderLowOpacity,
          width: '100%'
        },
        '& .rdrMonthAndYearWrapper > button': {
          background: theme.palette.customBackground.toString()
        },
        '& .rdrNextButton > i': {
          borderColor: `transparent transparent transparent ${primaryColor}`
        },
        '& .rdrPprevButton > i': {
          borderColor: `transparent ${primaryColor} transparent transparent`
        },
        '& .rdrStaticRange': {
          borderColor: smallScreen ? "transparent" : borderLowOpacity
        },
        '& .rdrStaticRangeSelected > .rdrStaticRangeLabel': {
          color: primaryColor
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
          py: 1,
          px: 2,
          '&:hover': {
            border: `1px solid ${textSecondaryColor}`
          }
        },
        '& .rdrDateDisplayItem input': {
          color: textSecondaryColor
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
        '& .rdrStartEdge': {
          left: 0
        },
        '& .rdrEndEdge': {
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
          my: "1px",
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='MuiSvgIcon-root' focusable='false' aria-hidden='true' viewBox='0 0 24 24' data-testid='DateRangeIcon'%3E%3Cpath d='M9 11H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14z' fill='${textSecondaryColor}'/%3E%3C/svg%3E")`,
          width: "0.75rem",
          height: "0.75rem",
          display: "block",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "0.75rem"
        }
      }}
      onClick={() => setShowComponents(true)}
    >
      <Stack direction={"column"} alignItems={"end"} spacing={smallScreen === true && 1}>
        <DateRangePicker
          ranges={selectedRange}
          onChange={handleSelect}
          staticRanges={staticRanges}
          inputRanges={[]}
          rangeColors={[primaryColor, secondaryColor, textSecondaryColor]}
          minDate={minDate}
          maxDate={new Date()}
          months={smallScreen ? 1 : 2}
          showMonthAndYearPickers={false}
          scroll={{
            enabled: true
          }}
          direction={"horizontal"}
          fixedHeight={true}
        />

        {showComponents && (
          <Button
            variant="contained"
            size="small"
            onClick={handleApplyButtonClick}
            sx={{
              zIndex: 100000,
              marginTop: smallScreen === false && "-2rem"
            }}
          >
            APPLY
          </Button>
        )}
      </Stack>

    </Paper >

  );
};

export default CustomDateRangePicker;
