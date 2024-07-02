import { Slider, colors, Stack, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

export const ThresholdSlider = (props) => {
  const {
    min = 0,
    max = 100,
    value,
    defaultValue,
    marks = null,
    handleChange,
    disabled,
    backgroundCssGradient,
    invertSelection,
    showInput = true
  } = props;

  const theme = useTheme();

  // sliderValue is an array
  const [sliderValue, setSliderValue] = useState([
    invertSelection ? value : min,
    invertSelection ? max : value
  ]);

  useEffect(() => {
    setSliderValue([
      invertSelection ? sliderValue[1] : min,
      invertSelection ? max : sliderValue[0]
    ]);
  }, [invertSelection]);

  useEffect(() => {
    console.log(sliderValue)

  }, [sliderValue])

  const handleSliderChange = (event, newValue) => {
    const val = newValue[invertSelection ? 0 : 1];

    setSliderValue([
      invertSelection ? val : min,
      invertSelection ? max : val
    ]);
  };

  const handleInputChange = (event) => {
    const val = event.target.value === '' ? '' : Number(event.target.value);

    setSliderValue([
      invertSelection ? val : min,
      invertSelection ? max : val
    ]);
  };

  const handleBlur = () => {
    // Clamp inputted value between min and max
    const clampFunction = (val) => {
      return Math.min(max, Math.max(min, val))
    }
    setSliderValue(prev => [clampFunction(prev[0]), clampFunction(prev[1])]);
  };

  const stripedGradient = `repeating-linear-gradient(-45deg, ${colors.grey[800]}, ${colors.grey[800]} 4px, ${colors.common.white} 4px, ${colors.common.white} 8px)`;

  return (
    <Stack
      spacing={showInput ? 2 : 0}
      alignItems="start"
      height={300}
    >
      {showInput ? (
        <Input
          value={sliderValue[invertSelection ? 0 : 1]}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min,
            max,
            type: 'number',
            'aria-labelledby': 'input-threshold-slider'
          }} />
      ) : null}

      <Slider
        aria-label="Alert Threshold Slider"
        aria-labelledby="input-threshold-slider"
        value={sliderValue || defaultValue}
        defaultValue={[
          invertSelection ? defaultValue : min,
          invertSelection ? max : defaultValue
        ]}
        step={marks === null ? "1" : null} // only allow discrete equal step if marks are not provided
        marks={marks}
        disabled={disabled}
        min={min}
        max={max}
        onChange={handleSliderChange}
        valueLabelDisplay={"off"}
        orientation="vertical"
        sx={{
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
            background: backgroundCssGradient,
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
    </Stack>
  );
};

