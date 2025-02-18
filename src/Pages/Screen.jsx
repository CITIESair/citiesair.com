// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from '../ContextProviders/UserContext';

import { Box, Grid, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';

import CITIESlogoLinkToHome from '../Components/Header/CITIESlogoLinkToHome';

import { SensorStatus } from '../Components/AirQuality/SensorStatus';
import { getDomainName, getUrlAfterScreen } from '../Components/AirQuality/AirQualityScreen/ScreenUtils';

import RecentHistoricalGraph from '../Components/AirQuality/AirQualityScreen/RecentHistoricalGraph';

import { AQI_Database } from '../Utils/AirQuality/AirQualityIndexHelper';

import QRCode from "react-qr-code";

import CurrentAQIGrid from '../Components/AirQuality/CurrentAQIGrid';
import { CurrentAQIGridSize } from '../Components/AirQuality/CurrentAQIGridSize';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";
import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { AppRoutes } from '../Utils/AppRoutes';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';
import { CITIESair } from '../Utils/GlobalVariables';
import { INACTIVE_SENSOR_COLORS } from '../Themes/CustomColors';

// Helper function to parse displayHours
function isWithinDisplayHours(location) {
  const params = new URLSearchParams(location.search);
  const displayHours = params.get("displayHours");
  if (!displayHours) return true; // Show screen if no parameter

  const [start, end] = displayHours.split("-").map(time => parseInt(time.replace(":", ""), 10));
  const now = parseInt(new Date().toTimeString().slice(0, 5).replace(":", ""), 10);

  if (start <= end) {
    // Regular range (same day, e.g., 06:00-20:00)
    return start <= now && now < end;
  } else {
    // Overnight range (e.g., 16:00-01:00)
    return now >= start || now < end;
  }
}


const Screen = ({ title }) => {
  const { temperatureUnitPreference, themePreference } = useContext(PreferenceContext);

  const { authenticationState } = useContext(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  const locationPath = location.pathname;

  const [shouldDisplayScreen, setShouldDisplayScreen] = useState(isWithinDisplayHours(location));
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShouldDisplayScreen(isWithinDisplayHours(location));
    }, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [isLayoutReversed, setIsLayoutReversed] = useState();

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

  // Fetch air quality data from database, depends on the state of 'user' object
  useEffect(() => {
    // Only attempt to fetch data if the user has been authenticated
    if (authenticationState.checkedAuthentication === false) return;

    if (authenticationState.authenticated === true) {
      // Do nothing if the data has been fetched before
      if (Object.keys(data).length != 0) return;

      const url = getApiUrl({ endpoint: GeneralAPIendpoints.screen });
      if (!url) return;

      fetchAndProcessCurrentSensorsData(url)
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.log(error);
        });

      // Create an interval that fetch new data every 5 minute
      const fetchInterval = 5 * 60 * 1000; // 5min
      const intervalId = setInterval(() => {
        fetchAndProcessCurrentSensorsData(url)
          .then((data) => {
            setData(data);
          })
          .catch((error) => console.log(error))
      },
        fetchInterval);
      // Clean up the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
      };
    } else {
      navigate(`${AppRoutes.login}?${AppRoutes.redirectQuery}=${locationPath}`);
    }
  }, [authenticationState]);

  const AirQualityComparison = () => {
    // Only display air quality comparison if every sensor is currently active
    if (!Object.values(data).every((sensorData) => sensorData.sensor?.sensor_status === SensorStatus.active)) return null;

    let outdoorsAQI, indoorsAQI;
    // Don't display comparison if outdoor air is good
    for (let i = 0; i < Object.values(data).length; i++) {
      const sensorData = Object.values(data)[i];
      if (sensorData.sensor?.location_type === "outdoors") {
        outdoorsAQI = sensorData.current.aqi;
        if (outdoorsAQI <= AQI_Database[0].aqiUS.high) return null;
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
              color={`${AQI_Database[0].color[themePreference]} !important`}
            >
              {` ${comparison} `}
            </Typography>
            better than outdoors</>
        } />
      </ListItem>
    );
  }

  if (shouldDisplayScreen) return (
    <Grid
      container
      alignContent="stretch"
      alignItems="stretch"
      height="100vh"
      sx={{
        overflow: 'hidden',
        background: "white",
        '& *': {
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
            color: `${AQI_Database[3].color.Light} !important`,
            opacity: 0.8
          },
          color: `${AQI_Database[3].color.Light} !important`,
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
            <Typography variant="h3" fontWeight="500" color="white">
              AIR QUALITY INDEX
            </Typography>
            <Typography variant="h4" className='condensedFont' color={INACTIVE_SENSOR_COLORS.screen}>
              Particulate Matter PM2.5
            </Typography>
          </Box>

          <Grid
            container
            justifyContent="space-around"
          >
            <CurrentAQIGrid
              currentSensorsData={data}
              temperatureUnitPreference={temperatureUnitPreference}
              isScreen={true}
              size={CurrentAQIGridSize.large}
            />
          </Grid>

          <List
            className='condensedFont'
            sx={{
              listStyleType: 'disclosure-closed',
              '& .MuiTypography-root': {
                fontSize: '1.5rem',
              },
              '& .MuiListItem-root': {
                display: 'list-item',
                ml: 3,
                p: 0,
                pr: 3,
              },
              '& .MuiTypography-root, .MuiListItem-root': {
                color: INACTIVE_SENSOR_COLORS.screen
              }
            }}>
            <AirQualityComparison />
            {
              Object.entries(data).map(([key, sensorData]) => (
                sensorData.current?.healthSuggestion &&
                <ListItem
                  key={key}
                  className={sensorData.current?.aqi >= AQI_Database[2].aqiUS.low ? 'flashingRed' : ''}
                >
                  <ListItemText
                    primary={sensorData.current?.healthSuggestion}
                  />
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
            <Typography variant="h3" fontWeight="500" sx={{ color: 'black' }}>
              {CITIESair}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Box height="auto" width="100%">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={
                  `${getDomainName(document.location.href)}?source=${getUrlAfterScreen(document.location.href)}`
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
    </Grid>
  );
  else return (
    <Grid
      container
      alignContent="stretch"
      alignItems="stretch"
      height="100vh"
      sx={{
        overflow: 'hidden',
        background: "black",
      }}
    />
  )
};

export default Screen;
