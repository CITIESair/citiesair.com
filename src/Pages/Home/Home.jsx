import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Button, Box, Grid, Stack, Typography, Container, Card, CardContent, CardMedia, CardActionArea, Divider, Tooltip } from '@mui/material';
import { LinkContext } from '../../ContextProviders/LinkContext';
import { HomeDataContext } from '../../ContextProviders/HomePageContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

// import AtAGlance from './AtAGlance';
import About from './About';

import jsonData from '../../section_data.json';
import locations from '../../temp_locations.json';

import * as Tracking from '../../Utils/Tracking';

import Map from './Map';

import LogIn from '../../Components/LogIn';

function Home({ themePreference, title }) {
  // Update the page's title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // useState for home page data
  // eslint-disable-next-line no-unused-vars
  const [_, setCurrentPage, __, setChartsTitlesList] = useContext(LinkContext);
  const [homeData] = useContext(HomeDataContext);

  // set underline link to home
  useEffect(() => {
    setCurrentPage('home');
    setChartsTitlesList([]);
  }, [setCurrentPage, setChartsTitlesList]);

  return (
    <Box width="100%">
      <FullWidthBox>
        <Container sx={{ pt: 3, pb: 4 }}>
          <UppercaseTitle text="air quality at NYUAD" />
          <LogIn />

          {/* Display public sensors at NYUAD (outdoors and indoors) → Link to air quality project of CITIES Dashboard
 */}

          <Stack width="fit-content">
            <Button variant='contained'>
              Historical data
            </Button>
          </Stack>


        </Container>
      </FullWidthBox>

      <FullWidthBox sx={{ backgroundColor: 'customAlternateBackground' }}>
        <Container sx={{ pt: 3 }}>
          <UppercaseTitle text="public stations" />
          {/* Add markers of published stations on IQAir (NYUAD, Cranleigh, LTM, ACS - Khalidiya). For now: there will be links to the published stations. In the future: display live AQI at these locations without clicking on the link to IQAir
 */}
        </Container>
        <Map themePreference={themePreference} />

      </FullWidthBox>

      <Divider />

      <FullWidthBox id={jsonData.about.id} sx={{ pt: 3, pb: 4 }}>
        <Container>
          <Grid container spacing={3}>
            <Grid item id={jsonData.about.id}>
              <About />
            </Grid>
          </Grid>
        </Container>
      </FullWidthBox>
    </Box>
  );
}

export default Home;
