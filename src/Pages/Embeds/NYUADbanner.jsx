// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Box, Grid, Link, Typography, Stack, Tooltip } from '@mui/material/';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import FullWidthBox from '../../Components/FullWidthBox';
import * as Tracking from '../../Utils/Tracking';
import AQImap, { TileOptions } from '../../Components/AQImap';
import { EndPoints, fetchAndProcessCurrentSensorsData, getApiUrl } from '../../Utils/ApiUtils';
import ThemePreferences from '../../Themes/ThemePreferences';
import CurrentAQIGrid, { SimpleCurrentAQIlist } from '../../Components/CurrentAQIGrid';
import CustomThemes from '../../Themes/CustomThemes';
import AQIdatabase from '../../Utils/AirQualityIndexHelper';

const Host = {
  "students-portal": {
    name: "Students Portal",
    detailedPageUrl: "https://students.nyuad.nyu.edu/services/safety-and-awareness/nyuad-air-quality-index/"
  },
  "intranet": {
    name: "Intranet",
    detailedPageUrl: "https://intranet.nyuad.nyu.edu/administrative-services/operations-and-facilities/campus-maps-facilities/nyuad-air-quality-index/"
  }
}

const NYUADbanner = () => {
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hostParam = queryParams.get('host') || 'students-portal';
  const isWidget = queryParams.get('isWidget')?.toLowerCase() === 'true';

  const zoomLevel = isSmallScreen ? 16 : 17;

  const [nyuadCurrentData, setNYUADcurrentData] = useState();
  const [outdoorLocations, setOutdoorLocations] = useState();
  const [featuredIndoorLocations, setFeaturedIndoorLocations] = useState();
  const [otherIndoorLocations, setOtherIndoorLocations] = useState();

  const [isHovered, setIsHovered] = useState(false);

  const url = getApiUrl({
    endpoint: EndPoints.current,
    school_id: 'nyuad'
  });

  useEffect(() => {
    fetchAndProcessCurrentSensorsData(url)
      .then((data) => {
        setNYUADcurrentData(data);

        // Filter outdoor and featured indoor locations
        const outdoorLocations = data.filter(obj => obj?.sensor?.location_type === "outdoors");
        const featuredIndoorLocations = data.filter(obj => ["c2", "d2"].includes(obj?.sensor?.location_short));

        const otherIndoorLocations = data.filter(obj => !["c2", "d2"].includes(obj?.sensor?.location_short) && obj?.sensor?.location_type != "outdoors");

        // Sort otherIndoorLocations alphabetically by location_long
        otherIndoorLocations.sort((a, b) => {
          if (a?.sensor?.location_long < b?.sensor?.location_long) return -1;
          if (a?.sensor?.location_long > b?.sensor?.location_long) return 1;
          return 0;
        });

        setOutdoorLocations(outdoorLocations);
        setFeaturedIndoorLocations(featuredIndoorLocations);
        setOtherIndoorLocations(otherIndoorLocations);
      })
      .catch((error) => console.log(error))
  }, []);

  return (
    <Grid container overflow="hidden" flex={1}>
      <Grid item xs={12} sm={6}>
        <Box
          height="100%"
          minHeight="190px"
          sx={{
            '& .leaflet-marker-icon': {
              cursor: isSmallScreen && "default"
            },
            ...(isSmallScreen ? { borderBottom: "solid 0.5px" } : { borderRight: "solid 0.5px" })
          }}
        >
          <AQImap
            tileOption={TileOptions.nyuad}
            themePreference={ThemePreferences.light}
            placeholderText={"Map of CITIESair air quality sensors on NYUAD campus."}
            centerCoordinates={[isWidget ? 24.5239 : 24.5235, 54.43449]}
            maxBounds={[
              [24.52, 54.42612],
              [24.53, 54.44079]
            ]}
            defaultZoom={zoomLevel}
            minZoom={zoomLevel}
            maxZoom={zoomLevel}
            disableZoom={true}
            disableInteraction={isSmallScreen}
            showInstruction={!isSmallScreen}
            displayMinimap={false}
            fullSizeMap={true}
            showAttribution={false}
            rawMapData={nyuadCurrentData}
            markerSizeInRem={isWidget ? 0.7 : 0.85}
          />

          {
            isWidget === true && <Typography
              variant="h6"
              position="absolute"
              top={0}
              zIndex={999999}
              width="100%"
              sx={{ mx: 1.5, my: 0.5 }}
            >
              NYUAD Air Quality
            </Typography>
          }
        </Box>
      </Grid>

      <Grid
        container
        item
        xs={12} sm={6}
        justifyContent="space-around"
      >
        <Grid
          container
          item
          xs={9}
          sm={12}
          justifyContent="center"
          textAlign="center"
          my={1}
        >
          <Grid item xs={12} >
            <CurrentAQIGrid
              currentSensorsData={outdoorLocations}
              isScreen={false}
              showHeatIndex={false}
              showLastUpdate={!isWidget}
              useLocationShort={true}
              roundTemperature={true}
            />
          </Grid>

          <Grid item xs={12} sx={{ transform: "scale(0.7)", my: -2 }}>
            <CurrentAQIGrid
              currentSensorsData={featuredIndoorLocations}
              isScreen={false}
              showWeather={false}
              showHeatIndex={false}
              showLastUpdate={false}
            />
          </Grid>

          <Grid item xs={12}>
            <SimpleCurrentAQIlist currentSensorsData={otherIndoorLocations} useLocationShort={(isSmallScreen && isWidget)} />
            <SimpleCurrentAQIlist currentSensorsData={otherIndoorLocations} useLocationShort={(isSmallScreen && isWidget)} />
            <SimpleCurrentAQIlist currentSensorsData={otherIndoorLocations} useLocationShort={(isSmallScreen && isWidget)} />
            <SimpleCurrentAQIlist currentSensorsData={otherIndoorLocations} useLocationShort={(isSmallScreen && isWidget)} />
          </Grid>
        </Grid>

        <Grid container item xs={1.5} sm={11} textAlign="left" my={isSmallScreen ? 2 : 1}>
          <Stack
            direction={isSmallScreen ? "column-reverse" : "row"}
            justifyContent="center"
            flex={1}
          >
            {AQIdatabase.map((element, index) => (
              <Tooltip
                title={element.category}
                slotProps={{
                  popper: {
                    modifiers: [
                      { name: 'offset', options: { offset: [0, -14] } }
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
                  >
                    <small>{element.aqiUS.low === 301 ? '300+' : Math.round(element.aqiUS.low / 50) * 50}</small>
                  </Typography>
                  <Box
                    backgroundColor={element.lightThemeColor}
                    width={isSmallScreen ? "0.35rem" : "100%"}
                    height={isSmallScreen ? "100%" : "0.5rem"}
                  />
                  {(isSmallScreen === false && isWidget === false) &&
                    <Typography
                      variant="caption"
                      lineHeight={0.9}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2
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

      {/* 
      <Link
        href={Host[hostParam].detailedPageUrl}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          backgroundColor={isHovered ? '#d2d4d5' : 'rgba(0,0,0,0.6)'}
          height="57px"
          width="57px"
          bottom={0}
          right={0}
        >
          <GoIcon />
        </Box>
      </Link> */}
    </Grid>

  );
};

const GoIcon = () => {
  return (
    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" xmlSpace="preserve">
      <path fill="#FFFFFF" d="M19.438,2.798v8.29c0,0-7.646,0.037-12.288,3.937c-5.66,4.756-7.681,13.865-6.918,12.901
 	c7.11-8.985,19.206-8.427,19.206-8.427v8.375L32,15.651L19.438,2.798z"/>
    </svg>
  );
};


export default NYUADbanner;
