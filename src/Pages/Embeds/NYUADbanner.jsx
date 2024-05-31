// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, Stack, Tooltip } from '@mui/material/';
import { useMediaQuery, useTheme } from '@mui/material';

import AQImap, { LocationTitle, TileOptions } from '../../Components/AirQuality/AQImap';
import { GeneralEndpoints, fetchAndProcessCurrentSensorsData, getApiUrl } from '../../Utils/ApiUtils';
import CurrentAQIGrid, { SimpleCurrentAQIlist } from '../../Components/AirQuality/CurrentAQIGrid';
import AQIdatabase from '../../Utils/AirQuality/AirQualityIndexHelper';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import ThemePreferences from '../../Themes/ThemePreferences';

const NYUADbanner = (props) => {
  const { themePreference, setThemePreference } = useContext(PreferenceContext);

  const {
    initialNyuadCurrentData = null,
    isOnBannerPage = true,
    minMapHeight = "250px"
  } = props;

  const theme = useTheme();

  // Update the themePreference to dark for isOnBannerPage
  // when the component is mounted and reset it when the component is unmounted
  useEffect(() => {
    if (isOnBannerPage) {
      const previousTheme = themePreference;
      setThemePreference(ThemePreferences.dark);

      return () => {
        setThemePreference(previousTheme);
      };
    }
  }, [isOnBannerPage, setThemePreference, themePreference]);

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
  const [featuredIndoorLocations1, setFeaturedIndoorLocations1] = useState();
  const [featuredIndoorLocations2, setFeaturedIndoorLocations2] = useState();
  const [otherIndoorLocations, setOtherIndoorLocations] = useState();

  const url = getApiUrl({
    endpoint: GeneralEndpoints.current,
    school_id: 'nyuad'
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
    const featuredIndoorLocations1 = nyuadCurrentData.filter(obj => ["c2"].includes(obj?.sensor?.location_short));
    const featuredIndoorLocations2 = nyuadCurrentData.filter(obj => ["d2"].includes(obj?.sensor?.location_short));
    const otherIndoorLocations = nyuadCurrentData.filter(obj => !["c2", "d2"].includes(obj?.sensor?.location_short) && obj?.sensor?.location_type != "outdoors");

    // Sort otherIndoorLocations alphabetically by location_long
    otherIndoorLocations.sort((a, b) => {
      if (a?.sensor?.location_long < b?.sensor?.location_long) return -1;
      if (a?.sensor?.location_long > b?.sensor?.location_long) return 1;
      return 0;
    });

    setOutdoorLocations(outdoorLocations);
    setFeaturedIndoorLocations1(featuredIndoorLocations1);
    setFeaturedIndoorLocations2(featuredIndoorLocations2);
    setOtherIndoorLocations(otherIndoorLocations);
  }, [nyuadCurrentData]);


  return (
    <Grid container overflow="hidden" flex={1}>
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
            placeholderText={"Map of CITIESair air quality sensors on NYUAD campus."}
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
            rawMapData={nyuadCurrentData}
            markerSizeInRem={isSmallScreen ? 0.75 : 0.9}
          />

        </Box>
      </Grid>

      <Grid
        container
        item
        xs={12} sm={6}
        justifyContent="space-around"
        my={isSmallScreen ? 0 : 1}
        px={1}
      >
        <Grid
          container
          item
          xs={9}
          sm={12}
          justifyContent="center"
          textAlign="center"
          spacing={isOnBannerPage === false && 1}
        >
          <Grid item xs={12} >
            <CurrentAQIGrid
              currentSensorsData={outdoorLocations}
              isScreen={false}
              showHeatIndex={false}
              useLocationShort={true}
              roundTemperature={isOnBannerPage && true}
            />
          </Grid>

          <Grid item container xs={12} sx={isOnBannerPage && { mt: -2 }} >
            <Grid item xs={6} sx={isOnBannerPage && { transform: "scale(0.7)" }}>
              <CurrentAQIGrid
                currentSensorsData={featuredIndoorLocations1}
                isScreen={false}
                showWeather={!isOnBannerPage}
                showHeatIndex={false}
                showLastUpdate={!isOnBannerPage}
              />
            </Grid>
            <Grid item xs={6} sx={isOnBannerPage && { transform: "scale(0.7)" }}>
              <CurrentAQIGrid
                currentSensorsData={featuredIndoorLocations2}
                isScreen={false}
                showWeather={!isOnBannerPage}
                showHeatIndex={false}
                showLastUpdate={!isOnBannerPage}
              />
            </Grid>

          </Grid>

          {(isOnBannerPage === true && isSmallScreen === true) ? null :
            <Grid item xs={12} mb={1}>
              <SimpleCurrentAQIlist
                currentSensorsData={otherIndoorLocations}
                useLocationShort={true}
                smallFont={isOnBannerPage}
              />
            </Grid>}
        </Grid>

        <Grid container item xs={1.5} sm={12} textAlign="left" my={isSmallScreen ? 2 : 1}>
          <Stack
            direction={isSmallScreen ? "column-reverse" : "row"}
            justifyContent="center"
            flex={1}
          >
            {AQIdatabase.map((element, index) => (
              <Tooltip
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
                    <small>{element.aqiUS.low === 301 ? '300+' : element.aqiUS.low}</small>
                  </Typography>
                  <Box
                    backgroundColor={element.lightThemeColor}
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
