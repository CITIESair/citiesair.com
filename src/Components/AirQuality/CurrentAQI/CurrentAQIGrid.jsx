import { Grid, Skeleton, Stack } from '@mui/material';

import { CurrentAQIGridSize, ElementSizes } from './CurrentAQIGridSize';
import CurrentAQISingleSensor from './CurrentAQISingleSensor';
import { useNetworkStatusContext } from '../../../ContextProviders/NetworkStatusContext';

const CurrentAQIGrid = (props) => {
  const {
    currentSensorsData,
    isScreen = false,
    showWeather = true,
    showWeatherText = false,
    showHeatIndex = true,
    showLastUpdate = true,
    showAQI = true,
    showRawMeasurements = true,
    useLocationShort = false,
    roundTemperature = false,
    firstSensorOwnLine = false,
    size = CurrentAQIGridSize.medium
  } = props;

  const getGridItemSizes = ({ itemIndex, numOfItems }) => {
    return {
      xs: (itemIndex === 0 && firstSensorOwnLine) ? 12 : Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: size === CurrentAQIGridSize.large ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 2))
    }
  }

  // Do not render anything if the server is down
  const { isServerDown } = useNetworkStatusContext();
  if (isServerDown) return null;

  if (!currentSensorsData) {
    return (
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Skeleton variant='text' sx={{ width: '15rem', fontSize: '2rem' }} />
        <Skeleton variant='text' sx={{ width: '5rem', fontSize: '4rem', my: -1.5 }} />
        <Skeleton variant='text' sx={{ width: '10rem', fontSize: '2rem' }} />
        <Skeleton variant='text' sx={{ width: '7.5rem', fontSize: '1rem' }} />
        <Skeleton variant='text' sx={{ width: '7.5rem', fontSize: '1rem' }} />
      </Stack>
    )
  }

  return (
    <Grid
      container
      justifyContent="center"
      spacing={1}
      sx={{
        textAlign: "center",
        '& .MuiSvgIcon-root': {
          verticalAlign: 'middle',
          fontSize: ElementSizes[size].icon
        },
        '& *': {
          fontWeight: '500'
        },
        '& .condensedFont': {
          fontFamily: 'IBM Plex Sans Condensed, sans-serif !important',
          '& *': {
            fontFamily: 'IBM Plex Sans Condensed, sans-serif !important'
          }
        }
      }}
    >
      {
        currentSensorsData.map((sensorData, index) => (
          <CurrentAQISingleSensor
            key={index}
            sensor={sensorData.sensor}
            current={sensorData.current}
            isScreen={isScreen}
            size={size}
            showLastUpdate={showLastUpdate}
            showWeather={showWeather}
            showWeatherText={showWeatherText}
            showHeatIndex={showHeatIndex}
            showAQI={showAQI}
            showRawMeasurements={showRawMeasurements}
            useLocationShort={useLocationShort}
            roundTemperature={roundTemperature}
            gridSizes={getGridItemSizes({
              itemIndex: index,
              numOfItems: Object.keys(currentSensorsData).length
            }
            )}
          />
        ))
      }
    </Grid >
  );
};

export default CurrentAQIGrid;
