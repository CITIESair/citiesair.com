import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Box, Grid, Stack, Typography, Container, Card, CardContent, CardMedia, CardActionArea, Divider, Tooltip } from '@mui/material';
import { LinkContext } from '../../ContextProviders/LinkContext';
import { HomeDataContext } from '../../ContextProviders/HomePageContext';

import UppercaseTitle from '../../Components/UppercaseTitle';
import FullWidthBox from '../../Components/FullWidthBox';

// import AtAGlance from './AtAGlance';
import About from './About';

import jsonData from '../../section_data.json';
import locations from '../../temp_locations.json';

import * as Tracking from '../../Utils/Tracking';

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
          <UppercaseTitle text="all locations" />

          <Grid container spacing={3} sx={{ justifyContent: { sm: 'center', md: 'start' } }}>
            {Object.entries(locations).map(([key, location], index) => (
              <Grid key={index} item xs={12} sm={9} md={6} lg={4}>
                <Link
                  to={`/${key}`}
                  onClick={() => {
                    Tracking.sendEventAnalytics(
                      Tracking.Events.internalNavigation,
                      {
                        destination_id: `/${key}`,
                        destination_label: key,
                        origin_id: 'home'
                      }
                    );
                  }}
                >
                  {location.name}
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
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
