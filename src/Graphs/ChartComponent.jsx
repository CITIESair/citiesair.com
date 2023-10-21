import { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab, useMediaQuery } from '@mui/material/';
import { TabContext } from '../ContextProviders/TabContext';

import SubChart from './Subchart/SubChart';

const debounceMilliseconds = 100;

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
  // Special CSS for historical-snapshot-aqi chart
  '& .historical-snapshot-aqi svg [clip-path*="ABSTRACT_RENDERER"] > g:nth-of-type(1), .historical-snapshot-aqi [id*="googlechart-control"] svg [clip-path*="ABSTRACT_RENDERER"] > g:nth-of-type(2)': {
    opacity: 0.6
  },
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
      fontSize: '0.75rem',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
  }
}));

// eslint-disable-next-line max-len
function ChartComponent({ chartData: passedChartData, chartHeight: passedChartHeight, isHomepage }) {
  const isSmallWidth = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  let chartMaxHeight;
  let chartHeight = passedChartHeight;
  let chartData = passedChartData;

  // use tab context
  const [_, setTab] = useContext(TabContext);

  // Props for tab panels (multiple data visualizations in the same chart area,
  // navigate with tab panels)
  const [indexValue, setIndexValue] = useState(0); // start with the first elem

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

  if (chartData.chartType !== 'Calendar' && !chartHeight) {
    chartHeight = isPortrait ? '80vw' : '35vw';
    chartMaxHeight = isPortrait ? '800px' : '500px';
  }

  // Assign the subcharts array for HeatMap based on the device orientation
  if (chartData.chartType === 'HeatMap') {
    chartData = {
      ...chartData,
      ...chartData[isPortrait ? 'subchartsPortrait' : 'subchartsLandscape'],
    };
  }

  let renderedComponent;

  // Display multiple subcharts
  // but not in homepage
  if (chartData.subcharts) {
    // Handle tab change
    const handleChange = (__, newValue) => {
      // use setTab to copy the tab object and update the subIndex
      setTab((prevState) => ({ ...prevState, [chartData.chartIndex]: newValue }));
      setIndexValue(newValue);
    };

    // If the chart in in homepage, just display the first subChart
    if (isHomepage) {
      renderedComponent = (
        <SubChart
          chartData={chartData}
          subchartIndex={0}
          isPortrait={isPortrait}
          isHomepage={isHomepage}
          windowSize={windowSize}
          height={chartData.height ? chartData.height : chartHeight}
          maxHeight={
            chartData.chartType === 'HeatMap' ? '' : chartMaxHeight
          }
        />
      );
    } else {
      renderedComponent = (
        <>
          <StyledTabs
            value={indexValue}
            onChange={handleChange}
            variant={isSmallWidth ? 'fullWidth' : 'standard'}
          >
            {chartData.subcharts.map((element, index) => (
              <Tab
                key={index}
                value={index}
                label={chartData.subcharts[index].subchartTitle}
              />
            ))}
          </StyledTabs>
          <Box position="relative">
            {chartData.subcharts.map((__, index) => (
              <Box
                key={index}
                width="100%"
                height="100%"
                role="tabpanel"
                sx={{
                  transition: '0.35s',
                  position: (index === 0) ? '' : 'absolute',
                  opacity: indexValue === index ? '1' : '0',
                  pointerEvents: indexValue === index ? 'auto' : 'none',
                  top: (index === 0) ? '' : 0
                }}
              >
                <SubChart
                  chartData={chartData}
                  subchartIndex={index}
                  isPortrait={isPortrait}
                  isHomepage={isHomepage}
                  windowSize={windowSize}
                  height={chartData.height ? chartData.height : chartHeight}
                  maxHeight={
                    ['HeatMap', 'Calendar'].includes(chartData.chartType)
                      ? ''
                      : chartMaxHeight
                  }
                />
              </Box>
            ))}
          </Box>
        </>
      );
    }
  } else {
    // If there is only one single chart
    renderedComponent = (
      <SubChart
        chartData={chartData}
        isPortrait={isPortrait}
        isHomepage={isHomepage}
        windowSize={windowSize}
        height={chartData.height ? chartData.height : chartHeight}
        maxHeight={
          chartData.chartType === 'HeatMap' ? '' : chartMaxHeight
        }
      />
    );
  }

  return (
    <ChartStyleWrapper height="100%">
      {renderedComponent}
    </ChartStyleWrapper>
  );
}

export default ChartComponent;
