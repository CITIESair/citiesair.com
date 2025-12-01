// disable eslint for this file
/* eslint-disable */
import { useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, Stack } from '@mui/material';

import CITIESlogoLinkToHome from '../../Components/Header/CITIESlogoLinkToHome';

import RecentHistoricalGraph from '../../Components/AirQuality/AirQualityScreen/RecentHistoricalGraph';

import { AQI_Database } from '../../Utils/AirQuality/AirQualityIndexHelper';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQI/CurrentAQIGrid';
import { CurrentAQIGridSize } from '../../Components/AirQuality/CurrentAQI/CurrentAQIGridSize';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { fetchAndProcessCurrentSensorsData } from '../../API/ApiFetch';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import { CITIESair, CURRENT_DATA_EXPIRATION_TIME_MS, KAMPALA } from '../../Utils/GlobalVariables';
import { INACTIVE_SENSOR_COLORS } from '../../Themes/CustomColors';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { getTranslation } from '../../Utils/UtilFunctions';

import sectionData from '../../section_data.json';

import ScreenQRcode from '../../Components/AirQuality/AirQualityScreen/ScreenQRcode';
import ScreenHealthSuggestions from '../../Components/AirQuality/AirQualityScreen/ScreenHealthSuggestions';
import { TypesOfScreen } from '../../Components/AirQuality/AirQualityScreen/ScreenUtils';
import { ScreenContext } from '../../ContextProviders/ScreenContext';
import { useQuery } from '@tanstack/react-query';
import BlackScreen from './BlackScreen';

const SensorPairScreen = ({ title }) => {
  const { isLayoutReversed, shouldDisplayScreen } = useContext(ScreenContext);
  const { language } = useContext(PreferenceContext);

  // ---- DATA FETCHING FOR SCREEN ----
  const { currentSchoolID } = useContext(DashboardContext);
  const { school_id_param, screen_id_param } = useParams();
  const school_id = school_id_param || currentSchoolID;
  const screen_id = screen_id_param || "screen";
  const queryParams = {
    hoursToShow: school_id === KAMPALA ? 12 : null
  };

  const url = getApiUrl({
    paths: [GeneralAPIendpoints.screen, school_id, screen_id],
    queryParams
  });

  const { data } = useQuery({
    queryKey: [GeneralAPIendpoints.screen, school_id, screen_id, queryParams],
    queryFn: async () => {
      const screenData = await fetchAndProcessCurrentSensorsData({ url });

      // Determine the type of screen
      const hasOutdoor = screenData.some(({ sensor }) => sensor.location_type === "outdoors");
      const hasIndoor = screenData.some(({ sensor }) => sensor.location_type.startsWith("indoors"));
      const screenType = hasIndoor && hasOutdoor
        ? TypesOfScreen.indoorsVsOutdoors
        : hasIndoor
          ? TypesOfScreen.bothIndoors
          : hasOutdoor
            ? TypesOfScreen.bothOutdoors
            : null;

      return { screenData, screenType };
    },
    refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
    refetchOnWindowFocus: true,
    staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
    enabled: Boolean(shouldDisplayScreen && school_id && screen_id),
    placeholderData: (prev) => prev,
  });
  const { screenData, screenType } = data || { screenType: TypesOfScreen.indoorsVsOutdoors };

  // Update the page's title
  useEffect(() => {
    document.title = `${CITIESair} | ${(screen_id_param || "").toUpperCase()} Screen`;
  }, [title]);

  const aqiTitle = getTranslation(sectionData.screen.content.aqiTitle, language);
  const pm25Title = getTranslation(sectionData.screen.content.pm25Title, language);

  if (!shouldDisplayScreen) return <BlackScreen />

  return (
    <Grid
      container
      alignContent="stretch"
      alignItems="stretch"
      height="100vh"
      sx={{
        cursor: 'none',
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
              currentSensorsData={screenData}
              isScreen={true}
              size={CurrentAQIGridSize.large}
            />
          </Grid>

          <ScreenHealthSuggestions typeOfScreen={screenType} data={screenData} />
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
              school_id === KAMPALA && (
                <Typography variant="h5" color="text.secondary">
                  {getTranslation(sectionData.screen.content.dataProvider, language)}
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
            <RecentHistoricalGraph typeOfScreen={screenType} data={screenData} />
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  )
};

export default SensorPairScreen;
