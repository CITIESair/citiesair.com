import { useEffect, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Box, Grid, Typography, Container, Divider } from '@mui/material';
import { LinkContext } from '../../ContextProviders/LinkContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

// import AtAGlance from './AtAGlance';
import About from './About';

import jsonData from '../../section_data.json';

import * as Tracking from '../../Utils/Tracking';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';

import AQImap, { TileOptions } from '../../Components/AirQuality/AQImap';

import CurrentAQIGrid from '../../Components/AirQuality/CurrentAQIGrid';
import { GeneralEndpoints, fetchAndProcessCurrentSensorsData, getApiUrl } from '../../Utils/ApiUtils';

import BarChartIcon from '@mui/icons-material/BarChart';
import GetInTouch from './GetInTouch';
import { UniqueRoutes } from '../../Utils/RoutesUtils';
import { SensorStatus } from "../../Components/AirQuality/SensorStatus";

const displayNyuadSensorCounts = (nyuadSensorCounts) => {
  if (nyuadSensorCounts.active && nyuadSensorCounts.total) {
    return (
      <Typography variant='body2' color="text.secondary">
        <b>NYUAD sensors status: </b>{nyuadSensorCounts.active} active out of {nyuadSensorCounts.total}
      </Typography>
    );
  }
  else return null;
}

function Home({ themePreference, temperatureUnitPreference, title }) {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { setCurrentPage, setChartsTitlesList } = useContext(LinkContext);

  // set underline link to home
  useEffect(() => {
    setCurrentPage(UniqueRoutes.home);
    setChartsTitlesList([]);
  }, [setCurrentPage, setChartsTitlesList]);

  // Fetch public NYUAD sensors data and public map data
  const [nyuadCurrentSensorData, setNyuadCurrentSensorData] = useState({});
  const [nyuadSensorCounts, setNyuadSensorCounts] = useState({
    active: null,
    total: null
  });
  const [rawMapData, setRawMapData] = useState();

  useEffect(() => {
    const nyuadUrl = getApiUrl({ endpoint: GeneralEndpoints.current, school_id: 'nyuad' });
    fetchAndProcessCurrentSensorsData(nyuadUrl)
      .then((data) => {
        // Only display 3 sensors in the homepage
        const selectedSensorData = data.slice(0, 3);
        setNyuadCurrentSensorData(selectedSensorData);

        // Count the number of active sensors at NYUAD to display it
        const activeSensorCount = data.reduce((count, obj) => {
          return obj?.current?.sensor_status === SensorStatus.active ? count + 1 : count;
        }, 0);
        setNyuadSensorCounts({
          active: activeSensorCount,
          total: data.length
        });
      })
      .catch((error) => console.log(error));

    const mapUrl = getApiUrl({ endpoint: GeneralEndpoints.map });
    fetchAndProcessCurrentSensorsData(mapUrl)
      .then((data) => {
        setRawMapData(data)
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <Box width="100%">
      <FullWidthBox>
        <Container sx={{ pt: 3, pb: 4 }}>
          <UppercaseTitle text="real-time air quality at NYUAD" />
          <Typography variant='body1' color='text.secondary' sx={{ mt: -2, mb: 2 }}>
            PM2.5 (Particulate Matter Smaller Than 2.5 Micrometer)
          </Typography>

          <Grid container spacing={2} justifyContent="center" textAlign="center">
            <Grid item xs={12} lg={10}>
              <CurrentAQIGrid
                currentSensorsData={nyuadCurrentSensorData}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
                firstSensorOwnLine={true}
              />
            </Grid>

            <Grid item xs={12}>
              {displayNyuadSensorCounts(nyuadSensorCounts)}
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Button
                  component={RouterLink}
                  variant='contained'
                  sx={{ width: "fit-content", mb: 1 }}
                  to={UniqueRoutes.nyuad}
                  onClick={() => {
                    Tracking.sendEventAnalytics(
                      Tracking.Events.internalNavigation,
                      {
                        destination_id: UniqueRoutes.nyuad,
                        destination_school_id: "nyuad",
                        origin_id: UniqueRoutes.home
                      }
                    );
                  }}
                >
                  <BarChartIcon sx={{ fontSize: '0.8rem' }} />&nbsp;NYUAD Dashboard (Public Access)
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  See detailed analysis of historical air quality data at NYUAD
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ py: 3 }}>
          <UppercaseTitle text="public outdoor stations" />
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
          placeholderText={"Map of CITIESair public outdoor air quality stations in Abu Dhabi."}
          centerCoordinates={[24.46, 54.52]}
          maxBounds={[
            [22.608292, 51.105185],
            [26.407575, 56.456571],
          ]}
          rawMapData={rawMapData}
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
