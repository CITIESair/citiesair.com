/* eslint-disable */

import { useState, useRef, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { addDays, endOfDay, startOfDay, startOfYear, startOfMonth, endOfMonth, endOfYear, addMonths, addYears, startOfWeek, endOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";

import { useMediaQuery, useTheme } from '@mui/material';
import { Paper, Button, Stack } from '@mui/material';

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

  const handleCloseButtonClick = (event) => {
    event.stopPropagation(); // Prevents Paper onClick from firing
    setShowComponents(false);
  };

  // Method to handle date range selection changes
  const handleSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
  };

  const theme = useTheme();
  // Convert Material-UI color objects to CSS color strings
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const textSecondaryColor = theme.palette.text.secondary;
  const customAlternateBackground = theme.palette.customAlternateBackground;

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
      sx={{
        p: showComponents ? 1 : 0,
        m: showComponents ? -1 : 0,
        width: 'fit-content',
        background: showComponents ? customAlternateBackground : 'transparent',
        boxShadow: showComponents ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
        '& .rdrDayToday .rdrDayNumber span:after': {
          background: secondaryColor
        },
        '& .rdrDateDisplayWrapper, .rdrCalendarWrapper, .rdrDefinedRangesWrapper, .rdrStaticRange, .rdrDateDisplayItem': {
          background: 'transparent'
        },
        '& .rdrDateInput': {
          borderRadius: theme.spacing(1),
          boxShadow: 'none',
          border: `1px solid ${textSecondaryColor}`
        },
        '& .rdrDateDisplayItemActive': {
          borderWidth: '2px',
          borderColor: 'inherit'
        },
        '& .rdrDefinedRangesWrapper, .rdrMonthAndYearWrapper, .rdrMonths': {
          display: showComponents ? 'inherit' : 'none'
        },
        '& .rdrDateDisplayWrapper': {
          minWidth: '300px',
          borderRadius: theme.spacing(1),
          border: showComponents ? "none" : "0.5px solid",
          borderColor: textSecondaryColor
        },
        '& .rdrDateRangePickerWrapper': {
          flexDirection: 'row-reverse'
        },
        '& .rdrDefinedRangesWrapper': {
          borderRight: 'none',
          borderLeft: `0.5px solid ${textSecondaryColor}`,
          width: '100%'
        }
      }}
      onClick={() => setShowComponents(true)}
    >
      <Stack direction="column" alignItems="end">
        <DateRangePicker
          ranges={selectedRange}
          onChange={handleSelect}
          staticRanges={staticRanges}
          inputRanges={[]}
          rangeColors={[primaryColor, secondaryColor, textSecondaryColor]}
          minDate={minDate}
          maxDate={new Date()}
          months={1}
        />

        {showComponents && (
          <Button onClick={handleCloseButtonClick}>
            Close
          </Button>
        )}
      </Stack>

    </Paper>

  );
};

export default CustomDateRangePicker;
