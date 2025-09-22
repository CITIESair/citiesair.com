// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../ContextProviders/UserContext';

import { Box, Grid, Typography, Stack } from '@mui/material';

import CITIESlogoLinkToHome from '../Components/Header/CITIESlogoLinkToHome';

import RecentHistoricalGraph from '../Components/AirQuality/AirQualityScreen/RecentHistoricalGraph';

import { AQI_Database } from '../Utils/AirQuality/AirQualityIndexHelper';

import CurrentAQIGrid from '../Components/AirQuality/CurrentAQIGrid';
import { CurrentAQIGridSize } from '../Components/AirQuality/CurrentAQIGridSize';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from "../API/Utils";
import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { AppRoutes } from '../Utils/AppRoutes';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';
import { CITIESair, KAMPALA } from '../Utils/GlobalVariables';
import { INACTIVE_SENSOR_COLORS } from '../Themes/CustomColors';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getTranslation, isValidArray } from '../Utils/UtilFunctions';

import sectionData from '../section_data.json';

import ScreenQRcode from '../Components/AirQuality/AirQualityScreen/ScreenQRcode';
import ScreenHealthSuggestions from '../Components/AirQuality/AirQualityScreen/ScreenHealthSuggestions';
import { TypesOfScreen } from '../Components/AirQuality/AirQualityScreen/ScreenUtils';

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
  const { school_id_param, screen_id_param } = useParams()

  const { temperatureUnitPreference, language, setLanguage } = useContext(PreferenceContext);
  const { schoolMetadata, currentSchoolID } = useContext(DashboardContext);

  const { authenticationState } = useContext(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  const locationPath = location.pathname;

  const [shouldDisplayScreen, setShouldDisplayScreen] = useState(isWithinDisplayHours(location));
  const [typeOfScreen, setTypeOfScreen] = useState(isWithinDisplayHours(TypesOfScreen.indoorsVsOutdoors));

  // Timer loop:
  // - Check if the screen should be displayed (or black screen to save energy)
  // - Rotate between different languages (if exists)
  useEffect(() => {
    if (!schoolMetadata || !isValidArray(schoolMetadata.languages)) return;

    const languages = schoolMetadata.languages;
    if (languages.length <= 1) return;

    const intervalId = setInterval(() => {
      // Update display check
      setShouldDisplayScreen(isWithinDisplayHours(location));

      // Rotate language once per minute
      const minute = new Date().getMinutes();
      setLanguage(languages[minute % languages.length]);
    }, 1000 * 60); // check once per minute

    return () => clearInterval(intervalId);
  }, [schoolMetadata, location, setLanguage]);

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

      const url = getApiUrl({
        endpoint: GeneralAPIendpoints.screen,
        school_id: school_id_param || currentSchoolID,
        screen_id: screen_id_param
      });

      fetchAndProcessCurrentSensorsData(url)
        .then((data) => {
          setData(data);

          // Determine the type of screen
          const hasOutdoor = data.some(({ sensor }) => sensor.location_type === "outdoors");
          const hasIndoor = data.some(({ sensor }) => sensor.location_type.startsWith("indoors"));

          const screenType = hasIndoor && hasOutdoor
            ? TypesOfScreen.indoorsVsOutdoors
            : hasIndoor
              ? TypesOfScreen.bothIndoors
              : hasOutdoor
                ? TypesOfScreen.bothOutdoors
                : null;

          if (screenType) setTypeOfScreen(screenType);
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

  const aqiTitle = getTranslation(sectionData.screen.content.aqiTitle, language);
  const pm25Title = getTranslation(sectionData.screen.content.pm25Title, language);

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
            <Typography variant="h2" fontWeight="500" color="white">
              {aqiTitle}
            </Typography>
            <Typography variant="h3" className='condensedFont' color={INACTIVE_SENSOR_COLORS.screen}>
              {pm25Title}
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
              showHeatIndex={currentSchoolID === KAMPALA ? false : true}
            />
          </Grid>

          <ScreenHealthSuggestions typeOfScreen={typeOfScreen} data={data} />
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
            <Typography variant="h2" sx={{ color: 'black' }}>
              {CITIESair}
            </Typography>
            {
              currentSchoolID === KAMPALA && (
                <Typography variant="h5" color="text.secondary">
                  {getTranslation(sectionData.screen.content.dataProvider, language)}: AirQo
                </Typography>
              )
            }
          </Grid>

          <Grid item xs={2}>
            <Box height="auto" width="90%">
              <ScreenQRcode />
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
