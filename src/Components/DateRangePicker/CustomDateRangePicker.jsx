/* eslint-disable */

import { useState, useRef, useEffect } from 'react';

import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { useMediaQuery, useTheme } from '@mui/material';
import { Button, Stack } from '@mui/material';

import { StyledDateRangePicker, returnCustomStaticRanges } from './DateRangePickerUtils';

const CustomDateRangePicker = () => {
  // Control displaying / hiding of the date range picker
  const [showPickerPanel, setShowPickerPanel] = useState(false);
  const paperRef = useRef(null);

  // Hide or show the date-range-picker panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paperRef.current && !paperRef.current.contains(event.target)) {
        setShowPickerPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [paperRef]);

  const handleApplyButtonClick = (event) => {
    event.stopPropagation(); // Prevents Paper onClick from firing
    setShowPickerPanel(false);
  };

  // Method to handle date range selection changes
  const handleSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
  };

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Get the minimum date available for the date range picker
  const minDate = new Date(2021, 1, 1);

  // Keep track of the date range being selected by the user
  const [selectedRange, setSelectedRange] = useState([
    { ...returnCustomStaticRanges()[0].range(), key: 'selection' } // Initialize with the range of the first static range
  ]);

  return (
    <StyledDateRangePicker
      showPickerPanel={showPickerPanel}
      smallScreen={smallScreen}
      ref={paperRef}
      elevation={8}
      onClick={() => setShowPickerPanel(true)}
    >
      <Stack direction={"column"} alignItems={"end"} spacing={smallScreen === true && 1}>
        <DateRangePicker
          ranges={selectedRange}
          onChange={handleSelect}
          staticRanges={createStaticRanges(returnCustomStaticRanges(minDate))}
          inputRanges={[]}
          rangeColors={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.text.secondary]}
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

        {showPickerPanel && (
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

    </StyledDateRangePicker>

  );
};

export default CustomDateRangePicker;
