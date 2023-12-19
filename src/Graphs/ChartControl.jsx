import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab, useMediaQuery, Typography } from '@mui/material/';

import SubChart from './Subchart/SubChart';

import CollapsibleSubtitle from './../Components/CollapsibleSubtitle';
import { index } from 'd3';

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
function ChartControl(props) {
  const {
    generalChartSubtitle,
    generalChartReference,
    chartData: passedChartData,
    chartHeight: passedChartHeight,
    isHomepage
  } = props;
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

  // eventListener for window resize
  // redraw "Calendar" charts and charts with a time filter upon window resize.
  // Filter & Calendar charts are not automatically respnsive, so we have to redraw them.
  // redraw other charts when device orientation changes
  useEffect(() => {
    setCurrentTab(0); // set tab back to 0 if chartData changes (changed school)

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

  // Handle tab change
  const handleChange = (__, newValue) => {
    setCurrentTab(newValue);
  };

  // Function to render only one chart (no subchart --> no tab control)
  const renderOnlyOneChart = () => {
    return (
      <SubChart
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
    return (
      <>
        <StyledTabs
          value={currentTab}
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
                opacity: currentTab === index ? '1' : '0',
                pointerEvents: currentTab === index ? 'auto' : 'none',
                top: (index === 0) ? '' : 0,
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
                  ['Calendar'].includes(chartData.chartType)
                    ? ''
                    : chartMaxHeight
                }
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
    <ChartStyleWrapper height="100%">
      {chartData.subcharts ? renderMultipleSubcharts() : renderOnlyOneChart()}

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
  );
}

export default ChartControl;
