import { useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Box, Grid, Typography, Container, Divider, useMediaQuery } from '@mui/material';
import { MetadataContext } from '../../ContextProviders/MetadataContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

import About from './About';

import sectionData from '../../section_data.json';

import * as Tracking from '../../Utils/Tracking';
import parse from 'html-react-parser';
import { isValidArray, replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQI/CurrentAQIGrid';

import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';

import GetInTouch from './GetInTouch';
import { AppRoutes } from '../../Utils/AppRoutes';
import { SensorStatus } from "../../Components/AirQuality/SensorStatus";
import AQIexplanation from '../../Components/AirQuality/AQIexplanation';
import { NYUAD } from '../../Utils/GlobalVariables';
import AtAGlance from './AtAGlance';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { UserContext } from '../../ContextProviders/UserContext';
import OutdoorStationUAE from '../../Components/AirQuality/AirQualityMap/OutdoorStationUAE';
import useCurrentSensorsData from '../../hooks/useCurrentSensorsData';
import CurrentAQIMapWithGrid from '../../Components/AirQuality/CurrentAQI/CurrentAQIMapWithGrid';
import useSchoolMetadata from '../../hooks/useSchoolMetadata';
import { getDashboardLabel } from '../../Components/Account/Utils';

const displaySensorCounts = (currentSensorsData) => {
  if (!currentSensorsData) return null;

  return (
    <Grid item xs={12}>
      <Typography variant='body2' color="text.secondary">
        <b>Sensors status: </b>{
          currentSensorsData.reduce((count, obj) => obj?.sensor?.sensor_status === SensorStatus.active ? count + 1 : count, 0)
        } active out of {currentSensorsData.length}
      </Typography>
    </Grid>
  );
}

const displayDashboardButtons = (authenticationState, user, isSmallScreen) => {
  const isAllowedOnlyNYUAD =
    isValidArray(user?.allowedSchools) &&
    user.allowedSchools.length === 1 &&
    user.allowedSchools[0].school_id === NYUAD;

  return (
    <Grid item container spacing={1} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm="auto">
        <Button
          component={RouterLink}
          variant='contained'
          sx={{ width: "fit-content" }}
          to={authenticationState.authenticated ? AppRoutes.dashboard : AppRoutes.login}
          onClick={() => {
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: authenticationState.authenticated ? AppRoutes.dashboard : AppRoutes.login,
                origin_id: AppRoutes.home
              }
            );
          }}
        >
          {authenticationState.authenticated ?
            <BarChartIcon sx={{ fontSize: '0.8rem' }} />
            : <PersonIcon sx={{ fontSize: '0.8rem' }} />
          }
          &nbsp;
          {authenticationState.authenticated ? getDashboardLabel(user, isAllowedOnlyNYUAD ? NYUAD : null) : "Login Private Dashboard"}
        </Button>
      </Grid>

      {
        (isAllowedOnlyNYUAD === false && isSmallScreen === false) && (
          <Grid item xs={12} sm="auto">
            <Typography color="text.secondary">|</Typography>
          </Grid>
        )
      }

      {
        isAllowedOnlyNYUAD ? null :
          (
            <Grid item xs={12} sm="auto">
              <Button
                component={RouterLink}
                variant={isSmallScreen ? 'text' : 'outlined'}
                sx={{ width: "fit-content" }}
                to={AppRoutes.nyuad}
                onClick={() => {
                  Tracking.sendEventAnalytics(
                    Tracking.Events.internalNavigation,
                    {
                      destination_id: AppRoutes.nyuad,
                      destination_school_id: NYUAD,
                      origin_id: AppRoutes.home
                    }
                  );
                }}
              >
                <BarChartIcon sx={{ fontSize: '0.8rem' }} />
                &nbsp;
                NYUAD Public Dashboard
              </Button>
            </Grid>
          )
      }
    </Grid>
  );
}

function Home({ temperatureUnitPreference, title }) {
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { setCurrentPage, setChartsTitlesList } = useContext(MetadataContext);

  // set current page to home
  useEffect(() => {
    setCurrentPage(AppRoutes.home);
    setChartsTitlesList([]);
  }, [setCurrentPage, setChartsTitlesList]);

  const { currentSchoolID } = useContext(DashboardContext);
  const { data: currentSensorsData } = useCurrentSensorsData(currentSchoolID || NYUAD);
  const { data: schoolMetadata } = useSchoolMetadata();
  const { authenticationState, user } = useContext(UserContext);

  return (
    <Box width="100%">

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ pt: 1, pb: 3 }}>
          <UppercaseTitle text={`real-time air quality in the uae`} />

          <AtAGlance />

          <Typography sx={{ mt: 2 }} variant="body1" color="text.secondary">
            {parse(sectionData.publicOutdoorStations.content, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
        </Container>
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <OutdoorStationUAE />
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ pt: 4, pb: 3 }}>
          <UppercaseTitle text={`real-time air quality  ${currentSchoolID ? `at ${currentSchoolID}` : ""}`} />
          <Typography variant='body1' color='text.secondary' sx={{ mt: -2, mb: 2 }}>
            PM2.5 (Particulate Matter Smaller Than 2.5 Micrometer)
          </Typography>

          <Grid container spacing={2} justifyContent="center" textAlign="center">

            {schoolMetadata?.has_map === true ?
              (
                <CurrentAQIMapWithGrid
                  currentSensorsData={currentSensorsData}
                  schoolID={currentSchoolID || NYUAD}
                  isOnBannerPage={false}
                  disableInteraction={true}
                  minMapHeight={"250px"}
                />
              ) : (
                <Grid item xs={12} lg={10}>
                  <CurrentAQIGrid
                    currentSensorsData={currentSensorsData?.slice(0, 3)}
                    isScreen={false}
                    temperatureUnitPreference={temperatureUnitPreference}
                    firstSensorOwnLine={true}
                  />
                </Grid>
              )
            }

            {displaySensorCounts(currentSensorsData)}

            {displayDashboardButtons(authenticationState, user, isSmallScreen)}

            <Grid item xs={12} textAlign="left">
              <AQIexplanation />
            </Grid>
          </Grid>
        </Container>
      </FullWidthBox>

      <Divider />

      <FullWidthBox id={sectionData.about.id} sx={{ pt: 3, pb: 4 }}>
        <Container>
          <About />
        </Container>
      </FullWidthBox>

      <Divider />

      <FullWidthBox id={sectionData.getInTouch.id} sx={{ pt: 3, pb: 4 }}>
        <Container>
          <GetInTouch />
        </Container>
      </FullWidthBox>

    </Box >
  );
}

export default Home;
