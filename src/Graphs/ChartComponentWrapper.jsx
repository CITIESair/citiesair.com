import { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tab, useMediaQuery, Typography, Menu, MenuItem, Stack, Container } from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { DataTypes } from '../Utils/AirQuality/DataTypes';
import { DashboardContext } from "../ContextProviders/DashboardContext";

import SubChart from './Subchart/SubChart';

import CollapsibleSubtitle from '../Components/CollapsibleSubtitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DataTypeDropDownMenu from './DataTypeDropDown';
import { isValidArray } from '../Utils/UtilFunctions';
import StyledTabs from '../Components/StyledTabs';
import NoChartToRender from './Subchart/NoChartToRender';
import useChartData from '../hooks/useChartData';
import LoadingAnimation from '../Components/LoadingAnimation';

const DEBOUNCE_IN_MILLISECONDS = 100;

const MAX_NUM_TABS_TO_DISPLAY = 3;
const INITIAL_DROPDOWN_MENU_TAB_INDEX = -1;

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

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '& .MuiBox-root ': {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem'
    },
  }
}));

// eslint-disable-next-line max-len
function ChartComponentWrapper({ chartID }) {
  const { data: chartData, isLoading, isFetching, error } = useChartData(chartID);

  const { currentSchoolID } = useContext(DashboardContext);

  const isSmallWidth = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  // Props for tab panels (multiple data visualizations in the same chart area, navigate with tab panels)
  const [currentTab, setCurrentTab] = useState(0); // start with the first tab
  const [previousTab, setPreviousTab] = useState(0); // keep tracking of previous tab to keep displaying it if the currentTab = initialDropdownMenuTabIndex (selecting the dropdown menu tab)
  const [dropdownMenuTabIndex, setDropdownMenuTabIndex] = useState(INITIAL_DROPDOWN_MENU_TAB_INDEX);
  const [dropdownMenuCurrentTitle, setDropdownMenuCurrentTitle] = useState();
  const [anchorEl, setAnchorEl] = useState(null); // Define anchorEl state for dropdown menu of the tabs

  // Props for dataType management
  const [allowedDataTypes, setAllowedDataTypes] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState(null);

  const initializeAllowedDataTypes = (chartData, setAllowedDataTypes, setSelectedDataType) => {
    if (!chartData?.allowedDataTypes) return;

    const dataTypesArr = chartData.allowedDataTypes.map((dataType) => {
      const { name_title, name_short, unit } = DataTypes[dataType];
      return {
        key: dataType,
        name_title,
        name_short,
        unit,
      };
    });

    setAllowedDataTypes(dataTypesArr);
    setSelectedDataType(chartData.selectedDataType);
  };

  const setupResizeListener = (setWindowSize, setIsPortrait, DEBOUNCE_IN_MILLISECONDS) => {
    let timeoutID = null;

    const handleWindowResize = () => {
      clearTimeout(timeoutID);

      timeoutID = setTimeout(() => {
        setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
        setWindowSize([window.innerWidth, window.innerHeight]);
      }, DEBOUNCE_IN_MILLISECONDS);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  };

  useEffect(() => {
    if (!chartData) return;

    // Initialize allowed data types
    initializeAllowedDataTypes(chartData, setAllowedDataTypes, setSelectedDataType);

    // Setup resize listener
    const cleanupResize = setupResizeListener(setWindowSize, setIsPortrait, DEBOUNCE_IN_MILLISECONDS);

    // Cleanup listener on unmount
    return cleanupResize;
  }, [chartData]);

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
      }, DEBOUNCE_IN_MILLISECONDS);
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
  }, [currentSchoolID]);

  let chartHeight, chartMaxHeight;
  if (chartData?.chartType !== 'Calendar') {
    chartHeight = isPortrait ? '80vw' : '35vw';
    chartMaxHeight = isPortrait ? '800px' : '450px';
  }

  // Function to render only one chart (no subchart --> no tab control)
  const renderOnlyOneChart = () => {
    if (!isValidArray(chartData.dataArray)) {
      return <NoChartToRender customMessage={"Not enough historical data to display this chart"} />
    }
    return (
      <SubChart
        selectedDataType={selectedDataType}
        allowedDataTypes={allowedDataTypes}
        chartData={chartData}
        isPortrait={isPortrait}
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

      if (needsDropdownMenu && newIndex < MAX_NUM_TABS_TO_DISPLAY && newIndex !== dropdownMenuTabIndex) {
        setDropdownMenuCurrentTitle();
        setDropdownMenuTabIndex(INITIAL_DROPDOWN_MENU_TAB_INDEX);
      }
    };

    // Determine if dropdown menu is needed
    const needsDropdownMenu = chartData.subcharts.length > MAX_NUM_TABS_TO_DISPLAY + 1; // maxTabsToDisplay = 3 by default, but here +1 for some leeway, some schools have 4 sensors which is still okay. But if > 4, then only display max 3

    const subchartsDataForTabs = needsDropdownMenu ? chartData.subcharts.slice(0, MAX_NUM_TABS_TO_DISPLAY) : chartData.subcharts;
    const subchartsDataForDropDownMenu = needsDropdownMenu ? chartData.subcharts.slice(MAX_NUM_TABS_TO_DISPLAY) : null;

    // Function to handle selection from dropdown menu
    const handleDropdownMenuSelection = (index) => {
      setPreviousTab(currentTab);

      // Because the original chartData.subcharts array was split in subchartsDataForTabs (length maxTabsToDisplay) and subchartsDataForDropDownMenu (the remaining item), the selected subcharts index is the sum of the length of subchartsDataForTabs array and the index of the selected item from subchartsDataForDropDownMenu
      setCurrentTab(MAX_NUM_TABS_TO_DISPLAY + index);

      // Same index with the one above to keep the dropdown menu tab highlighted  
      setDropdownMenuTabIndex(MAX_NUM_TABS_TO_DISPLAY + index);

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
      if (currentTab === INITIAL_DROPDOWN_MENU_TAB_INDEX) {
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
              // Reset currentTab to the previous valid tab if the user opened the menu (clicked on the drop down menu tab, if shown), but didn't select any menu item
              if (currentTab === INITIAL_DROPDOWN_MENU_TAB_INDEX) {
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
                selected={index === currentTab - MAX_NUM_TABS_TO_DISPLAY}
                onClick={() => handleDropdownMenuSelection(index)}
                sx={{
                  // If this subchart doesn't have a valid dataArray to render chart
                  // Make the Tab's text line-through to let user know
                  textDecoration: !isValidArray(chartData.subcharts[index + MAX_NUM_TABS_TO_DISPLAY].dataArray) && 'line-through'
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Box>
                    {subchartsDataForDropDownMenu[index].subchartTitle}
                  </Box>
                  {
                    (index === currentTab - MAX_NUM_TABS_TO_DISPLAY) &&
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
                overflowX: 'auto',
                overflowY: 'hidden',
              }}
            >
              <SubChart
                selectedDataType={selectedDataType}
                allowedDataTypes={allowedDataTypes}
                chartData={chartData}
                subchartIndex={index}
                isPortrait={isPortrait}
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
    let text = chartData.subtitle || '';
    if (chartData.subcharts && chartData.subcharts[currentTab]?.subchartSubtitle) {
      text += '<br/>';
      text += chartData.subcharts[currentTab].subchartSubtitle;
    }
    return text;
  }
  const getReferences = () => {
    let text = chartData.reference || '';
    if (chartData.subcharts && chartData.subcharts[currentTab]?.reference) {
      text += '<br/>';
      text += chartData.subcharts[currentTab].reference;
    }
    return text;
  }

  if (!chartData) return;

  if (isLoading) return <LoadingAnimation optionalText={`Loading chart ${chartID + 1}...`} />;
  if (error) return <NoChartToRender customMessage={`Error loading chart ${chartID + 1}, please try later`} />

  return (
    <Box position="relative">
      <Container>
        <Typography display="inline" variant="h6" color="text.primary">
          {chartID + 1}. {chartData.title}
          &nbsp;
        </Typography>
        <Box display="inline">
          <DataTypeDropDownMenu
            selectedDataType={selectedDataType}
            dataTypes={allowedDataTypes}
            chartID={chartID}
          />
        </Box>
      </Container>

      <ChartStyleWrapper height="100%" sx={{
        filter: isFetching ? 'blur(1px)' : 'none',
        transition: 'filter 0.2s',
        pointerEvents: isFetching ? "none" : "auto",
      }}>
        {isValidArray(chartData.subcharts) ? renderMultipleSubcharts() : renderOnlyOneChart()}

        {/* Render subtitle and reference below */}
        <Container sx={{ my: 3 }}>
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
        </Container>
      </ChartStyleWrapper>

      {isFetching && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: 10,
          }}
        >
          <LoadingAnimation />
        </Box>
      )}
    </Box>
  );
}

export default ChartComponentWrapper;
