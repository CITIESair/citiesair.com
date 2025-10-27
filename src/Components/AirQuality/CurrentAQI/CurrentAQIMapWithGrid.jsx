
import { useContext, useEffect, useRef, useState } from 'react';
import { Container, Box, Grid, Typography, Stack, Tooltip } from '@mui/material/';
import { useMediaQuery, useTheme } from '@mui/material';

import AQImap from '../AirQualityMap/AQImap';
import { LocationTitles } from '../AirQualityMap/AirQualityMapUtils';
import { TileOptions } from '../AirQualityMap/AirQualityMapUtils';

import CurrentAQIGrid from './CurrentAQIGrid';
import SimpleAQIList from './SimpleAQIList';
import { CurrentAQIGridSize } from './CurrentAQIGridSize';

import { AQI_Database } from '../../../Utils/AirQuality/AirQualityIndexHelper';
import { PreferenceContext } from '../../../ContextProviders/PreferenceContext';
import ThemePreferences from '../../../Themes/ThemePreferences';
import { KAMPALA, NYUAD } from '../../../Utils/GlobalVariables';
import { getTranslation } from '../../../Utils/UtilFunctions';

const returnSpecialCenterCoordinatesForNYUAD = (isOnBannerPage) => {
    return isOnBannerPage ? [24.523, 54.4343] : null
}

const returnDefaultZoom = (currentSchoolID) => {
    switch (currentSchoolID) {
        case NYUAD:
            return 17;
        case KAMPALA:
            return 13;
        default:
            return null;
    }
}

const NUM_SENSORS_FIRST_ROW = 1;
const NUM_SENSORS_SECOND_ROW = 2;

const CurrentAQIMapWithGrid = (props) => {
    const {
        currentSensorsData,
        schoolID,
        disableInteraction = false,
        isOnBannerPage = true,
        minMapHeight = "230px"
    } = props;

    // --- This is needed because Leaflet map won't correctly resize otherwise if data from currentSensorsData is passed directly
    // (Leaflet + React Querry's quirk)
    const [mapData, setMapData] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Whenever schoolID changes, clear pending updates and reset map data
        setMapData(null);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Only schedule new map data update if we have currentSensorsData
        if (currentSensorsData) {
            timeoutRef.current = setTimeout(() => {
                setMapData({ ...currentSensorsData });
            }, 200);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [schoolID, currentSensorsData]);


    const { themePreference } = useContext(PreferenceContext);
    const isNYUAD = schoolID === NYUAD;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const defaultZoom = returnDefaultZoom(schoolID);

    return (
        <Grid
            container
            item
            overflow="hidden"
            flex={1}
            maxWidth="lg"
            margin="auto"
            mb={isNYUAD ? 2 : 4}
            alignItems="stretch"
            backgroundColor={isOnBannerPage ? "#f5f5f5" : "customAlternateBackground"}
            gap={2}
            justifyContent="center"
        >
            {
                isOnBannerPage &&
                <Grid
                    item
                    xs={12}
                    sx={{ p: 1, pb: 0, m: 0, mt: isSmallScreen ? 3 : 1, mb: isSmallScreen ? -6 : 0 }}
                >
                    <Container >
                        <Typography color="text.primary" variant="h5" textAlign="center" fontWeight="500">
                            {schoolID?.toUpperCase()} Air Quality
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
                        tileOption={isNYUAD ? TileOptions.nyuad : TileOptions.default}
                        themePreference={isOnBannerPage ? ThemePreferences.light : themePreference}
                        centerCoordinates={
                            isNYUAD ?
                                returnSpecialCenterCoordinatesForNYUAD(isOnBannerPage) :
                                null
                        }
                        minZoom={defaultZoom - 1}
                        maxZoom={defaultZoom + 1}
                        disableInteraction={isOnBannerPage || disableInteraction}
                        displayMinimap={false}
                        locationTitle={LocationTitles.short}
                        fullSizeMap={true}
                        showAttribution={false}
                        mapData={mapData}
                        markerSizeInRem={isSmallScreen ? 0.75 : 0.9}
                        ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
                    />
                </Box>

                {
                    // Display weather and last update (from the first sensor)
                    (isOnBannerPage === true) ? (
                        <Box textAlign="center" sx={{ mt: isSmallScreen ? -4 : -10 }}>
                            <CurrentAQIGrid
                                currentSensorsData={currentSensorsData?.slice(0, NUM_SENSORS_FIRST_ROW)}
                                showWeather={true}
                                showWeatherText={true}
                                showHeatIndex={false}
                                showAQI={false}
                                showRawMeasurements={false}
                                roundTemperature={true}
                                size={isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium}
                                showLastUpdate={true}
                            />
                        </Box>
                    ) : null
                }
            </Grid>

            {
                // Don't display the AQI grids when on smallScreen banner page
                // Only display an AQIscale
                (isOnBannerPage === true && isSmallScreen === true) ? (
                    <Grid item xs sx={{ mt: 3, px: 1 }}>
                        <AQIscale
                            isSmallScreen={false}
                            isOnBannerPage={isOnBannerPage}
                            showLabel={false}
                        />
                    </Grid>
                ) : (
                    <Grid
                        container
                        item
                        xs
                        justifyContent="space-around" x
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
                            <Grid item xs={12}>
                                <CurrentAQIGrid
                                    currentSensorsData={currentSensorsData?.slice(0, NUM_SENSORS_FIRST_ROW)}
                                    showWeather={!isOnBannerPage}
                                    showHeatIndex={!isOnBannerPage}
                                    showRawMeasurements={!isOnBannerPage}
                                    useLocationShort={true}
                                    roundTemperature={isOnBannerPage && true}
                                    size={isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium}
                                    showLastUpdate={true}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <CurrentAQIGrid
                                    currentSensorsData={currentSensorsData?.slice(NUM_SENSORS_FIRST_ROW, NUM_SENSORS_FIRST_ROW + NUM_SENSORS_SECOND_ROW)}
                                    showWeather={!isOnBannerPage}
                                    showRawMeasurements={!isOnBannerPage}
                                    showHeatIndex={false}
                                    showLastUpdate={!isOnBannerPage}
                                    size={CurrentAQIGridSize.small}
                                />
                            </Grid>

                            <Grid item xs={isSmallScreen ? 10 : 12} mb={1}>
                                <SimpleAQIList
                                    currentSensorsData={currentSensorsData?.slice(NUM_SENSORS_FIRST_ROW + NUM_SENSORS_SECOND_ROW)}
                                    useLocationShort={isSmallScreen}
                                    isOnBannerPage={isOnBannerPage}
                                    showCategory={false}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item xs={1.5} sm={12} textAlign="left" my={isSmallScreen ? 2 : 1}>
                            <AQIscale
                                isSmallScreen={isSmallScreen}
                                isOnBannerPage={isOnBannerPage}
                                showLabel={!isSmallScreen}
                            />
                        </Grid>
                    </Grid>
                )
            }

        </Grid >

    );
};

const AQIscale = ({ isSmallScreen, isOnBannerPage, showLabel = true }) => {
    const { themePreference, language } = useContext(PreferenceContext);

    return (
        <Stack
            direction={isSmallScreen ? "column-reverse" : "row"}
            justifyContent="center"
            flex={1}
        >
            {AQI_Database.map((element, index) => (
                <Tooltip
                    key={index}
                    title={!isOnBannerPage && isSmallScreen && getTranslation(element.category, language)}
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

                        {(showLabel === true) &&
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
                                <small>{getTranslation(element.category, language)}</small>
                            </Typography>
                        }
                    </Stack>
                </Tooltip>
            ))}
        </Stack>
    )
}

export default CurrentAQIMapWithGrid;