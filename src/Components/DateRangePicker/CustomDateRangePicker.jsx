import { useState, useRef, useEffect, useContext } from 'react';

import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import { AggregationTypeMetadata, StyledDateRangePicker, returnCustomStaticRanges, returnFormattedDates } from './DateRangePickerUtils';
import AggregationTypeToggle from './AggregationTypeToggle';
import AggregationType from './AggregationType';
import { DashboardContext } from '../../ContextProviders/DashboardContext';

import { differenceInDays, isSameDay } from 'date-fns';

import { useSnackbar } from "notistack";
import { SnackbarMetadata } from '../../Utils/SnackbarMetadata';
import useChartData from '../../hooks/useChartData';

const CustomDateRangePicker = (props) => {
  const { minDateOfDataset, chartIndex } = props;
  const [isFirstRequest, setIsFirstRequest] = useState(true)

  const { enqueueSnackbar } = useSnackbar();
  const { isFetching } = useChartData(chartIndex);

  const { allChartsConfigs, updateIndividualChartConfigQueryParams } = useContext(DashboardContext);
  const chartConfig = allChartsConfigs[chartIndex] || {};
  const queryParams = chartConfig.queryParams || {};

  const [aggregationType, setAggregationType] = useState(queryParams.aggregationType || AggregationType.hour);
  const [dateRange, setDateRange] = useState(() => {
    const { startDate, endDate } = queryParams;
    if (startDate && endDate) {
      return {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        key: 'selection',
      };
    }
    // Default if not set
    return {
      startDate: null,
      endDate: null,
      key: 'selection',
    };
  });

  const today = new Date();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme => theme.breakpoints.up('lg'));

  // Set aggregationType
  useEffect(() => {
    // Initialize with the range of the first static range (default)
    const defaultRange = {
      ...returnCustomStaticRanges({
        aggregationType: aggregationType || AggregationType.hour,
        minDateOfDataset
      })[0].range(), key: 'selection'
    };
    setDateRange(defaultRange);
  }, [aggregationType]);

  // Handle date range change → update DashboardContext queryParams
  useEffect(() => {
    // Early return if this is the first request (already fetched by useChartData hook)
    if (isFirstRequest) {
      setIsFirstRequest(false);
      return;
    }

    const { startDate, endDate } = dateRange || {};
    if (!startDate || !endDate) return;

    // Start date and end date can't be the same date
    if (isSameDay(startDate, endDate)) {
      // No need to display error message as this is usually caused when only the start date is selected
      return;
    }

    // Restrict the selection to only max days per aggregationType
    const maxAllowedDays = AggregationTypeMetadata[aggregationType]?.maxDays;
    if (differenceInDays(endDate, startDate) > maxAllowedDays) {
      enqueueSnackbar(`${AggregationTypeMetadata[aggregationType].label} data is limited to maximum ${maxAllowedDays} day${maxAllowedDays > 1 ? "s" : ""}`, SnackbarMetadata.error);
      return;
    }

    // Change the config
    const formattedDates = returnFormattedDates({
      startDateObject: startDate,
      endDateObject: endDate
    });
    updateIndividualChartConfigQueryParams(chartIndex, {
      aggregationType,
      startDate: formattedDates.startDate,
      endDate: formattedDates.endDate
    });

  }, [dateRange]);

  // Control displaying / hiding of the date range picker
  const [showPickerPanel, setShowPickerPanel] = useState(false);
  const paperRef = useRef(null);

  // Hide or show the date-range-picker panel on user's manual input
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

  // Hide the panel on data fetching done
  useEffect(() => {
    if (!isFetching && showPickerPanel) {
      setShowPickerPanel(false);
    }
  }, [isFetching]);

  return (
    <>
      <Grid item alignItems={showPickerPanel ? "start" : "stretch"} xs sm="auto" lg>
        <Stack direction="column" alignItems="stretch" gap={0.5} width="100%">
          {
            isLargeScreen ? <Typography color="text.secondary" sx={{ textTransform: "uppercase" }}>Averaging Period</Typography> : null
          }
          <AggregationTypeToggle
            aggregationType={aggregationType}
            setAggregationType={setAggregationType}
            smallScreen={smallScreen}
          />
        </Stack>
      </Grid>

      <Grid
        item
        sx={{
          height: "2rem",
          flex: 1,
          [theme.breakpoints.up('lg')]: { minHeight: '4rem' }
          // width: { [theme.breakpoints.down("sm")]: { width: "100%" } },
        }}
      >
        <Stack direction="column" alignItems="stretch" gap={0.5}>
          {
            isLargeScreen ? <Typography color="text.secondary" sx={{ textTransform: "uppercase" }}>Date Range</Typography> : null
          }
          <StyledDateRangePicker
            showPickerPanel={showPickerPanel}
            smallScreen={smallScreen}
            ref={paperRef}
            elevation={8}
            onClick={() => setShowPickerPanel(true)}
            sx={{ position: "relative" }}
          >

            <Box
              sx={{
                transition: "filter 0.2s ease-in-out"
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
                direction="vertical"
                fixedHeight={true}
                preventSnapRefocus={true}
                startDatePlaceholder="Start Date"
                endDatePlaceholder="End Date"
                editableDateInputs={true}
                showMonthArrow={true}
                weekStartsOn={1}
              />
            </Box>
          </StyledDateRangePicker>
        </Stack>
      </Grid >

    </>
  );
};

export default CustomDateRangePicker;
