// disable eslint for this file
/* eslint-disable */
import { Box, Grid, Typography, Skeleton, Stack } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ErrorIcon from '@mui/icons-material/Error';

import { returnSensorStatus, getFormattedElapsedTimeFromNow } from './AirQualityScreen/ScreenUtils';
import { SensorStatus } from "./SensorStatus";
import { TemperatureUnits, getFormattedTemperature, calculateHeatIndex } from "../../Utils/AirQuality/TemperatureUtils";

import AQIdatabase from '../../Utils/AirQuality/AirQualityIndexHelper';

import CustomThemes from '../../Themes/CustomThemes';

const CurrentAQIGrid = (props) => {
  const {
    currentSensorsData,
    temperatureUnitPreference = TemperatureUnits.celsius,
    isScreen = true,
    showWeather = true,
    showHeatIndex = true,
    showLastUpdate = true,
    useLocationShort = false,
    roundTemperature = false,
    firstSensorOwnLine = false
  } = props;

  const getGridItemSize = ({ itemIndex, numOfItems }) => {

    return {
      xs: (itemIndex === 0 && firstSensorOwnLine) ? 12 : Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: isScreen ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 2))
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        '& .MuiSvgIcon-root': {
          verticalAlign: 'sub',
          fontSize: isScreen ? null : '1rem'
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
        currentSensorsData ?
          (Object.entries(currentSensorsData).map(([key, sensorData], index) => (
            <Grid
              item
              key={key}
              {...getGridItemSize({
                itemIndex: index,
                numOfItems: Object.keys(currentSensorsData).length
              }
              )}
              sx={
                sensorData.current?.sensor_status !== SensorStatus.active &&
                { '& *': { color: `${CustomThemes.universal.palette.inactiveSensor}` } }
              }
            >
              <Box sx={{ '& *': { color: sensorData.current?.color } }}>
                <Typography variant={isScreen ? "h4" : 'h5'} fontWeight="500" className='condensedFont' textTransform="capitalize">
                  {returnLocationName({
                    useLocationShort,
                    location_short: sensorData.sensor?.location_short,
                    location_long: sensorData.sensor?.location_long
                  })}
                </Typography>
                <Typography variant={isScreen ? "h1" : 'h2'} fontWeight="500" lineHeight={isScreen ? 0.8 : 0.9}>
                  {sensorData.current?.aqi || '--'}
                </Typography>
                <Typography variant={isScreen ? "h4" : 'h5'} fontWeight="500" className='condensedFont'>
                  {sensorData.current?.category || '--'}
                </Typography>
              </Box>

              <Box sx={{
                '& *': {
                  color:
                    isScreen ? (
                      sensorData.current?.sensor_status === SensorStatus.active ?
                        '#c8dcff' : CustomThemes.universal.palette.inactiveSensor
                    )
                      : 'text.secondary'
                }, mt: isScreen ? 2 : 1
              }} className='condensedFont'>
                {
                  showWeather && returnWeather({ isScreen, sensorData, temperatureUnitPreference, roundTemperature })
                }
                {
                  // Show heat index for selected location types
                  showHeatIndex &&
                  ['outdoors', 'indoors_gym'].includes(sensorData.sensor?.location_type) &&
                  returnHeatIndex({ isScreen, sensorData, temperatureUnitPreference })
                }
                {
                  showLastUpdate && returnLastUpdateAndSensorStatus({ sensorData, isScreen })
                }
              </Box>

              {
                // Display outdoor-indoor comparison if both sensors are active
                sensorData.sensor_status !== SensorStatus.active &&
                <Typography variant={isScreen ? "h6" : 'body1'} className="condensedFont">
                  {returnSensorStatus(sensorData)}
                </Typography>
              }
            </Grid>
          ))
          )
          :
          (
            <Stack direction="column" alignItems="center" justifyContent="center">
              <Skeleton variant='text' sx={{ width: '15rem', fontSize: '2rem' }} />
              <Skeleton variant='text' sx={{ width: '5rem', fontSize: '4rem', my: -1.5 }} />
              <Skeleton variant='text' sx={{ width: '10rem', fontSize: '2rem' }} />
              <Skeleton variant='text' sx={{ width: '7.5rem', fontSize: '1rem' }} />
              <Skeleton variant='text' sx={{ width: '7.5rem', fontSize: '1rem' }} />
            </Stack>
          )
      }
    </Grid>
  );
};

export const SimpleCurrentAQIlist = (props) => {
  const {
    currentSensorsData,
    useLocationShort = false,
    smallFont = true
  } = props;

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        '& .condensedFont': {
          fontFamily: 'IBM Plex Sans Condensed, sans-serif !important',
          '& *': {
            fontFamily: 'IBM Plex Sans Condensed, sans-serif !important'
          }
        }
      }}
    >
      {
        currentSensorsData ?
          (Object.entries(currentSensorsData).map(([key, sensorData], index) => (
            <Grid
              item
              key={key}
              xs={6}
              sx={
                sensorData.current?.sensor_status !== SensorStatus.active &&
                { '& *': { color: `${CustomThemes.universal.palette.inactiveSensor}` } }
              }
              display="block"
            >
              <Typography
                color="text.secondary"
                display="block"
                variant={smallFont ? 'caption' : 'body2'}
                fontWeight="500"
                className='condensedFont'
                textTransform="capitalize"
                textOverflow="ellipsis"
                overflow="hidden"
                noWrap
              >
                {returnLocationName({
                  useLocationShort,
                  location_short: sensorData.sensor?.location_short,
                  location_long: sensorData.sensor?.location_long
                })}
                :
                &nbsp;
                <Box component="span" color={sensorData.current?.color}>
                  {`${sensorData.current?.aqi} (${sensorData.current?.category})` || '--'}
                </Box>
              </Typography>
            </Grid>
          ))
          )
          :
          (
            <Stack direction="column" alignItems="center" justifyContent="center">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant='text' sx={{ width: '80%', fontSize: '1rem' }} />
              ))}
            </Stack>
          )
      }
    </Grid>
  );
}

const returnLastUpdateAndSensorStatus = ({ sensorData, isScreen }) => {
  if (isScreen && sensorData.current.sensor_status === SensorStatus.active) return null;
  else
    return (
      <Typography
        variant={isScreen ? 'h6' : 'caption'}
        sx={{
          mt: 0,
          fontWeight: isScreen && '500 !important'
        }}
      >
        {
          sensorData.current?.sensor_status !== SensorStatus.active
          &&
          <>
            <ErrorIcon
              sx={{
                '& *': {
                  color: `${AQIdatabase[3].lightThemeColor} !important`
                },
                mr: 0.5
              }} />
            Offline.&nbsp;
          </>
        }
        Last update:
        {(sensorData.current?.timestamp || sensorData.sensor?.last_seen)
          ? ` ${getFormattedElapsedTimeFromNow(sensorData.current?.timestamp || sensorData.sensor?.last_seen)} ago`
          : '--'}
      </Typography>
    )
}

const returnWeather = ({ isScreen, sensorData, temperatureUnitPreference, roundTemperature }) => {
  return (
    <Typography variant={isScreen ? "h6" : 'body1'}>
      <ThermostatIcon />
      {
        getFormattedTemperature({
          rawTemp: roundTemperature ? Math.round(sensorData.current?.temperature) : sensorData.current?.temperature,
          currentUnit: TemperatureUnits.celsius,
          returnUnit: temperatureUnitPreference
        })
      }
      &nbsp;&nbsp;-&nbsp;
      <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} />
      {sensorData.current?.rel_humidity ? Math.round(sensorData.current?.rel_humidity) : "--"}%
    </Typography>
  )
}

const returnHeatIndex = ({ isScreen, sensorData, temperatureUnitPreference }) => {
  return (
    <Typography variant={isScreen ? "body1" : 'body2'} sx={{ fontWeight: '300 !important' }}>
      {calculateHeatIndex({
        rawTemp: sensorData.current?.temperature,
        currentUnit: TemperatureUnits.celsius,
        rel_humidity: sensorData.current?.rel_humidity,
        returnUnit: temperatureUnitPreference
      })}
    </Typography>
  )
}

const returnLocationName = ({ useLocationShort, location_short, location_long }) => {
  return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
}

export default CurrentAQIGrid;
