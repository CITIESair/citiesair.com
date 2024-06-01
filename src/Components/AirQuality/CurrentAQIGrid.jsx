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
import { useContext } from 'react';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

export const CurrentAQIGridSize = {
  large: "large",
  medium: "medium",
  small: "small"
}

const ElementSizes = {
  [CurrentAQIGridSize.large]: {
    icon: null,
    locationAndCategory: 'h4',
    aqi: 'h1',
    aqiLineHeight: 0.8,
    sensorStatus: 'h6',
    heatIndex: 'body1',
    meteroDataMarginTop: 2,
    metero: 'h6',
    importantFontWeight: '500 !important'
  },
  [CurrentAQIGridSize.medium]: {
    icon: '1rem',
    locationAndCategory: 'h5',
    aqi: 'h2',
    aqiLineHeight: 0.9,
    sensorStatus: 'caption',
    heatIndex: 'body2',
    meteroDataMarginTop: 1,
    metero: 'body1',
    importantFontWeight: null
  },
  [CurrentAQIGridSize.small]: {
    icon: '1rem',
    locationAndCategory: 'body1',
    aqi: 'h3',
    aqiLineHeight: 0.9,
    sensorStatus: 'caption',
    heatIndex: 'caption',
    meteroDataMarginTop: 1,
    metero: 'caption',
    importantFontWeight: null
  }
}

const CurrentAQIGrid = (props) => {
  const {
    currentSensorsData,
    isScreen = false,
    showWeather = true,
    showHeatIndex = true,
    showLastUpdate = true,
    useLocationShort = false,
    roundTemperature = false,
    firstSensorOwnLine = false,
    size = CurrentAQIGridSize.medium
  } = props;

  const { temperatureUnitPreference } = useContext(PreferenceContext);

  const getGridItemSize = ({ itemIndex, numOfItems }) => {
    return {
      xs: (itemIndex === 0 && firstSensorOwnLine) ? 12 : Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: size === CurrentAQIGridSize.large ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 2))
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      spacing={1}
      sx={{
        '& .MuiSvgIcon-root': {
          verticalAlign: 'sub',
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
                <Typography variant={ElementSizes[size].locationAndCategory} fontWeight="500" className='condensedFont' textTransform="capitalize">
                  {returnLocationName({
                    useLocationShort,
                    location_short: sensorData.sensor?.location_short,
                    location_long: sensorData.sensor?.location_long
                  })}
                </Typography>
                <Typography variant={ElementSizes[size].aqi} fontWeight="500" lineHeight={ElementSizes[size].aqiLineHeight}>
                  {sensorData.current?.aqi || '--'}
                </Typography>
                <Typography
                  variant={ElementSizes[size].locationAndCategory}
                  fontWeight="500"
                  className='condensedFont'
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
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
                }, mt: ElementSizes[size].meteroDataMarginTop
              }} className='condensedFont'>
                {
                  showWeather && displayMetero({ size, sensorData, temperatureUnitPreference, roundTemperature })
                }
                {
                  // Show heat index for selected location types
                  showHeatIndex &&
                  ['outdoors', 'indoors_gym'].includes(sensorData.sensor?.location_type) &&
                  <Typography variant={ElementSizes[size].metero} sx={{ fontWeight: '300 !important' }}>
                    {returnHeatIndex({ sensorData, temperatureUnitPreference })}
                  </Typography>
                }
                {
                  showLastUpdate && displayLastUpdateAndSensorStatus({ size, sensorData, isScreen })
                }
              </Box>

              {
                sensorData.sensor_status !== SensorStatus.active &&
                <Typography variant={ElementSizes[size].sensorStatus} className="condensedFont">
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
    size = CurrentAQIGridSize.medium
  } = props;

  const displayAQI = ({ aqi, category }) => {
    if (!aqi) return "--";
    else {
      return `${aqi} (${category || '--'})`;
    }
  }

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
          (Object.entries(currentSensorsData).map(([_, sensorData], index) => (
            <Grid
              item
              key={index}
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
                variant={ElementSizes[size].metero}
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
                  {displayAQI({ aqi: sensorData.current?.aqi, category: sensorData.current?.category })}
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

const displayLastUpdateAndSensorStatus = ({ size, sensorData, isScreen }) => {
  if (isScreen && sensorData.current.sensor_status === SensorStatus.active) return null;
  else
    return (
      <Typography
        variant={ElementSizes[size].sensorStatus}
        display="block"
        sx={{
          mt: 0,
          fontWeight: ElementSizes[size].importantFontWeight
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

const displayMetero = ({ size, sensorData, temperatureUnitPreference, roundTemperature }) => {
  return (
    <Typography variant={ElementSizes[size].metero}>
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

const returnHeatIndex = ({ sensorData, temperatureUnitPreference }) => {
  return calculateHeatIndex({
    rawTemp: sensorData.current?.temperature,
    currentUnit: TemperatureUnits.celsius,
    rel_humidity: sensorData.current?.rel_humidity,
    returnUnit: temperatureUnitPreference
  })
}

const returnLocationName = ({ useLocationShort, location_short, location_long }) => {
  return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
}

export default CurrentAQIGrid;
