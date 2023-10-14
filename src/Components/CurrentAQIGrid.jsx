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

  const {
    currentData,
    temperatureUnit = TemperatureUnits.celsius,
    isScreen = true,
    orderOfItems
  } = props;

  return (
    <Grid
      container
      sx={{
        '& .MuiSvgIcon-root': {
          verticalAlign: 'sub'
        },
        '& *': {
          color: CustomThemes.universal.palette.inactiveSensor,
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
            xs={12 / Object.keys(currentData).length}
            sx={
              sensorData.current?.sensor_status !== SensorStatus.active &&
              { '& *': { color: `${CustomThemes.universal.palette.inactiveSensor}!important` } }
            }
          >
            <Box sx={{ '& *': { color: sensorData.current?.color } }}>
              <Typography variant="h4" data-category="" fontWeight="500" className='condensedFont'>
                {sensorData.sensor?.location_long || sensorData.sensor?.location_short || 'No Location Name'}
              </Typography>
              <Typography variant="h1" data-category="" fontWeight="500" lineHeight={0.8}>
                {sensorData.current?.aqi || '--'}
              </Typography>
              <Typography variant="h4" data-category="" fontWeight="500" className='condensedFont'>
                {sensorData.current?.category || '--'}
              </Typography>
            </Box>

            <Box sx={{ '& *': { color: isScreen ? '#c8dcff' : 'text.secondary' }, mt: 2 }} className='condensedFont'>
              <Typography variant="h6">
                <ThermostatIcon />
                {
                  getFormattedTemperature({
                    rawTemp: sensorData.current?.temperature || "--",
                    currentUnit: TemperatureUnits.celsius,
                    returnUnit: temperatureUnit
                  })
                }
                &nbsp;&nbsp;-&nbsp;
                <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} />
                {sensorData.current?.rel_humidity ? Math.round(sensorData.current?.rel_humidity) : "--"}%
              </Typography>
              {
                // Show heat index for selected location types
                ['outdoors', 'indoors_gym'].includes(sensorData.sensor?.location_type) &&
                <Typography variant="body1" sx={{ fontWeight: '300 !important' }}>
                  {calculateHeatIndex({
                    rawTemp: sensorData.current?.temperature,
                    currentUnit: TemperatureUnits.celsius,
                    rel_humidity: sensorData.current?.rel_humidity,
                    returnUnit: temperatureUnit
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
              <Typography variant="h6" data-category="" className="condensedFont">
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
                fontSize: isScreen ? null : '1rem',
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
