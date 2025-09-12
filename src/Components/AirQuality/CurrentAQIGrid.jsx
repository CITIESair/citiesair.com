// disable eslint for this file
/* eslint-disable */
import { Box, Grid, Typography, Skeleton, Stack } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ErrorIcon from '@mui/icons-material/Error';

import { returnSensorStatusString } from "./SensorStatus";
import { getFormattedLastSeen } from "./SensorStatus";
import { SensorStatus } from "./SensorStatus";
import { TemperatureUnits, getFormattedTemperature } from "../../Utils/AirQuality/TemperatureUtils";

import { AQI_Database } from '../../Utils/AirQuality/AirQualityIndexHelper';
import { useContext } from 'react';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import { CurrentAQIGridSize, ElementSizes } from './CurrentAQIGridSize';
import { useTheme } from '@mui/material';
import { INACTIVE_SENSOR_COLORS } from '../../Themes/CustomColors';

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

  const { temperatureUnitPreference } = useContext(PreferenceContext);

  const getGridItemSizes = ({ itemIndex, numOfItems }) => {
    return {
      xs: (itemIndex === 0 && firstSensorOwnLine) ? 12 : Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: size === CurrentAQIGridSize.large ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 2))
    }
  }


  const CurrentAQISingleSensor = (props) => {
    const { sensor, current, gridSizes, isScreen } = props;
    const theme = useTheme();

    return (
      <Grid
        item
        {...gridSizes}
      >
        {
          showAQI ? (
            <Box>
              <Box sx={{
                '& .MuiTypography-root': {
                  color: (current?.aqi?.category && sensor.sensor_status === SensorStatus.active) ?
                    theme.palette.text.aqi[current.aqi.category]
                    : (isScreen ? INACTIVE_SENSOR_COLORS.screen : theme.palette.text.aqi[SensorStatus.offline])
                }
              }}>
                <Typography variant={ElementSizes[size].locationAndCategory} fontWeight="500" className='condensedFont' textTransform="capitalize">
                  {returnLocationName({
                    useLocationShort,
                    location_short: sensor?.location_short,
                    location_long: sensor?.location_long
                  })}
                </Typography>
                <Typography variant={ElementSizes[size].aqi} fontWeight="500" lineHeight={ElementSizes[size].aqiLineHeight}>
                  {current?.aqi?.val !== null && current?.aqi?.val !== undefined ? current.aqi.val : '--'}
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
                  {current?.aqi?.category || '--'}
                </Typography>
              </Box>

              {showRawMeasurements ?
                <Typography
                  variant={ElementSizes[size].rawValues}
                  display="block"
                  fontWeight="500"
                  className='condensedFont'
                  color={isScreen ? INACTIVE_SENSOR_COLORS.screen : 'text.secondary'}
                >
                  {`PM2.5: ${current?.["pm2.5"] || "--"} μg/m3`}
                </Typography> : null
              }
            </Box>
          ) : null
        }

        <Box sx={{
          '& *': {
            color:
              isScreen ? (
                sensor?.sensor_status === SensorStatus.active ?
                  '#c8dcff' : INACTIVE_SENSOR_COLORS.screen
              )
                : 'text.secondary'
          }, mt: ElementSizes[size].meteroDataMarginTop
        }} className='condensedFont'>
          {
            showWeather && displayWeather({ size, current, temperatureUnitPreference, roundTemperature, showWeatherText })
          }

          {
            showHeatIndex && displayHeatIndex({ sensor, current, size, temperatureUnitPreference })
          }

          {
            showLastUpdate && displayLastUpdateAndSensorStatus({ sensor, size, isScreen })
          }
        </Box>

        {
          sensor?.sensor_status !== SensorStatus.active &&
          <Typography variant={ElementSizes[size].sensorStatus} className="condensedFont">
            {returnSensorStatusString(current)}
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
              isScreen={isScreen}
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
    size = CurrentAQIGridSize.medium,
    showCategory = true
  } = props;

  const theme = useTheme();

  const displayAQI = ({ aqi, category }) => {
    if (!aqi) return "--";
    else {
      return `${aqi}${showCategory ? `(${category || '--'})` : ''} `;
    }
  }

  return (
    <Grid
      container
      justifyContent="left"
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
                textAlign="center"
                noWrap
              >
                {returnLocationName({
                  useLocationShort,
                  location_short: sensorData.sensor?.location_short,
                  location_long: sensorData.sensor?.location_long
                })}
                :
                &nbsp;
                <Box
                  component="span"
                  color={
                    (sensorData?.current?.aqi?.category && sensorData.sensor?.sensor_status) ?
                      theme.palette.text.aqi[sensorData.current.aqi.category] :
                      'text.secondary'
                  }
                >
                  {displayAQI({ aqi: sensorData.current?.aqi?.val, category: sensorData.current?.aqi?.category })}
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

const displayLastUpdateAndSensorStatus = ({ sensor, size, isScreen }) => {
  const theme = useTheme();

  if (isScreen && sensor?.sensor_status === SensorStatus.active) return null;
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
          sensor?.sensor_status !== SensorStatus.active
          &&
          <>
            <ErrorIcon
              sx={{
                '& *': {
                  color: `${theme.palette.text.aqi[AQI_Database[3].category]} !important` // red
                },
                mr: 0.5
              }} />
            Offline.&nbsp;
          </>
        }
        {`Last update: ${getFormattedLastSeen(sensor?.lastSeenInMinutes)}`}
      </Typography>
    )
}

const displayWeather = ({ size, current, temperatureUnitPreference, roundTemperature, showWeatherText }) => {
  return (
    <Typography variant={ElementSizes[size].metero}>
      {showWeatherText ? "Weather:" : null}
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

const returnLocationName = ({ useLocationShort, location_short, location_long }) => {
  return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
}

const displayHeatIndex = ({ sensor, current, size, temperatureUnitPreference }) => {
  if (!sensor || !current) return null;
  if (!['outdoors', 'indoors_gym'].includes(sensor.location_type)) return null;

  const heatIndexObject = current?.heat_index_C;

  return (
    <Typography variant={ElementSizes[size].heatIndex} sx={{ fontWeight: '300 !important' }}>
      Heat Index:&nbsp;
      {heatIndexObject && heatIndexObject.val !== undefined && heatIndexObject.val !== null
        ? <>
          {getFormattedTemperature({
            rawTemp: heatIndexObject.val,
            currentUnit: TemperatureUnits.celsius,
            returnUnit: temperatureUnitPreference
          })}
          &nbsp;
          ({heatIndexObject.category || '--'})
        </>
        : '--'
      }
    </Typography>
  );
}

export default CurrentAQIGrid;
