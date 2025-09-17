/* eslint-disable */

import { useState, useRef, useEffect, useContext } from 'react';

import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { Box, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';

import { AggregationTypeMetadata, StyledDateRangePicker, returnCustomStaticRanges, returnFormattedDates } from './DateRangePickerUtils';
import { getHistoricalChartApiUrl } from '../../API/ApiUrls';
import { ChartAPIendpoints, ChartAPIendpointsOrder } from "../../API/Utils";
import AggregationTypeToggle from './AggregationTypeToggle';
import AggregationType from './AggregationType';
import { DashboardContext } from '../../ContextProviders/DashboardContext';

import { differenceInDays, isSameDay } from 'date-fns';
import { fetchDataFromURL } from '../../API/ApiFetch';
import { useDateRangePicker } from '../../ContextProviders/DateRangePickerContext';

import { useSnackbar } from "notistack";
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';

const historicalChartIndex = ChartAPIendpointsOrder.findIndex(endpoint => endpoint === ChartAPIendpoints.historical);

const CustomDateRangePicker = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const { minDateOfDataset, dataType } = props;
  const { currentSchoolID, setIndividualChartData } = useContext(DashboardContext);

  const today = new Date();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Keep track of the date range and aggregationType  selected by the user
  const { dateRange, setDateRange, aggregationType, setAggregationType } = useDateRangePicker();

  useEffect(() => {
    const { startDate, endDate } = dateRange || {};
    if (!startDate || !endDate) return;

    // Start date and end date can't be the same date
    if (isSameDay(startDate, endDate)) {
      // No need to display error message as this is usually caused when only the start date is selected
      return;
    }

    // Restrict the selection to only max days per aggregationType
    if (differenceInDays(endDate, startDate) > AggregationTypeMetadata[aggregationType]?.maxDays) {
      enqueueSnackbar(`${AggregationTypeMetadata[aggregationType]} average is limited to max ${maxAllowedDays}d`, SnackbarMetadata.error);
      return;
    }

    requestNewDataFromApi();
  }, [dateRange])


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

  // Set aggregationType and request data from API if it changes
  useEffect(() => {
    if (!aggregationType) {
      setAggregationType(AggregationType.hour);
    }
    // Initialize with the range of the first static range (default)
    const defaultRange = {
      ...returnCustomStaticRanges({
        aggregationType: aggregationType || AggregationType.hour,
        minDateOfDataset
      })[0].range(), key: 'selection'
    };
    setDateRange(defaultRange);

    requestNewDataFromApi(defaultRange);
  }, [aggregationType]);

  // Send query request to backend when APPLY button is clicked
  // Check if a new date range is selected as well
  const requestNewDataFromApi = (_dateRange = null) => {
    const range = _dateRange || dateRange;
    if (!range || !range.startDate || !range.endDate) return;

    const formattedDates = returnFormattedDates({
      startDateObject: range.startDate,
      endDateObject: range.endDate
    });
    const newUrl = getHistoricalChartApiUrl({
      endpoint: ChartAPIendpoints.historical,
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
          setIsFetchingData(false);
          setShowPickerPanel(false);

          setIndividualChartData(historicalChartIndex, data);
          setChartUrl(newUrl);
        })
        .catch((error) => {
          setIsFetchingData(false);
          enqueueSnackbar("Error fetching historical data, please try again", SnackbarMetadata.error);
          console.log(error);
        });
    }
  }

  return (
    <>
      <Grid item alignItems={showPickerPanel ? "start" : "stretch"} xs={12} sm="auto">
        <AggregationTypeToggle
          aggregationType={aggregationType}
          setAggregationType={setAggregationType}
          smallScreen={smallScreen}
        />
      </Grid>

      <Grid
        item
        sx={{
          height: "2rem",
          width: { [theme.breakpoints.down("sm")]: { width: "100%" } },
        }}
      >
        <StyledDateRangePicker
          showPickerPanel={showPickerPanel}
          smallScreen={smallScreen}
          ref={paperRef}
          elevation={8}
          onClick={() => setShowPickerPanel(true)}
          sx={{ position: "relative" }}
        >
          {/* Calendar wrapper with blur on loading */}
          <Box
            sx={{
              filter: (isFetchingData && showPickerPanel) ? "blur(2px)" : "none",
              pointerEvents: isFetchingData ? "none" : "auto",
              transition: "filter 0.2s ease-in-out",
            }}
          >
            <DateRangePicker
              ranges={[dateRange]}
              onChange={(ranges) => {
                if (!ranges) return;
                setDateRange(ranges.selection);
              }}
              staticRanges={createStaticRanges(
                returnCustomStaticRanges({ minDateOfDataset, aggregationType })
              )}
              inputRanges={[]}
              rangeColors={[
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.text.secondary,
              ]}
              minDate={minDateOfDataset}
              maxDate={today}
              months={1}
              showMonthAndYearPickers={true}
              direction="horizontal"
              fixedHeight={true}
              preventSnapRefocus={true}
              startDatePlaceholder="Start Date"
              endDatePlaceholder="End Date"
              editableDateInputs={true}
              showMonthArrow={true}
              weekStartsOn={1}
            />
          </Box>

          {/* Overlay spinner */}
          {isFetchingData && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10,
              }}
            >
              <CircularProgress
                disableShrink
                size={showPickerPanel ? "2.5rem" : "1.25rem"}
                color="primary"
              />
            </Box>
          )}
        </StyledDateRangePicker>
      </Grid>

    </>
  );
};

export default CustomDateRangePicker;
