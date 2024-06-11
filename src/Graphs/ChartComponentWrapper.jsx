import { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab, useMediaQuery, Typography, Menu, MenuItem, Stack, Skeleton } from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { fetchDataFromURL } from "../Components/DatasetDownload/DatasetFetcher";
import { ChartEndpoints, ChartEndpointsOrder, getChartApiUrl, getCorrelationChartApiUrl, getHistoricalChartApiUrl } from "../Utils/ApiUtils";
import { DashboardContext } from "../ContextProviders/DashboardContext";
import { YearRangeProvider } from '../ContextProviders/YearRangeContext';

import SubChart from './Subchart/SubChart';

import CollapsibleSubtitle from '../Components/CollapsibleSubtitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataTypeDropDownMenu from './Subchart/SubchartUtils/DataTypeDropDown';
import { isValidArray } from '../Utils/Utils';
import { useDateRangePicker } from '../ContextProviders/DateRangePickerContext';
import { returnFormattedDates } from '../Components/DateRangePicker/DateRangePickerUtils';
import { useAxesPicker } from '../ContextProviders/AxesPickerContext';

const debounceMilliseconds = 100;

const maxTabsToDisplay = 3;
const initialDropdownMenuTabIndex = -1;

const ChartStyleWrapper = styled(Box)(({ theme }) => ({
  // CSS for dark theme only
  ...(theme.palette.mode === 'dark' && {
    // De-saturate a bit
    filter: 'saturate(0.85)',
    // Invert iframe
    '& .heat-map-iframe': {
      filter: 'invert(0.848) hue-rotate(180deg)',
    }
  }),
  // Center Calendar chart in wrapper
  '& .Calendar [dir]:not(:empty)': {
    margin: 'auto'
  },

  // add horizontal scrollbar to Calendar charts
  '& .Calendar > div > div:last-of-type > div': {
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarGutter: 'stable'
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabScrollButton-root': {
    color: theme.palette.text.primary
  },
  '& .MuiTab-root': {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.625rem',
      padding: theme.spacing(0.5)
    },
  },
  '& .MuiSvgIcon-root ': {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    }
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '& .MuiBox-root ': {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    },
  }
}));

// eslint-disable-next-line max-len
function ChartComponentWrapper(props) {
  const {
    chartTitle,
    generalChartSubtitle,
    generalChartReference,
    chartData: passedChartData,
    chartHeight: passedChartHeight,
    chartID,
    chartIndex,
    isHomepage
  } = props;

  const { currentSchoolID, setIndividualChartData } = useContext(DashboardContext);

  const isSmallWidth = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  let chartMaxHeight;
  let chartHeight = passedChartHeight;
  const chartData = passedChartData;

  // Props for tab panels (multiple data visualizations in the same chart area, navigate with tab panels)
  const [currentTab, setCurrentTab] = useState(0); // start with the first tab
  const [previousTab, setPreviousTab] = useState(0); // keep tracking of previous tab to keep displaying it if the currentTab = -1 (selecting the dropdown menu tab)
  const [dropdownMenuTabIndex, setDropdownMenuTabIndex] = useState(initialDropdownMenuTabIndex);
  const [dropdownMenuCurrentTitle, setDropdownMenuCurrentTitle] = useState();
  const [anchorEl, setAnchorEl] = useState(null); // Define anchorEl state for dropdown menu of the tabs

  // Props for dataType management
  const { allowedDataTypes } = chartData;
  const [selectedDataType, setSelectedDataType] = useState(null);

  // Retrieve the dateRange for chart with DateRangePicker
  const { dateRange, aggregationType } = useDateRangePicker();

  // Retrieve the hAxis and vAxis for chart with AxesPicker
  const { hAxis, vAxis } = useAxesPicker();

  useEffect(() => {
    setSelectedDataType(chartData.selectedDataType)
  }, [chartData]);

  const fetchChartDataType = async (dataType) => {
    const endpoint = ChartEndpointsOrder[chartID];
    let url;
    if (endpoint === ChartEndpoints.historical) {
      const { startDate, endDate } = dateRange || {};
      if (!startDate || !endDate) return;

      const formattedDates = returnFormattedDates({
        startDateObject: startDate,
        endDateObject: endDate
      });
      url = getHistoricalChartApiUrl({
        endpoint: endpoint,
        school_id: currentSchoolID,
        startDate: formattedDates.startDate,
        endDate: formattedDates.endDate,
        aggregationType: aggregationType,
        dataType: dataType
      })
    }
    else if (endpoint === ChartEndpoints.correlationDailyAverage) {
      url = getCorrelationChartApiUrl({
        endpoint: ChartEndpoints.correlationDailyAverage,
        school_id: currentSchoolID,
        dataType: dataType,
        sensorX: hAxis,
        sensorY: vAxis
      });
    }
    else {
      url = getChartApiUrl({
        endpoint: endpoint,
        school_id: currentSchoolID,
        dataType: dataType
      });
    }
    if (!url) return;

    fetchDataFromURL({
      url: url,
      extension: 'json',
      needsAuthorization: true
    })
      .then(data => {
        setIndividualChartData(chartID, data);
        setSelectedDataType(data.selectedDataType);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // eventListener for window resize
  // redraw "Calendar" charts and charts with a time filter upon window resize.
  // Filter & Calendar charts are not automatically respnsive, so we have to redraw them.
  // redraw other charts when device orientation changes
  useEffect(() => {
    let timeoutID = null;

    const handleWindowResize = () => {
      clearTimeout(timeoutID);

      // debounce before triggering re-render. as user is resizing window, the state could
      // change multiple times causing many expensive rerenders. we try to rerender at the
      // end of the resize.
      timeoutID = setTimeout(() => {
        // Redraw all charts on device orientation change, as the chartWrapperHeights
        // have changed.
        setIsPortrait(window.matchMedia('(orientation: portrait)').matches);

        // Redraw all charts on window resized
        setWindowSize([window.innerWidth, window.innerHeight]);
      }, debounceMilliseconds);
    };

    // listen to window resize events
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [chartData]);

  // set tab back to 0 if school is changed
  useEffect(() => {
    setPreviousTab(currentTab);
    setCurrentTab(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSchoolID])

  if (chartData.chartType !== 'Calendar' && !chartHeight) {
    chartHeight = isPortrait ? '80vw' : '35vw';
    chartMaxHeight = isPortrait ? '800px' : '500px';
  }

  // Function to render only one chart (no subchart --> no tab control)
  const renderOnlyOneChart = () => {
    return (
      <SubChart
        selectedDataType={selectedDataType}
        allowedDataTypes={allowedDataTypes}
        chartData={chartData}
        isPortrait={isPortrait}
        isHomepage={isHomepage}
        windowSize={windowSize}
        height={chartData.height ? chartData.height : chartHeight}
      />
    );
  }

  // Function to render multiple subcharts with tab control
  const renderMultipleSubcharts = () => {
    // Handle tab change
    const handleTabChange = (__, newIndex) => {
      setPreviousTab(currentTab);
      setCurrentTab(newIndex);

      if (needsDropdownMenu && newIndex < maxTabsToDisplay && newIndex !== dropdownMenuTabIndex) {
        setDropdownMenuCurrentTitle();
        setDropdownMenuTabIndex(initialDropdownMenuTabIndex);
      }
    };

    // Determine if dropdown menu is needed
    const needsDropdownMenu = chartData.subcharts.length > maxTabsToDisplay + 1; // maxTabsToDisplay = 3 by default, but here +1 for some leeway, some schools have 4 sensors which is still okay. But if > 4, then only display max 3

    const subchartsDataForTabs = needsDropdownMenu ? chartData.subcharts.slice(0, maxTabsToDisplay) : chartData.subcharts;
    const subchartsDataForDropDownMenu = needsDropdownMenu ? chartData.subcharts.slice(maxTabsToDisplay) : null;

    // Function to handle selection from dropdown menu
    const handleDropdownMenuSelection = (index) => {
      setPreviousTab(currentTab);

      // Because the original chartData.subcharts array was split in subchartsDataForTabs (length maxTabsToDisplay) and subchartsDataForDropDownMenu (the remaining item), the selected subcharts index is the sum of the length of subchartsDataForTabs array and the index of the selected item from subchartsDataForDropDownMenu
      setCurrentTab(maxTabsToDisplay + index);

      // Same index with the one above to keep the dropdown menu tab highlighted  
      setDropdownMenuTabIndex(maxTabsToDisplay + index);

      // Set title of the selected item in the dropdown menu to display it
      setDropdownMenuCurrentTitle(subchartsDataForDropDownMenu[index].subchartTitleShort);

      // Close the dropdown menu after selection
      setAnchorEl(null);
    };

    const getOtherLocationsLabel = () => {
      return (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Box flex={1}>
            Other sensors
            {
              dropdownMenuCurrentTitle && ` (${dropdownMenuCurrentTitle})`
            }
            &nbsp;
          </Box>
          < ExpandMoreIcon />
        </Stack>
      )
    }

    const shouldDisplayThisSubchart = (index) => {
      if (currentTab === initialDropdownMenuTabIndex) {
        return previousTab === index;
      } else {
        return currentTab === index;
      }
    }

    return (
      <>
        <StyledTabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isSmallWidth ? 'fullWidth' : 'standard'}
        >
          {subchartsDataForTabs.map((_, index) => (
            <Tab
              key={index}
              value={index}
              label={chartData.subcharts[index].subchartTitle}
              sx={{
                // If this subchart doesn't have a valid dataArray to render chart
                // Make the Tab's text line-through to let user know
                textDecoration: !isValidArray(chartData.subcharts[index].dataArray) && 'line-through'
              }}
            />
          ))}
          {/* Render dropdown menu if needed */}
          {needsDropdownMenu && (
            <Tab
              value={dropdownMenuTabIndex}
              label={getOtherLocationsLabel()}
              aria-controls="submenu"
              aria-haspopup="true"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            />
          )}
        </StyledTabs>
        {
          needsDropdownMenu && <Menu
            id="submenu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              // Reset currentTab to the previous valid tab if the user opened the menu (clicked on the drop down menu tab), but didn't select any menu item
              if (currentTab === initialDropdownMenuTabIndex) {
                setPreviousTab(currentTab);
                setCurrentTab(previousTab);
              };

              // Close the menu
              setAnchorEl(null);
            }}
          >
            {/* Render remaining subchart selector in the dropdown menu */}
            {subchartsDataForDropDownMenu.map((_, index) => (
              <StyledMenuItem
                key={index}
                selected={index === currentTab - maxTabsToDisplay}
                onClick={() => handleDropdownMenuSelection(index)}
                sx={{
                  // If this subchart doesn't have a valid dataArray to render chart
                  // Make the Tab's text line-through to let user know
                  textDecoration: !isValidArray(chartData.subcharts[index + maxTabsToDisplay].dataArray) && 'line-through'
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Box>
                    {subchartsDataForDropDownMenu[index].subchartTitle}
                  </Box>
                  {
                    (index === currentTab - maxTabsToDisplay) &&
                    <VisibilityIcon fontSize="1rem" sx={{ color: 'text.secondary' }} />
                  }
                </Stack>
              </StyledMenuItem>
            ))}
          </Menu>
        }

        <Box
          position="relative"
          sx={{
            overflowX: isPortrait && 'auto',
            WebkitOverflowScrolling: isPortrait && 'touch',
            overflowY: 'hidden',
          }}
        >

          {chartData.subcharts.map((__, index) => (
            <Box
              key={index}
              width="100%"
              height="100%"
              role="tabpanel"
              sx={{
                transition: '0.35s',
                position: (index === 0) ? '' : 'absolute',
                opacity: shouldDisplayThisSubchart(index) ? '1' : '0',
                pointerEvents: shouldDisplayThisSubchart(index) ? 'auto' : 'none',
                top: (index === 0) ? '' : 0,
              }}
            >
              <SubChart
                selectedDataType={selectedDataType}
                allowedDataTypes={allowedDataTypes}
                chartData={chartData}
                subchartIndex={index}
                isPortrait={isPortrait}
                isHomepage={isHomepage}
                windowSize={windowSize}
                height={chartData.height ? chartData.height : chartHeight}
                maxHeight={
                  ['Calendar'].includes(chartData.chartType)
                    ? ''
                    : chartMaxHeight
                }
                currentSubchart={currentTab}
              />
            </Box>
          ))}
        </Box>
      </>
    )
  };

  // Function to render remaining subtitles and references for chart with multiple subcharts
  const getSubtitles = () => {
    let text = generalChartSubtitle || '';
    if (chartData.subcharts && chartData.subcharts[currentTab]?.subchartSubtitle) {
      text += '<br/>'
      text += chartData.subcharts[currentTab].subchartSubtitle;
    }
    return text;
  }
  const getReferences = () => {
    let text = generalChartReference || '';
    if (chartData.subcharts && chartData.subcharts[currentTab]?.reference) {
      text += '<br/>'
      text += chartData.subcharts[currentTab].reference;
    }
    return text;
  }

  return (
    chartTitle ?
      <>
        <Box>
          <Typography display="inline" variant="h6" color="text.primary">
            {chartIndex + 1}. {chartTitle}
            &nbsp;
          </Typography>
          <Box display="inline">
            <DataTypeDropDownMenu
              selectedDataType={selectedDataType}
              dataTypes={allowedDataTypes}
              fetchChartDataType={fetchChartDataType}
            />
          </Box>
        </Box>


        <ChartStyleWrapper height="100%">
          <YearRangeProvider>
            {chartData.subcharts ? renderMultipleSubcharts() : renderOnlyOneChart()}
          </YearRangeProvider>

          {/* Render subtitle and reference below */}
          <Box sx={{ my: 3 }}>
            <Typography
              component="div"
              variant="body1"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              <CollapsibleSubtitle
                text={getSubtitles()}
                reference={getReferences()}
              />
            </Typography>
          </Box>
        </ChartStyleWrapper>
      </>

      : <>
        <Skeleton variant='text' sx={{ width: '100%', fontSize: '2rem' }} />
        <Skeleton variant='rounded' width="100%" height={300} />
      </>
  );
}

export default ChartComponentWrapper;
