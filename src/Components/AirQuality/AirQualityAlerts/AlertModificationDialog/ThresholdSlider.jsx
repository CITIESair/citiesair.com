import { Slider, colors, Grid, Input } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

  const [sliderValue, setSliderValue] = useState(value);
  const [sliderValueForInvertSelection, setSliderValueForInvertSelection] = useState(
    returnInvertedValue({ val: value, min, max })
  );

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(invertSelection ? returnInvertedValue({ val: newValue, min, max }) : newValue);
  };

  const handleInputChange = (event) => {
    setSliderValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  useEffect(() => {
    setSliderValueForInvertSelection(
      returnInvertedValue({ val: sliderValue, min, max })
    );
  }, [sliderValue]);

  const handleBlur = () => {
    // Clamp inputted value between min and max
    setSliderValue(
      Math.min(max,
        Math.max(min, invertSelection ? invertSelection : sliderValue)
      )
    );
  };

  const stripedGradient = `repeating-linear-gradient(-45deg, ${colors.grey[800]}, ${colors.grey[800]} 4px, ${colors.common.white} 4px, ${colors.common.white} 8px)`;

  const directionTheme = useMemo(() => createTheme({ direction: invertSelection ? 'rtl' : 'ltr' }),
    [invertSelection]
  );

  return (
    <ThemeProvider theme={directionTheme}>
      <Grid container spacing={showInput ? 2 : 0} alignItems="center">
        <Grid item xs>
          <Slider
            dir={invertSelection ? "rtl" : "ltr"}
            aria-label="Alert Threshold Slider"
            aria-labelledby="input-threshold-slider"
            value={invertSelection ? sliderValueForInvertSelection || defaultValue : sliderValue || defaultValue}
            defaultValue={defaultValue}
            step={marks === null ? "1" : null} // only allow discrete equal step if marks are not provided
            marks={marks}
            disabled={disabled}
            min={min}
            max={max}
            onChange={handleSliderChange}
            valueLabelDisplay={"off"}
            sx={{
              '& *': {
                transition: 'none !important'
              },
              '& .MuiSlider-thumb': {
                width: '4px',
                borderRadius: 1,
                color: colors.common.black
              },
              '& .MuiSlider-mark': {
                width: '2px',
                height: '1rem',
                color: colors.common.white,
              },
              '& .MuiSlider-thumb, .MuiSlider-mark': {
                transform: `translate(${invertSelection ? "50%" : "-50%"},-50%)`
              },
              '& .MuiSlider-rail, .MuiSlider-track': {
                height: '1rem',
                opacity: 0.75,
                border: 'none'
              },
              '& .MuiSlider-rail': {
                background: backgroundCssGradient,
              },
              '& .MuiSlider-track': {
                background: stripedGradient,
                ...(invertSelection ? {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                } : {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                })
              },
              '& .MuiSlider-markLabel': {
                // transform: 'rotateZ(45deg)',
                // transformOrigin: 'top left',
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
        {showInput ? (
          <Grid item>
            <Input
              value={sliderValue}
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
          </Grid>
        ) : null}
      </Grid>

    </ThemeProvider>
  );
};

export const returnInvertedValue = ({ val, min, max }) => {
  if (val === null || min === null || max === null) return;

  return max - val + min;
};

