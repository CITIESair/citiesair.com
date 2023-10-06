// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ErrorIcon from '@mui/icons-material/Error';

import CITIESlogoLinkToHome from '../../Components/Header/CITIESlogoLinkToHome';

import { returnSensorStatus, SensorStatus, calculateSensorStatus, removeLastDirectoryFromURL } from './ScreenUtils';
import { TemperatureUnits, getFormattedTemperature, calculateHeatIndex } from "./TemperatureUtils";

import RecentHistoricalGraph from './RecentHistoricalGraph';

import { fetchDataFromURL } from '../../Components/DatasetDownload/DatasetFetcher';
import AQIdatabase from '../../Utils/AirQualityIndexHelper';
import convertToAQI from '../../Utils/AirQualityIndexCalculator';

import CustomThemes from '../../Themes/CustomThemes';

import QRCode from "react-qr-code";

import parse from 'html-react-parser';

const Screen = () => {
  const [isLayoutReversed, setIsLayoutReversed] = useState();
  const [temperatureUnit, setTemperatureUnit] = useState(TemperatureUnits.celsius); // default

  const [data, setData] = useState({});

  // Tweak the layout of the screen to prevent burn-in
  useEffect(() => {
    // Helper function to change layout of the screen based on current's month
    // (arrange the left and right sections of the screen)
    // to mitigate burn-in if the same static image is displayed over a long period of time
    function returnIsLayoutReversed() {
      let months = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]; // 12 months of a year, change the layout every two months
      let now = new Date();
      let thisMonthIndex = now.getMonth(); // get the index of this Month (0-11)
      // Return a boolean value if the layout should be reversed
      return (months[thisMonthIndex] !== 0);
    }

    setIsLayoutReversed(returnIsLayoutReversed());

    // Set up an interval to call the function every day
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const intervalId = setInterval(() => {
      setIsLayoutReversed(returnIsLayoutReversed());
    }, oneDayInMilliseconds);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Load condensed font for this component
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Cleanup if needed (e.g., remove the link element)
      document.head.removeChild(link);
    };
  }, []);

  // Get searchParams for customization
  // like switching to Fahrenheit / turning on-off heatIndex
  // urlParams should be something like this /?isFahrenheit
  useEffect(() => {
    const url = new URL(document.location.href);
    const searchParamsKeys = url.searchParams;

    searchParamsKeys.forEach((value, key) => {
      switch (key) {
        case 'isFahrenheit':
          setTemperatureUnit(TemperatureUnits.fahrenheit);
          break;
        default:
          break;
      }
    });
  }, []);

  const url =
    'https://api.citiesair.com/screen/nyuad';

  // Fetch air quality data from database
  useEffect(() => {
    const fetchScreenData = () => {
      fetchDataFromURL(url, 'json').then((data => {
        Object.entries(data).map(([key, sensorData]) => {
          // Calculate if the sensor is currently active or not
          const now = new Date();
          const currentTimestamp = new Date(sensorData.current?.timestamp);
          const lastSeenInHours = Math.round((now - currentTimestamp) / 1000 / 3600);
          if (sensorData.current) {
            sensorData.current.lastSeenInHours = lastSeenInHours;
            sensorData.current.sensor_status = calculateSensorStatus(lastSeenInHours);
          }

          // Calculate AQI from raw measurements
          if (sensorData.current?.["pm2.5"]) {
            const aqiObject = convertToAQI(sensorData.current["pm2.5"]);
            if (aqiObject) {
              const aqiCategory = AQIdatabase[aqiObject.aqi_category_index];
              sensorData.current.aqi = aqiObject.aqi;
              sensorData.current.category = aqiCategory.category;

              // Only add color and healthSuggestion if the sensor is active
              if (sensorData.current.sensor_status === SensorStatus.active) {
                sensorData.current = {
                  ...sensorData.current,
                  color: aqiCategory.lightThemeColor,
                  healthSuggestion: parse(aqiCategory.healthSuggestions[sensorData.sensor?.location_type])
                };
              }
            }
          }
        });
        setData(data);
      }))
    }
    fetchScreenData();

    // Create an interval that fetch new data every 5 minute
    const fetchInterval = 5 * 60 * 1000; // 5min
    const intervalId = setInterval(fetchScreenData, fetchInterval);
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const AirQualityComparison = () => {
    // Only display air quality comparison if every sensor is currently active
    if (!Object.values(data).every((sensorData) => sensorData.current?.sensor_status === SensorStatus.active)) return null;

    let outdoorsAQI, indoorsAQI;
    // Don't display comparison if outdoor air is good
    for (let i = 0; i < Object.values(data).length; i++) {
      const sensorData = Object.values(data)[i];
      if (sensorData.sensor?.location_type === "outdoors") {
        outdoorsAQI = sensorData.current.aqi;
        if (outdoorsAQI <= AQIdatabase[0].aqiUS.high) return null;
      }
      else indoorsAQI = sensorData.current.aqi;
    }

    const ratio = outdoorsAQI / indoorsAQI;
    let comparison;
    if (ratio >= 2) comparison = `${parseFloat(ratio).toFixed(1)} times`;
    else if (ratio > 1.2) comparison = `${Math.round(100 * ((outdoorsAQI - indoorsAQI) / indoorsAQI))}%`;
    else return null;

    return (
      <ListItem>
        <ListItemText primary={
          <>Indoors air is
            <Typography
              component="span"
              color={AQIdatabase[0].lightThemeColor}>{` ${comparison} `}
            </Typography>
            better than outdoors</>
        } />
      </ListItem>
    );
  }

  return (
    <Grid
      container
      alignContent="stretch"
      alignItems="stretch"
      height="100vh"
      sx={{
        overflow: 'hidden',
        background: "white",
        '& .MuiSvgIcon-root': {
          verticalAlign: 'sub'
        },
        '& *': {
          color: CustomThemes.universal.palette.inactiveSensor,
          fontWeight: '500 !important'
        },
        '& .condensedFont': {
          fontFamily: 'IBM Plex Sans Condensed, sans-serif !important',
          '& *': {
            fontFamily: 'IBM Plex Sans Condensed, sans-serif !important'
          }
        },
        '& .flashingRed': {
          '& .MuiTypography-root ': {
            color: `${AQIdatabase[3].lightThemeColor} !important`,
            opacity: 0.8
          },
          color: `${AQIdatabase[3].lightThemeColor} !important`,
          animation: 'flashingRed 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
          '@keyframes flashingRed': {
            '0%': {
              opacity: 1
            },
            '50%': {
              opacity: 0.5
            },
            '100%': {
              opacity: 1
            }
          }
        }
      }}
    >
      <Grid
        item
        xs={6}
        sx={{
          py: 3,
          px: 2,
          order: isLayoutReversed ? 1 : 0,
          background: '#212529'
        }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          height="100%"
          textAlign="center"
        >
          <Box>
            <Typography variant="h4" fontWeight="500" color="white">
              PM2.5 AIR QUALITY INDEX
            </Typography>
            <Typography variant="h5" className='condensedFont'>
              Particulate Matter &lt; 2.5μm
            </Typography>
          </Box>

          <Grid
            container
            justifyContent="space-around"
          >
            {
              Object.entries(data).map(([key, sensorData]) => (
                <Grid
                  item
                  key={key}
                  xs={12 / Object.keys(data).length}
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

                  <Box sx={{ '& *': { color: '#c8dcff' }, mt: 2 }} className='condensedFont'>
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
                      sensorData.current?.sensor_status !== SensorStatus.active
                      &&
                      <Typography variant="h6" sx={{ fontWeight: '500 !important' }}>
                        <ErrorIcon
                          sx={{
                            '& *': {
                              color: `${AQIdatabase[3].lightThemeColor} !important`
                            },
                            mr: 0.5
                          }} />
                        Offline
                        {
                          sensorData.current?.sensor_status === SensorStatus.temporaryOffline
                          &&
                          ` - Last seen ${sensorData.current?.lastSeenInHours}hr${sensorData.current?.lastSeenInHours > 1 && "s"} ago`
                        }
                      </Typography>
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

          <List className='condensedFont'
            sx={{
              listStyleType: 'disclosure-closed',
              '& .MuiTypography-root': {
                fontSize: '1.5rem'
              },
              '& .MuiListItem-root': {
                display: 'list-item',
                ml: 3,
                p: 0,
                pr: 3
              }
            }}>
            <AirQualityComparison />
            {
              Object.entries(data).map(([key, sensorData]) => (
                sensorData.current?.healthSuggestion &&
                <ListItem
                  key={key}
                  className={sensorData.current?.aqi >= AQIdatabase[2].aqiUS.low && 'flashingRed'}
                >
                  <ListItemText primary={sensorData.current?.healthSuggestion} />
                </ListItem>
              ))
            }
          </List>
        </Stack>
      </Grid>

      <Grid item xs={6} sx={{ order: isLayoutReversed ? 0 : 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: !isLayoutReversed && 0,
            left: isLayoutReversed && 0,
            width: '5vw',
            height: '5vw',
            m: 1
          }}
        >
          <CITIESlogoLinkToHome />
        </Box>
        <Grid
          container
          alignContent="space-between"
          justifyContent="center"
          height="100%"
          textAlign="center"
        >
          <Grid item xs={12} sx={{ pt: 3, px: 2 }}>
            <Typography variant="h4" fontWeight="500" sx={{ color: 'black' }} className='condensedFont'>
              SCAN FOR HISTORICAL DATA
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Box height="auto" width="100%">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={
                  `${removeLastDirectoryFromURL(document.location.href)}?source=screen`
                } viewBox={`0 0 256 256`}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            height="70%"
            className='condensedFont'
            sx={{ '& *': { fontWeight: '600 !important' } }}
          >
            <RecentHistoricalGraph data={data} />
          </Grid>
        </Grid>

      </Grid>
    </Grid >
  );
};

export default Screen;
