// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ErrorIcon from '@mui/icons-material/Error';

import { returnSensorStatus, SensorStatus, getFormattedElapsedTimeFromNow } from '../Pages/Screen/ScreenUtils';
import { TemperatureUnits, getFormattedTemperature, calculateHeatIndex } from "../Pages/Screen/TemperatureUtils";

import AQIdatabase from '../Utils/AirQualityIndexHelper';

import CustomThemes from '../Themes/CustomThemes';

const CurrentAQIGrid = (props) => {

  const { currentData, temperatureUnitPreference, isScreen = true, orderOfItems } = props;

  const getGridItemSize = (numOfItems) => {
    return {
      xs: Math.max(12 / numOfItems, 6),
      sm: Math.max(12 / numOfItems, 4),
      lg: isScreen ? (12 / numOfItems) : Math.min(5, Math.max(12 / numOfItems, 3))
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
        Object.entries(currentData).map(([key, sensorData], index) => (
          <Grid
            item
            order={orderOfItems && orderOfItems[index]}
            key={key}
            {...getGridItemSize(Object.keys(currentData).length)}
            sx={
              sensorData.current?.sensor_status !== SensorStatus.active &&
              { '& *': { color: `${CustomThemes.universal.palette.inactiveSensor}` } }
            }
          >
            <Box sx={{ '& *': { color: sensorData.current?.color } }}>
              <Typography variant={isScreen ? "h4" : 'h5'} fontWeight="500" className='condensedFont'>
                {sensorData.sensor?.location_long || sensorData.sensor?.location_short || 'No Location Name'}
              </Typography>
              <Typography variant={isScreen ? "h1" : 'h2'} fontWeight="500" lineHeight={isScreen ? 0.8 : 0.9}>
                {sensorData.current?.aqi || '--'}
              </Typography>
              <Typography variant={isScreen ? "h4" : 'h5'} fontWeight="500" className='condensedFont'>
                {sensorData.current?.category || '--'}
              </Typography>
            </Box>

            <Box sx={{ '& *': { color: (isScreen && sensorData.current?.sensor_status === SensorStatus.active) ? '#c8dcff' : 'text.secondary' }, mt: isScreen ? 2 : 1 }} className='condensedFont'>
              <Typography variant={isScreen ? "h6" : 'body1'}>
                <ThermostatIcon />
                {
                  getFormattedTemperature({
                    rawTemp: sensorData.current?.temperature || "--",
                    currentUnit: TemperatureUnits.celsius,
                    returnUnit: temperatureUnitPreference
                  })
                }
                &nbsp;&nbsp;-&nbsp;
                <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} />
                {sensorData.current?.rel_humidity ? Math.round(sensorData.current?.rel_humidity) : "--"}%
              </Typography>
              {
                // Show heat index for selected location types
                ['outdoors', 'indoors_gym'].includes(sensorData.sensor?.location_type) &&
                <Typography variant={isScreen ? "body1" : 'body2'} sx={{ fontWeight: '300 !important' }}>
                  {calculateHeatIndex({
                    rawTemp: sensorData.current?.temperature,
                    currentUnit: TemperatureUnits.celsius,
                    rel_humidity: sensorData.current?.rel_humidity,
                    returnUnit: temperatureUnitPreference
                  })}
                </Typography>
              }
              {
                displayLastUpdateAndSensorStatus({ sensorData, isScreen })
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
      }
    </Grid>
  );
};

const displayLastUpdateAndSensorStatus = ({ sensorData, isScreen }) => {
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
        {sensorData.current?.timestamp
          ? ` ${getFormattedElapsedTimeFromNow(sensorData.current.timestamp)} ago`
          : '--'}
      </Typography>
    )
}

export default CurrentAQIGrid;
