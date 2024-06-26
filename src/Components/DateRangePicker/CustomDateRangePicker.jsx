/* eslint-disable */

import { useState, useRef, useEffect, useContext } from 'react';

import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { Alert, Button, Stack } from '@mui/material';

import { StyledDateRangePicker, returnCustomStaticRanges, returnFormattedDates } from './DateRangePickerUtils';
import { ChartEndpoints, getHistoricalChartApiUrl } from '../../Utils/ApiFunctions/ApiUtils';
import AggregationTypeToggle from './AggregationTypeToggle';
import AggregationType from './AggregationType';
import { DashboardContext } from '../../ContextProviders/DashboardContext';

import { differenceInDays, isSameDay } from 'date-fns';
import { fetchDataFromURL } from '../../Utils/ApiFunctions/ApiCalls';
import { useDateRangePicker } from '../../ContextProviders/DateRangePickerContext';

const InvalidRangeMessages = {
  tooLong: "HOURLY data is limited to max 30d",
  sameDay: "Start and end dates must be different"
}

const CustomDateRangePicker = (props) => {
  const { minDateOfDataset, dataType } = props;
  const { currentSchoolID, setIndividualChartData } = useContext(DashboardContext);
  const [invalidRangeMessage, setInvalidRangeMessage] = useState();

  const today = new Date();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Keep track of the date range and aggregationType  selected by the user
  const { dateRange, setDateRange, aggregationType, setAggregationType } = useDateRangePicker();
  useEffect(() => {
    // Initialize with the range of the first static range
    setDateRange({
      ...returnCustomStaticRanges({ today, minDateOfDataset })[0].range(), key: 'selection'
    });
    setAggregationType(AggregationType.hourly);
  }, []);

  const [chartUrl, setChartUrl] = useState();

  // Control displaying / hiding of the date range picker
  const [showPickerPanel, setShowPickerPanel] = useState(false);
  const paperRef = useRef(null);

  const [isFetchingData, setIsFetchingData] = useState(false);

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

  const checkValidRange = (selectedRange) => {
    const { startDate, endDate } = selectedRange || {};
    if (!startDate || !endDate) return;

    // Start date and end date can't be the same date
    if (isSameDay(startDate, endDate)) {
      setInvalidRangeMessage(InvalidRangeMessages.sameDay);
      return;
    }
    else {
      setInvalidRangeMessage(null);
    }

    // Restrict the selection to only 30 days if aggregationType is hourly
    if (aggregationType === AggregationType.hourly) {
      const diff = differenceInDays(endDate, startDate);
      setInvalidRangeMessage((diff > 30) ? InvalidRangeMessages.tooLong : null);
    }
    // No restriction for daily aggregationType
    else {
      if (invalidRangeMessage !== null) setInvalidRangeMessage(null);
    }
  }

  // Method to handle date range selection changes
  const handleSelect = (ranges) => {
    if (!ranges) return;

    checkValidRange(ranges.selection);
    setDateRange(ranges.selection);
  };

  useEffect(() => {
    checkValidRange(dateRange);
  }, [aggregationType]);

  // Send query request to backend when APPLY button is clicked
  // Check if a new date range is selected as well
  const handleApplyButtonClick = (event) => {
    if (invalidRangeMessage !== null) return;

    event.stopPropagation(); // Prevents Paper onClick from firing

    const formattedDates = returnFormattedDates({
      startDateObject: dateRange.startDate,
      endDateObject: dateRange.endDate
    });
    const newUrl = getHistoricalChartApiUrl({
      endpoint: ChartEndpoints.historical,
      school_id: currentSchoolID,
      aggregationType: aggregationType,
      dataType: dataType,
      startDate: formattedDates.startDate,
      endDate: formattedDates.endDate
    });

    if (newUrl !== chartUrl) {
      setIsFetchingData(true);

      fetchDataFromURL({
        url: newUrl
      })
        .then((data) => {
          setIndividualChartData(0, data); // first chart -> chartIndex = 0
          setChartUrl(newUrl);
          setIsFetchingData(false);
          setShowPickerPanel(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };

  const renderApplyButtonLabel = () => {
    return (
      isFetchingData ? <CircularProgress disableShrink size="1.4375rem" color="inherit" /> : "APPLY"
    )
  };

  return (
    <StyledDateRangePicker
      showPickerPanel={showPickerPanel}
      smallScreen={smallScreen}
      ref={paperRef}
      elevation={8}
      onClick={() => setShowPickerPanel(true)}
    >
      <Stack direction={"column"} spacing={1}>
        <DateRangePicker
          ranges={[dateRange]}
          onChange={handleSelect}
          staticRanges={
            createStaticRanges(
              returnCustomStaticRanges({
                today, minDateOfDataset, aggregationType
              })
            )
          }
          inputRanges={[]}
          rangeColors={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.text.secondary]}
          minDate={minDateOfDataset}
          maxDate={today}
          months={1}
          showMonthAndYearPickers={false}
          direction={"horizontal"}
          fixedHeight={true}
          preventSnapRefocus={true}
          calendarFocus="backwards"
          startDatePlaceholder="Start Date"
          endDatePlaceholder="End Date"
          editableDateInputs={true}
          showMonthArrow={true}
        />

        {showPickerPanel && (
          <Stack
            direction="column"
            alignItems="end"
            width="100%"
            spacing={1}
          >
            <AggregationTypeToggle
              aggregationType={aggregationType}
              setAggregationType={setAggregationType}
              smallScreen={smallScreen}
            />
            <Stack direction="row" spacing={1}>
              {
                invalidRangeMessage && displayErrorMessage(invalidRangeMessage)
              }
              <Button
                variant="contained"
                size="small"
                disabled={invalidRangeMessage === null ? false : true}
                onClick={handleApplyButtonClick}
                sx={{
                  zIndex: 1005,
                  transform: "translateY(-1px)"
                }}
              >
                {renderApplyButtonLabel()}
              </Button>
            </Stack>

          </Stack>

        )}
      </Stack>
    </StyledDateRangePicker>
  );
};

const displayErrorMessage = (invalidRangeMessage) => {
  return (
    <Alert
      severity="error"
      sx={{
        py: 0.5,
        px: 1,
        display: "flex",
        alignItems: "center",
        "& div": {
          fontSize: "0.75rem",
          p: 0
        },
        "& .MuiAlert-icon": {
          fontSize: "1rem",
          mr: 0.5
        }
      }}
    >
      {invalidRangeMessage}
    </Alert>
  )
}

export default CustomDateRangePicker;
