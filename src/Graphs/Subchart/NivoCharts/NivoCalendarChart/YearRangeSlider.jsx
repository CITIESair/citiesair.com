import { Box, Slider } from "@mui/material";
import { useYearRange } from "../../../../ContextProviders/YearRangeContext";
import { useEffect, useState } from "react";

const YearRangeSlider = (props) => {
  const { dateRange, isPortrait } = props;

  const { yearRange, setYearRange } = useYearRange();

  const [shouldDisplaySlider, setShouldDisplaySlider] = useState(false);
  const [sliderMarks, setSliderMarks] = useState([]);

  useEffect(() => {
    if (!dateRange.max || !dateRange.min) return;
    // Get the number of years we have data for and the number of years to display
    const lastYear = new Date(dateRange.max).getFullYear();
    const firstYear = new Date(dateRange.min).getFullYear();
    const firstVisibleYear = isPortrait ? lastYear - 3 : lastYear - 2; // initially display 3 years in landscape and 4 years in portrait

    setYearRange([firstVisibleYear, lastYear]);

    const marks = Array.from(
      { length: lastYear - firstYear + 1 },
      (_, i) => ({ value: firstYear + i, label: firstYear + i })
    );
    setSliderMarks(marks);

    setShouldDisplaySlider((firstYear <= lastYear - 2));
  }, [dateRange]);


  return (
    shouldDisplaySlider ? (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mt: isPortrait ? 1 : 2,
          mb: isPortrait ? 3 : 4,
          position: 'sticky',
          left: 0,
        }}>
        <Slider
          value={yearRange}
          min={new Date(dateRange.min).getFullYear()}
          max={new Date(dateRange.max).getFullYear()}
          onChange={(event, newValue) => setYearRange(newValue)}
          valueLabelDisplay="off"
          aria-labelledby="calendar-chart-year-slider"
          marks={sliderMarks}
          size='small'
          sx={{ width: '75%' }}
        />
      </Box>
    ) : null
  )
};

export default YearRangeSlider;