import { Slider, colors, Stack, TextField, Grid, Typography } from '@mui/material';
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

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    setSliderRangeMin(invertSelection ? value : min);
    setSliderRangeMax(invertSelection ? max : value);
  }, [invertSelection, value]);

  const handleSliderChange = (event, newValue) => {
    const val = newValue[invertSelection ? 0 : 1];

    setSliderRangeMin(invertSelection ? val : min);
    setSliderRangeMax(invertSelection ? max : val);

    handleChange(val);
  };

  const handleInputChange = (event) => {
    const val = event.target.value === '' ? '' : Number(event.target.value);

    if (val !== '' && (val >= min && val <= max)) {
      setSliderRangeMin(invertSelection ? val : min);
      setSliderRangeMax(invertSelection ? max : val);

      handleChange(val);

      setError(false);
      setHelperText('');
    } else {
      setError(true);
      setHelperText(`Threshold must be between ${min} and ${max}`);
    }
  };

  const stripedGradient = `repeating-linear-gradient(-45deg, ${colors.grey[800]}, ${colors.grey[800]} 4px, ${colors.common.white} 4px, ${colors.common.white} 8px)`;

  return (
    <>
      <Grid container item xs="auto" alignItems="stretch" spacing={0.5}>
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


      <Grid item xs={12} sx={{ mt: 2 }}>
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
          valueLabelDisplay={"off"}
          orientation="vertical"
          sx={{
            height: 300,
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
            '& .MuiSlider-mark': {
              width: '2rem',
              height: '2px',
              color: colors.common.white,
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
            '& .MuiSlider-markLabel': {
              color: theme.palette.text.primary,
              fontWeight: 500,
              textDecoration: 'underline'
            },
            '& .MuiSlider-markLabelActive': {
              color: theme.palette.text.secondary,
              fontWeight: 'inherit',
              textDecoration: 'inherit'
            }
          }} />
      </Grid>
    </>
  );
};

