/* eslint-disable */

import { useState, useRef, useEffect, useContext } from 'react';

import { DateRangePicker, createStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { Alert, Button, Stack } from '@mui/material';

import { StyledDateRangePicker, returnCustomStaticRanges } from './DateRangePickerUtils';
import { EndPoints, getApiUrl } from '../../Utils/ApiUtils';
import AggregationTypeToggle from './AggregationTypeToggle';
import AggregationType from './AggregationType';
import { DashboardContext } from '../../ContextProviders/DashboardContext';

import { differenceInDays } from 'date-fns';

const sample = {
  "id": 1,
  "title": "Historical Snapshots of AQI (Last 14 Days)",
  "customClassName": "historical-snapshot-aqi",
  "chartType": "ComboChart",
  "dataArray": [
    [
      {
        "type": "datetime",
        "label": "time"
      },
      "Hazardous",
      "Very Unhealthy",
      "Unhealthy",
      "Unhealthy for Sensitive Groups",
      "Moderate",
      "Good",
      "Outdoors NYUAD AQI",
      "Campus Center AQI",
      "Dining Hall D2 AQI",
      "A1 - 1st Floor AQI",
      "A5 - 1st Floor AQI"
    ],
    [
      "Date(1711126800000)",
      0,
      0,
      200,
      150,
      100,
      50,
      87,
      39,
      78,
      46,
      53
    ],
    [
      "Date(1711130400000)",
      0,
      0,
      200,
      150,
      100,
      50,
      79,
      40,
      67,
      45,
      54
    ],
    [
      "Date(1711134000000)",
      0,
      0,
      200,
      150,
      100,
      50,
      80,
      37,
      64,
      43,
      52
    ],
    [
      "Date(1711137600000)",
      0,
      0,
      200,
      150,
      100,
      50,
      74,
      37,
      57,
      42,
      51
    ],
    [
      "Date(1711141200000)",
      0,
      0,
      200,
      150,
      100,
      50,
      77,
      37,
      57,
      42,
      53
    ],
    [
      "Date(1711144800000)",
      0,
      0,
      200,
      150,
      100,
      50,
      86,
      40,
      53,
      43,
      53
    ],
    [
      "Date(1711148400000)",
      0,
      0,
      200,
      150,
      100,
      50,
      92,
      39,
      47,
      42,
      51
    ],
    [
      "Date(1711152000000)",
      0,
      0,
      200,
      150,
      100,
      50,
      89,
      35,
      51,
      39,
      44
    ],
    [
      "Date(1711155600000)",
      0,
      0,
      200,
      150,
      100,
      50,
      92,
      34,
      51,
      38,
      43
    ],
    [
      "Date(1711159200000)",
      0,
      0,
      200,
      150,
      100,
      50,
      95,
      33,
      51,
      39,
      46
    ],
    [
      "Date(1711162800000)",
      0,
      0,
      200,
      150,
      100,
      50,
      99,
      33,
      51,
      44,
      49
    ],
    [
      "Date(1711166400000)",
      0,
      0,
      200,
      150,
      100,
      50,
      77,
      37,
      54,
      51,
      53
    ],
    [
      "Date(1711170000000)",
      0,
      0,
      200,
      150,
      100,
      50,
      67,
      31,
      39,
      39,
      40
    ],
    [
      "Date(1711173600000)",
      0,
      0,
      200,
      150,
      100,
      50,
      73,
      25,
      45,
      32,
      35
    ]
  ],
  "options": {
    "seriesSelector": {
      "allowMultiple": true,
      "method": "toggleVisibility",
      "defaultSeriesToDisplayInitially": [
        7,
        8,
        9
      ]
    },
    "hAxis": {
      "title": "Date Time",
      "gridlines": {
        "color": "transparent"
      }
    },
    "colors": "reverseAqi",
    "chartArea": {
      "backgroundColor": "#fff"
    },
    "seriesType": "area",
    "lineWidth": 0,
    "areaOpacity": 1,
    "series": {
      "0": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "1": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "2": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "3": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "4": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "5": {
        "pointSize": 0,
        "visibleInLegend": false,
        "enableInteractivity": false
      },
      "6": {
        "lineWidth": 2,
        "type": "line",
        "color": "#555"
      },
      "7": {
        "lineWidth": 1,
        "type": "line",
        "color": "#777"
      },
      "8": {
        "lineWidth": 1,
        "type": "line",
        "color": "#555",
        "lineDashStyle": [
          5,
          1.5
        ]
      },
      "9": {
        "lineWidth": 1,
        "type": "line",
        "color": "#555",
        "lineDashStyle": [
          1.5,
          0.75
        ]
      },
      "10": {
        "lineWidth": 1,
        "type": "line",
        "color": "#555",
        "lineDashStyle": [
          2.5,
          2.5
        ]
      }
    },
    "vAxis": {
      "title": "US AQI",
      "gridlines": {
        "count": 0
      }
    }
  },
  "control": {
    "controlType": "ChartRangeFilter",
    "options": {
      "filterColumnIndex": 0,
      "ui": {
        "minRangeSize": 86400000
      }
    }
  }
};

const CustomDateRangePicker = () => {
  const { currentSchoolID, chartData, setChartData } = useContext(DashboardContext);
  const [aggregationType, setAggregationType] = useState(AggregationType.hourly);

  // Get the minimum date available for the date range picker
  const today = new Date();
  const [minDateOfDataset, setMinDateOfDataset] = useState(new Date(2021, 1, 1));

  const [isValidRange, setIsValidRange] = useState(true);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));


  // Keep track of the date range being selected by the user
  const [selectedRange, setSelectedRange] = useState([
    { ...returnCustomStaticRanges({ today, minDateOfDataset, smallScreen })[0].range(), key: 'selection' } // Initialize with the range of the first static range
  ]);

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
    // Restrict the selection to only 30 days if aggregationType is hourly
    if (aggregationType === AggregationType.hourly) {
      const { startDate, endDate } = selectedRange;
      const diff = differenceInDays(endDate, startDate);
      setIsValidRange(diff <= 30);
    }
    // No restriction for daily aggregationType
    else {
      if (isValidRange === false) setIsValidRange(!isValidRange);
    }
  }

  // Method to handle date range selection changes
  const handleSelect = (ranges) => {
    if (!ranges) return;

    checkValidRange(ranges.selection)
    setSelectedRange([ranges.selection]);
  };

  useEffect(() => {
    checkValidRange(selectedRange[0]);
  }, [aggregationType]);

  // Send query request to backend when APPLY button is clicked
  // Check if a new date range is selected as well
  const handleApplyButtonClick = (event) => {
    if (!isValidRange) return;

    event.stopPropagation(); // Prevents Paper onClick from firing

    const newUrl = getApiUrl({
      endpoint: EndPoints.historicalChart,
      school_id: currentSchoolID,
      aggregationType: aggregationType,
      startDate: selectedRange[0].startDate, // only one range can be selected at a time --> [0]
      endDate: selectedRange[0].endDate
    });


    if (newUrl !== chartUrl) {
      setIsFetchingData(true);

      // Simulate network call with a delay of 1 second
      setTimeout(() => {
        // Update chart data after the delay
        const charts = [...chartData.charts];
        charts[0] = sample; // replace historical chart's data with the new one
        setChartData({
          ...chartData,
          charts: charts
        });
        setChartUrl(newUrl);
        setIsFetchingData(false);
        setShowPickerPanel(false);
      }, 1000);

    }
    // fetchDataFromURL({
    // url: getApiUrl({
    //   endpoint: EndPoints.historicalChart,
    //   school_id: currentSchoolID,
    //   aggregationType: aggregationType,
    //   startDate: selectedRange[0].startDate, // only one range can be selected at a time --> [0]
    //   endDate: selectedRange[0].endDate
    // }),
    //   extension: 'json',
    //   needsAuthorization: true
    // })
    //   .then((data) => {
    //     const charts = [...chartData.charts];
    //     charts[0] = data; // replace historical chart's data with the new one
    //     setChartData({
    //       ...chartData,
    //       charts: charts
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
      <Stack direction={"column"} alignItems={"end"} spacing={smallScreen === true && 1}>
        <DateRangePicker
          ranges={selectedRange}
          onChange={handleSelect}
          staticRanges={
            createStaticRanges(
              returnCustomStaticRanges({
                today, minDateOfDataset, smallScreen, aggregationType
              })
            )
          }
          inputRanges={[]}
          rangeColors={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.text.secondary]}
          minDate={minDateOfDataset}
          maxDate={today}
          months={smallScreen ? 1 : 2}
          showMonthAndYearPickers={false}
          scroll={{
            enabled: true
          }}
          direction={"horizontal"}
          fixedHeight={true}
          preventSnapRefocus={true}
          calendarFocus="backwards"
          startDatePlaceholder="Start Date"
          endDatePlaceholder="End Date"
          editableDateInputs={true}
        />

        {showPickerPanel && (
          <Stack
            direction="column"
            alignItems="end"
            width="100%"
            spacing={1}
            sx={{
              marginTop: smallScreen === false && "-3rem"
            }}
          >
            <AggregationTypeToggle
              aggregationType={aggregationType}
              setAggregationType={setAggregationType}
              smallScreen={smallScreen}
            />
            <Stack direction="row" spacing={1}>
              {
                isValidRange === false && displayErrorMessage()
              }
              <Button
                variant="contained"
                size="small"
                disabled={!isValidRange}
                onClick={handleApplyButtonClick}
                sx={{
                  zIndex: 100000,
                  transform: smallScreen === true && "translateY(-1px)"
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

const displayErrorMessage = () => {
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
      HOURLY data is limited to max 30 days
    </Alert>
  )
}

export default CustomDateRangePicker;
