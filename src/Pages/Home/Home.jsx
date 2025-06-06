import { useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Box, Grid, Typography, Container, Divider } from '@mui/material';
import { MetadataContext } from '../../ContextProviders/MetadataContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

import About from './About';

import jsonData from '../../section_data.json';

import * as Tracking from '../../Utils/Tracking';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';

import AQImap, { TileOptions } from '../../Components/AirQuality/AQImap';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQIGrid';

import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';

import GetInTouch from './GetInTouch';
import { AppRoutes } from '../../Utils/AppRoutes';
import { SensorStatus } from "../../Components/AirQuality/SensorStatus";
import AQIexplanation from '../../Components/AirQuality/AQIexplanation';
import { CITIESair, NYUAD } from '../../Utils/GlobalVariables';
import AtAGlance from './AtAGlance';
import { DashboardContext } from '../../ContextProviders/DashboardContext';
import { UserContext } from '../../ContextProviders/UserContext';

function Home({ themePreference, temperatureUnitPreference, title }) {
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

  const { currentSchoolID, currentSensorMeasurements, publicMapData } = useContext(DashboardContext);
  const { authenticationState } = useContext(UserContext);

  const displaySensorCounts = () => {
    if (!currentSensorMeasurements) return null;

    return (
      <Grid item xs={12}>
        <Typography variant='body2' color="text.secondary">
          <b>Sensors status: </b>{
            currentSensorMeasurements.reduce((count, obj) => obj?.sensor?.sensor_status === SensorStatus.active ? count + 1 : count, 0)
          } active out of {currentSensorMeasurements.length}
        </Typography>
      </Grid>
    );
  }

  const displayDashboardButtons = () => {
    const isOnlyNYUADButton = currentSchoolID === NYUAD && authenticationState.authenticated;

    return (
      <Grid item container spacing={{ xs: 0, sm: 1 }} justifyContent="center" alignItems="center">
        {
          isOnlyNYUADButton ? null :
            (
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
                  {authenticationState.authenticated ? `School Dashboard (Private)` : "Login to Private Dashboard"}
                </Button>
              </Grid>
            )
        }

        <Grid item xs={12} sm="auto">
          <Button
            component={RouterLink}
            variant={isOnlyNYUADButton ? 'contained' : 'text'}
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
            NYUAD Dashboard {isOnlyNYUADButton ? "" : "(Public)"}
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box width="100%">
      <FullWidthBox>
        <Container sx={{ pt: 3, pb: 4 }}>
          <UppercaseTitle text={`real-time air quality at ${currentSchoolID || ""}`} />
          <Typography variant='body1' color='text.secondary' sx={{ mt: -2, mb: 2 }}>
            PM2.5 (Particulate Matter Smaller Than 2.5 Micrometer)
          </Typography>

          <Grid container spacing={2} justifyContent="center" textAlign="center">
            <Grid item xs={12} lg={10}>
              <CurrentAQIGrid
                currentSensorsData={currentSensorMeasurements?.slice(0, 3)}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
                firstSensorOwnLine={true}
              />
            </Grid>

            {displaySensorCounts()}

            {displayDashboardButtons()}

            <Grid item xs={12} textAlign="left">
              <AQIexplanation />
            </Grid>
          </Grid>
        </Container>
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ py: 3 }}>
          <UppercaseTitle text="at a glance" />
          <AtAGlance />
        </Container>
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ py: 3, pt: 0 }}>
          <Typography variant="body1" color="text.secondary">
            {parse(jsonData.publicOutdoorStations.content, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
        </Container>
        <AQImap
          tileOption={TileOptions.default}
          themePreference={themePreference}
          temperatureUnitPreference={temperatureUnitPreference}
          centerCoordinates={[24.46, 54.52]}
          maxBounds={[
            [22.608292, 51.105185],
            [26.407575, 56.456571],
          ]}
          mapData={publicMapData}
          ariaLabel={`Map of ${CITIESair} public outdoor air quality stations in Abu Dhabi`}
        />

      </FullWidthBox>

      <Divider />

      <FullWidthBox id={jsonData.about.id} sx={{ pt: 3, pb: 4 }}>
        <Container>
          <About />
        </Container>
      </FullWidthBox>

      <Divider />

      <FullWidthBox id={jsonData.getInTouch.id} sx={{ pt: 3, pb: 4 }}>
        <Container>
          <GetInTouch />
        </Container>
      </FullWidthBox>

    </Box >
  );
}

export default Home;
