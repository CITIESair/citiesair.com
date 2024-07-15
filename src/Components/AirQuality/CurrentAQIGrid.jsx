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
import { CurrentAQIGridSize, ElementSizes } from './CurrentAQIGridSize';
import ThemePreferences from '../../Themes/ThemePreferences';

const CurrentAQIGrid = (props) => {
  const {
    currentSensorsData,
    isScreen = false,
    showWeather = true,
    showHeatIndex = true,
    showLastUpdate = true,
    showRawMeasurements = true,
    useLocationShort = false,
    roundTemperature = false,
    firstSensorOwnLine = false,
    size = CurrentAQIGridSize.medium
  } = props;

  const { temperatureUnitPreference } = useContext(PreferenceContext);

  const getGridItemSizes = ({ itemIndex, numOfItems }) => {
    return {
      xs: (itemIndex === 0 && firstSensorOwnLine) ? 12 : Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: size === CurrentAQIGridSize.large ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 2))
    }
  }


  const CurrentAQISingleSensor = (props) => {
    const { sensor, current, gridSizes } = props;
    const { themePreference } = useContext(PreferenceContext);

    return (
      <Grid
        item
        {...gridSizes}
        sx={{
          ...(current?.sensor_status !== SensorStatus.active && {
            '& *': { color: CustomThemes.universal.palette.inactiveSensor }
          })
        }}
      >
        <Box sx={{ '& *': { color: current?.color?.[isScreen ? ThemePreferences.light : themePreference] } }}>
          <Typography variant={ElementSizes[size].locationAndCategory} fontWeight="500" className='condensedFont' textTransform="capitalize">
            {returnLocationName({
              useLocationShort,
              location_short: sensor?.location_short,
              location_long: sensor?.location_long
            })}
          </Typography>
          <Typography variant={ElementSizes[size].aqi} fontWeight="500" lineHeight={ElementSizes[size].aqiLineHeight}>
            {current?.aqi?.val || '--'}
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
            {current?.category || '--'}
          </Typography>
        </Box>

        {showRawMeasurements ?
          <Typography
            variant={ElementSizes[size].rawValues}
            display="block"
            fontWeight="500"
            className='condensedFont'
            color={isScreen ? CustomThemes.universal.palette.inactiveSensor : 'text.secondary'}
          >
            {`PM2.5: ${current?.["pm2.5"] || "--"} μg/m3`}
          </Typography> : null
        }

        <Box sx={{
          '& *': {
            color:
              isScreen ? (
                current?.sensor_status === SensorStatus.active ?
                  '#c8dcff' : CustomThemes.universal.palette.inactiveSensor
              )
                : 'text.secondary'
          }, mt: ElementSizes[size].meteroDataMarginTop
        }} className='condensedFont'>
          {
            showWeather && displayMetero({ size, current, temperatureUnitPreference, roundTemperature })
          }
          {
            // Show heat index for selected location types
            showHeatIndex &&
            ['outdoors', 'indoors_gym'].includes(sensor?.location_type) &&
            <Typography variant={ElementSizes[size].metero} sx={{ fontWeight: '300 !important' }}>
              {returnHeatIndex({ current, temperatureUnitPreference })}
            </Typography>
          }
          {
            showLastUpdate && displayLastUpdateAndSensorStatus({ sensor, size, current, isScreen })
          }
        </Box>

        {
          current?.sensor_status !== SensorStatus.active &&
          <Typography variant={ElementSizes[size].sensorStatus} className="condensedFont">
            {returnSensorStatus(current)}
          </Typography>
        }
      </Grid>
    )
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
          (Object.entries(currentSensorsData).map(([_, sensorData], index) => (
            <CurrentAQISingleSensor
              key={index}
              sensor={sensorData.sensor}
              current={sensorData.current}
              gridSizes={getGridItemSizes({
                itemIndex: index,
                numOfItems: Object.keys(currentSensorsData).length
              }
              )}

            />
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
    </Grid >
  );
};

export const SimpleCurrentAQIlist = (props) => {
  const {
    currentSensorsData,
    useLocationShort = false,
    size = CurrentAQIGridSize.medium
  } = props;

  const { themePreference } = useContext(PreferenceContext);

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
              sx={{
                ...(sensorData.current?.sensor_status !== SensorStatus.active && {
                  '& *': { color: CustomThemes.universal.palette.inactiveSensor }
                })
              }}
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
                <Box component="span" color={sensorData.current?.color[themePreference]}>
                  {displayAQI({ aqi: sensorData.current?.aqi?.val, category: sensorData.current?.category })}
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

const displayLastUpdateAndSensorStatus = ({ sensor, size, current, isScreen }) => {
  const { themePreference } = useContext(PreferenceContext);

  if (isScreen && current.sensor_status === SensorStatus.active) return null;
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
          current?.sensor_status !== SensorStatus.active
          &&
          <>
            <ErrorIcon
              sx={{
                '& *': {
                  color: `${AQIdatabase[3].color[isScreen ? ThemePreferences.light : themePreference]} !important` // red
                },
                mr: 0.5
              }} />
            Offline.&nbsp;
          </>
        }
        Last update:
        {(current?.timestamp || sensor?.last_seen)
          ? ` ${getFormattedElapsedTimeFromNow(current?.timestamp || sensor?.last_seen)} ago`
          : '--'}
      </Typography>
    )
}

const displayMetero = ({ size, current, temperatureUnitPreference, roundTemperature }) => {
  return (
    <Typography variant={ElementSizes[size].metero}>
      <ThermostatIcon />
      {
        getFormattedTemperature({
          rawTemp: roundTemperature ? Math.round(current?.temperature) : current?.temperature,
          currentUnit: TemperatureUnits.celsius,
          returnUnit: temperatureUnitPreference
        })
      }
      &nbsp;&nbsp;-&nbsp;
      <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} />
      {current?.rel_humidity ? Math.round(current?.rel_humidity) : "--"}%
    </Typography>
  )
}

const returnHeatIndex = ({ current, temperatureUnitPreference }) => {
  return calculateHeatIndex({
    rawTemp: current?.temperature,
    currentUnit: TemperatureUnits.celsius,
    rel_humidity: current?.rel_humidity,
    returnUnit: temperatureUnitPreference
  })
}

const returnLocationName = ({ useLocationShort, location_short, location_long }) => {
  return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
}

export default CurrentAQIGrid;
