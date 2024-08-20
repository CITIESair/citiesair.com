import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { generateCssBackgroundGradient } from '../../../../Utils/Gradient/GradientUtils';

const ValueRangeBox = ({ title, valueRange, colorAxis, isPortrait }) => {
  const theme = useTheme();

  if (valueRange?.min === null || valueRange?.max === null) return null;

  const { colors, minValue, maxValue } = colorAxis;
  let rangeBoxMinValue = minValue, rangeBoxMaxValue = maxValue;

  if (minValue === undefined) rangeBoxMinValue = valueRange.min;
  if (maxValue === undefined) rangeBoxMaxValue = valueRange.max;

  if (valueRange.min < rangeBoxMinValue) rangeBoxMinValue = valueRange.min;
  if (valueRange.max > rangeBoxMaxValue) rangeBoxMaxValue = valueRange.max;

  const calculateMarkerPositionOnRangeBox = (value) => {
    const position = ((value - rangeBoxMinValue) / (rangeBoxMaxValue - rangeBoxMinValue)) * 100;
    return `${position}%`;
  };

  const labelStyle = {
    position: 'absolute',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1,
    textAlign: 'center',
    transform: 'translateX(-50%)',
    minWidth: '75px',
    whiteSpace: 'nowrap',
  };
  const topLabelStyle = {
    top: '-1.5rem',
    transform: 'translateX(-50%)'
  };
  const bottomLabelStyle = {
    bottom: '-1.25rem',
    transform: isPortrait ? 'translateX(-100%)' : 'translateX(-50%)'
  };

  const triangleStyle = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '0.25rem solid transparent',
    borderRight: '0.25rem solid transparent',
    transform: 'translateX(-50%)',
  };
  const topTriangleStyle = {
    top: '-0.5rem',
    borderTop: `0.25rem solid ${theme.palette.text.secondary}`
  };
  const bottomTriangleStyle = {
    bottom: '-0.5rem',
    borderBottom: `0.25rem solid ${theme.palette.text.secondary}`
  };

  return (
    <Box sx={{
      position: 'sticky',
      width: 'fit-content',
      my: 4,
      float: 'right',
      right: (isPortrait ? '0' : '50px')
    }}>
      <Typography sx={{
        display: 'inline',
        position: 'absolute',
        textAlign: 'right',
        transform: 'translateX(calc(-100% - 0.5rem))',
        fontSize: '0.75rem',
        lineHeight: 1.25,
        fontWeight: 500,
        color: 'text.secondary'
      }}>
        {title}
      </Typography>
      <Box sx={{
        background: generateCssBackgroundGradient({ gradientDirection: 'to right', colors: colors, optionalMaxValue: rangeBoxMaxValue }),
        color: theme.palette.text.secondary,
        border: `1px solid ${theme.palette.text.secondary}`,
        width: isPortrait ? '250px' : '300px',
        height: '1rem',
        position: 'relative',
        justifyContent: 'space-between',
      }}>
        <span style={{ ...labelStyle, ...topLabelStyle, left: calculateMarkerPositionOnRangeBox(valueRange.min) }}>min: {Math.round(valueRange.min)}</span>
        <span style={{ ...labelStyle, ...bottomLabelStyle, left: calculateMarkerPositionOnRangeBox(valueRange.max) }}>max: {Math.round(valueRange.max)}</span>
        <div style={{ ...triangleStyle, ...topTriangleStyle, left: calculateMarkerPositionOnRangeBox(valueRange.min) }}></div>
        <div style={{ ...triangleStyle, ...bottomTriangleStyle, left: calculateMarkerPositionOnRangeBox(valueRange.max) }}></div>
      </Box>
    </Box>
  );
};

export default ValueRangeBox;