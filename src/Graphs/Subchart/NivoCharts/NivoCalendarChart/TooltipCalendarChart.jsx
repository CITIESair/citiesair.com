import { useEffect, useRef } from 'react';
import { Box, Chip } from '@mui/material';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../../../Utils/UtilFunctions';

const TooltipCalendarChart = ({ day, color, tooltipText, dateRange, inFirstTwoRowsOfChart }) => {
  const tooltipBoxRef = useRef(null);

  // If the cell hovered over is in the first two rows of the chart,
  // move the tooltip to the bottom of the chart
  // Read subsequent comments to understand why we need to do this
  useEffect(() => {
    if (tooltipBoxRef.current && inFirstTwoRowsOfChart(day, dateRange)) {
      const parentDiv = tooltipBoxRef.current.parentElement;
      if (parentDiv) {
        parentDiv.style.top = '11vh';
      }
    }
  }, [tooltipBoxRef, inFirstTwoRowsOfChart]);


  // Note that our Box is just a container 'inside' the tooltip
  // The tooltip itself is actually the Box's parent div
  return (
    <Box ref={tooltipBoxRef} className='nivo-tooltip'>
      <Chip sx={{ backgroundColor: color, mr: 0.5, height: '10px', width: '10px', borderRadius: '50%' }} />
      {parse(tooltipText, { replace: replacePlainHTMLWithMuiComponents })}
    </Box>
  );
};

export default TooltipCalendarChart;