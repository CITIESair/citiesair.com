import { Slider, colors, TextField, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

export const ThresholdSlider = (props) => {
  const {
    min = 0,
    max = 100,
    value,
    defaultValue,
    stepsForThreshold = 10,
    marks = null,
    handleChange,
    disabled,
    backgroundCssGradient,
    invertSelection = false,
    showInput = true,
    inputUnit
  } = props;

  const theme = useTheme();

  // sliderValue is an array
  const [sliderRangeMin, setSliderRangeMin] = useState(invertSelection ? value || defaultValue : min);
  const [sliderRangeMax, setSliderRangeMax] = useState(invertSelection ? max : value || defaultValue);
  const [nearestDataIndex, setNearestDataIndex] = useState(-1);

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    const localSliderRangeMin = invertSelection ? value : min;
    const localSliderRangeMax = invertSelection ? max : value;
    setSliderRangeMin(localSliderRangeMin);
    setSliderRangeMax(localSliderRangeMax);

    setNearestDataIndex(findNearestDataIndex(invertSelection ? localSliderRangeMin : localSliderRangeMax));
  }, [invertSelection, value, max, min]);

  const handleSliderChange = (event, newValue) => {
    const val = newValue[invertSelection ? 0 : 1];

    setSliderRangeMin(invertSelection ? val : min);
    setSliderRangeMax(invertSelection ? max : val);

    handleChange(val);
    setNearestDataIndex(findNearestDataIndex(val));
  };

  const handleInputChange = (event) => {
    const val = event.target.value === '' ? '' : Number(event.target.value);

    if (val !== '' && (val >= min && val <= max)) {
      setSliderRangeMin(invertSelection ? val : min);
      setSliderRangeMax(invertSelection ? max : val);

      handleChange(val);
      setNearestDataIndex(findNearestDataIndex(val));

      setError(false);
      setHelperText('');
    } else {
      setError(true);
      setHelperText(`Threshold must be between ${min} and ${max}`);
    }
  };

  const findNearestDataIndex = (val) => {
    if (!marks) return -1;

    // Filter marks to get those with values greater than currentVal
    const greaterMarks = marks.filter(mark => mark.value >= val);

    // If no marks are greater, return -1
    if (greaterMarks.length === 0) {
      return -1;
    }

    // Find the mark with the nearest value greater than val
    const nearestMark = greaterMarks.reduce((prev, curr) => {
      return (curr.value - val) < (prev.value - val) ? curr : prev;
    });

    // Return the index of the nearest mark in the original marks array
    const index = marks.indexOf(nearestMark)
    return invertSelection ? index - 1 : index;
  }

  const stripedGradient = `repeating-linear-gradient(-45deg, ${colors.grey[800]}, ${colors.grey[800]} 4px, ${colors.common.white} 4px, ${colors.common.white} 8px)`;

  return (
    <>
      <Grid container item xs="auto" alignItems="end" spacing={0.5}>
        <Grid item xs="auto" minWidth="4.5rem">
          {showInput ? (
            <TextField
              variant='standard'
              type="number"
              label="Threshold"
              value={invertSelection ? sliderRangeMin : sliderRangeMax}
              onChange={handleInputChange}
              error={error}
              helperText={helperText}
              size='small'
              fullWidth
              disabled={disabled}
              inputProps={{
                step: stepsForThreshold,
                min,
                max,
                type: 'number',
                'aria-labelledby': 'input-threshold-slider'
              }}
            />
          ) : null}
        </Grid>

        {
          inputUnit ? (
            <Grid item>
              <Typography variant='body2'>
                {inputUnit}
              </Typography>
            </Grid>
          ) : null
        }
      </Grid>


      <Grid item xs={12} sx={{ mt: 2, ml: 6 }}>
        <Slider
          aria-label="Alert Threshold Slider"
          aria-labelledby="input-threshold-slider"
          value={[sliderRangeMin, sliderRangeMax]}
          defaultValue={[sliderRangeMin, sliderRangeMax]}
          step={marks === null ? stepsForThreshold : null} // only allow discrete equal step if marks are not provided
          marks={marks}
          disabled={disabled}
          min={min}
          max={max}
          onChange={handleSliderChange}
          valueLabelDisplay="on"
          orientation="vertical"
          sx={{
            height: "35vh",
            minHeight: "250px",
            maxHeight: "500px",
            cursor: disabled ? 'not-allowed' : 'inherit',
            pointerEvents: 'all',
            '& *': {
              transition: 'none !important'
            },
            '& .MuiSlider-thumb': {
              width: '2rem',
              height: '4px',
              borderRadius: 1,
              color: colors.common.black,
            },
            [`& .MuiSlider-thumb[data-index="${invertSelection ? 1 : 0}"]`]: {
              display: 'none',
            },
            '& .MuiSlider-mark, .MuiSlider-markActive': {
              width: '2rem',
              height: '3px',
              background: theme.palette.background.paper,
              backgroundImage: theme.palette.background.paperBackgroundGradient
            },
            '& .MuiSlider-thumb, .MuiSlider-mark': {
              transform: `translate(-50%,50%})`
            },
            '& .MuiSlider-rail, .MuiSlider-track': {
              width: '1rem',
              opacity: 0.75,
              border: 'none'
            },
            '& .MuiSlider-rail': {
              background: disabled ? colors.grey[400] : backgroundCssGradient,
            },
            '& .MuiSlider-track': {
              background: stripedGradient,
              ...(invertSelection ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
              } : {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
              })
            },
            [`& .MuiSlider-markLabel, .MuiSlider-markLabel[data-index="${nearestDataIndex}"]`]: {
              color: theme.palette.text.primary,
              fontWeight: 500,
              textDecoration: 'underline',
            },
            '& .MuiSlider-markLabelActive': {
              color: theme.palette.text.secondary,
              fontWeight: 'inherit',
              textDecoration: 'inherit',
            },
            '& .MuiSlider-valueLabel': {
              transform: 'translate(-10px, -50%)',
            }
          }} />
      </Grid>

      <Grid item sx={{ mt: 1 }}>
        <Typography variant='caption' display='block' fontStyle="italic">
          Move the slider to change the alert's threshold value or use the text input box for more precise control.
        </Typography>
      </Grid>
    </>
  );
};

