import { useEffect, useContext, useState } from 'react';

import { Button, Box, Grid, Stack, Typography, Container, Card, CardContent, CardMedia, CardActionArea, Divider, Tooltip } from '@mui/material';
import { LinkContext } from '../../ContextProviders/LinkContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

// import AtAGlance from './AtAGlance';
import About from './About';

import jsonData from '../../section_data.json';

import * as Tracking from '../../Utils/Tracking';
import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';

import Map from './Map';

import CurrentAQIGrid from '../../Components/CurrentAQIGrid';
import { EndPoints, fetchAndProcessCurrentSensorsData, getApiUrl } from '../../Utils/ApiUtils';

import LaunchIcon from '@mui/icons-material/Launch';
import GetInTouch from './GetInTouch';

function Home({ themePreference, temperatureUnitPreference, title }) {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // useState for home page data
  // eslint-disable-next-line no-unused-vars
  const [_, setCurrentPage, __, setChartsTitlesList] = useContext(LinkContext);

  // set underline link to home
  useEffect(() => {
    setCurrentPage('home');
    setChartsTitlesList([]);
  }, [setCurrentPage, setChartsTitlesList]);

  // Fetch public NYUAD sensors data
  const [nyuadCurrentSensorData, setNyuadCurrentSensorData] = useState({});

  useEffect(() => {
    const url = getApiUrl({ endpoint: EndPoints.current, school_id: 'nyuad' });

    fetchAndProcessCurrentSensorsData(url)
      .then((data) => {
        setNyuadCurrentSensorData(data)
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

          <Grid container justifyContent="center" spacing={3}>
            <Grid item textAlign="center" xs={10}>
              <CurrentAQIGrid
                currentSensorsData={nyuadCurrentSensorData}
                isScreen={false}
                temperatureUnitPreference={temperatureUnitPreference}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack width="fit-content" alignItems="center" margin="auto">
                <Button
                  variant='contained'
                  sx={{ width: "fit-content", mb: 1 }}
                  href="https://citiesdashboard.com/project/air-quality"
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <LaunchIcon sx={{ fontSize: '0.8rem' }} />&nbsp;NYUAD Dashboard (Public Access)
                </Button>
                <Typography variant="caption" color="text.secondary">
                  See detailed analysis of historical air quality data at NYUAD
                </Typography>
              </Stack>
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
        <Map themePreference={themePreference} temperatureUnitPreference={temperatureUnitPreference} />

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
