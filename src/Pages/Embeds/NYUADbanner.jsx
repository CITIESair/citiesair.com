// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { Container, Box, Grid, Typography, Stack, Tooltip } from '@mui/material/';
import { useMediaQuery, useTheme } from '@mui/material';

import AQImap, { LocationTitle, TileOptions } from '../../Components/AirQuality/AQImap';
import { getApiUrl } from '../../API/ApiUrls';
import { GeneralAPIendpoints } from "../../API/Utils";
import { fetchAndProcessCurrentSensorsData } from '../../API/ApiFetch';
import CurrentAQIGrid, { SimpleCurrentAQIlist } from '../../Components/AirQuality/CurrentAQIGrid';
import { CurrentAQIGridSize } from '../../Components/AirQuality/CurrentAQIGridSize';
import AQIdatabase from '../../Utils/AirQuality/AirQualityIndexHelper';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import ThemePreferences from '../../Themes/ThemePreferences';
import { NYUAD } from '../../Utils/GlobalVariables';

const NYUADbanner = (props) => {
  const { themePreference } = useContext(PreferenceContext);

  const {
    initialNyuadCurrentData = null,
    isOnBannerPage = true,
    minMapHeight = "230px"
  } = props;

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const getCenterCoordinates = () => {
    if (isOnBannerPage) {
      return [24.5238, 54.43449]
    }
    else {
      return [24.5238, 54.4341]
    }
  }

  const zoomLevel = isSmallScreen ? 16.25 : (isOnBannerPage ? 16.75 : 17.25);

  const [nyuadCurrentData, setNYUADcurrentData] = useState(initialNyuadCurrentData);
  const [outdoorLocations, setOutdoorLocations] = useState();
  const [featuredIndoorLocations, setFeaturedIndoorLocations] = useState();
  const [otherIndoorLocations, setOtherIndoorLocations] = useState();

  const url = getApiUrl({
    endpoint: GeneralAPIendpoints.current,
    school_id: NYUAD
  });

  useEffect(() => {
    if (initialNyuadCurrentData) setNYUADcurrentData(initialNyuadCurrentData);

    else {
      fetchAndProcessCurrentSensorsData(url)
        .then((data) => {
          setNYUADcurrentData(data);
        })
        .catch((error) => console.log(error));
    }
  }, [initialNyuadCurrentData]);

  useEffect(() => {
    if (!nyuadCurrentData) return;

    // Filter outdoor and featured indoor locations
    const outdoorLocations = nyuadCurrentData.filter(obj => obj?.sensor?.location_type === "outdoors");
    const featuredIndoorLocations = nyuadCurrentData.filter(obj => ["c2", "d2"].includes(obj?.sensor?.location_short));
    const otherIndoorLocations = nyuadCurrentData.filter(obj => !["c2", "d2"].includes(obj?.sensor?.location_short) && obj?.sensor?.location_type != "outdoors");

    // Sort otherIndoorLocations alphabetically by location_long
    otherIndoorLocations.sort((a, b) => {
      if (a?.sensor?.location_long < b?.sensor?.location_long) return -1;
      if (a?.sensor?.location_long > b?.sensor?.location_long) return 1;
      return 0;
    });

    setOutdoorLocations(outdoorLocations);
    setFeaturedIndoorLocations(featuredIndoorLocations);
    setOtherIndoorLocations(otherIndoorLocations);
  }, [nyuadCurrentData]);


  return (
    <Grid container overflow="hidden" flex={1} maxWidth="lg" margin="auto" backgroundColor="customAlternateBackground">
      {
        isOnBannerPage &&
        <Grid item xs={12} height="fit-content">
          <Container sx={{ p: 1, pb: 0, m: 0 }}>
            <Typography color="text.primary" variant="h5" textAlign="center" fontWeight="500">
              NYUAD Air Quality
            </Typography>
          </Container>
        </Grid>
      }
      <Grid item xs={12} sm={6}>
        <Box
          height="100%"
          minHeight={minMapHeight}
          sx={{
            '& .leaflet-container': {
              borderRadius: (isSmallScreen === false && isOnBannerPage === false) && theme.shape.borderRadius
            },
            '& .leaflet-marker-icon': {
              cursor: (isSmallScreen && isOnBannerPage) && "default"
            }
          }}
        >
          <AQImap
            tileOption={TileOptions.nyuad}
            themePreference={isOnBannerPage ? ThemePreferences.dark : themePreference}
            centerCoordinates={getCenterCoordinates()}
            maxBounds={[
              [24.52, 54.42612],
              [24.53, 54.44079]
            ]}
            defaultZoom={zoomLevel}
            minZoom={zoomLevel}
            maxZoom={isOnBannerPage ? zoomLevel : Math.round(zoomLevel + 1)}
            disableInteraction={isOnBannerPage}
            displayMinimap={false}
            locationTitle={LocationTitle.short}
            fullSizeMap={true}
            showAttribution={false}
            mapData={nyuadCurrentData}
            markerSizeInRem={isSmallScreen ? 0.75 : 0.9}
            ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
          />
        </Box>
      </Grid>

      <Grid
        container
        item
        xs={12} sm={6}
        justifyContent="space-around"
        sx={{ p: 1 }}
      >
        <Grid
          container
          item
          xs={10}
          sm={12}
          justifyContent="center"
          textAlign="center"
          spacing={isOnBannerPage === false ? 1 : 0}
        >
          <Grid item xs={12} >
            <CurrentAQIGrid
              currentSensorsData={outdoorLocations}
              showHeatIndex={!isOnBannerPage}
              showRawMeasurements={!isOnBannerPage}
              useLocationShort={true}
              roundTemperature={isOnBannerPage && true}
              size={isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium}
            />
          </Grid>

          <Grid item xs={12} >
            <CurrentAQIGrid
              currentSensorsData={featuredIndoorLocations}
              showWeather={!isOnBannerPage}
              showRawMeasurements={!isOnBannerPage}
              showHeatIndex={false}
              showLastUpdate={!isOnBannerPage}
              size={CurrentAQIGridSize.small}
            />
          </Grid>

          <Grid item xs={12} mb={1}>
            <SimpleCurrentAQIlist
              currentSensorsData={otherIndoorLocations}
              useLocationShort={isSmallScreen}
              size={isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium}
            />
          </Grid>
        </Grid>

        <Grid container item xs={1.5} sm={12} textAlign="left" my={isSmallScreen ? 2 : 1}>
          <Stack
            direction={isSmallScreen ? "column-reverse" : "row"}
            justifyContent="center"
            flex={1}
          >
            {AQIdatabase.map((element, index) => (
              <Tooltip
                key={index}
                title={!isOnBannerPage && isSmallScreen && element.category}
                slotProps={{
                  popper: {
                    modifiers: [
                      { name: 'offset', options: { offset: [0, -48] } }
                    ],
                  },
                }}
              >
                <Stack
                  direction={isSmallScreen ? "row-reverse" : "column"}
                  width={isSmallScreen ? "auto" : "15%"}
                  justifyContent={isSmallScreen && "flex-end"}
                  alignItems={isSmallScreen && "flex-end"}
                  spacing={0.5}
                  flex={1}
                >
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    lineHeight={1}
                    color="text.secondary"
                  >
                    <small>{element.aqiUS.low === 301 ? '301+' : element.aqiUS.low}</small>
                  </Typography>
                  <Box
                    backgroundColor={element.color[themePreference]}
                    width={isSmallScreen ? "0.35rem" : "100%"}
                    height={isSmallScreen ? "100%" : "0.5rem"}
                  />
                  {(isSmallScreen === false) &&
                    <Typography
                      variant="caption"
                      lineHeight={0.9}
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        px: 0.25
                      }}
                    >
                      <small>{element.category}</small>
                    </Typography>
                  }
                </Stack>
              </Tooltip>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Grid >

  );
};

export default NYUADbanner;
