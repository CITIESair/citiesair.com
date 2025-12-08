
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material/';
import { useMediaQuery, useTheme } from '@mui/material';
import AQImap from '../AirQualityMap/AQImap';
import { LocationTitles } from '../AirQualityMap/AirQualityMapUtils';
import { TileOptions } from '../AirQualityMap/AirQualityMapUtils';
import CurrentAQIGrid from './CurrentAQIGrid';
import SimpleAQIList from './SimpleAQIList';
import { CurrentAQIGridSize } from './CurrentAQIGridSize';
import { PreferenceContext } from '../../../ContextProviders/PreferenceContext';
import ThemePreferences from '../../../Themes/ThemePreferences';
import { KAMPALA, NYUAD } from '../../../Utils/GlobalVariables';
import { useNetworkStatusContext } from '../../../ContextProviders/NetworkStatusContext';
import AQIScale from './AQIScale';

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

const CurrentAQIMapWithGrid = (props) => {
    const {
        currentSensorsData,
        schoolID,
        disableInteraction = false,
        isOnBannerPage = true,
        defaultZoom,
        maxBounds,
        maxWidth = "lg",
        minMapHeight = "230px",
        sx,
        size = CurrentAQIGridSize.medium
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
                setMapData([...currentSensorsData]);
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

    const { isServerDown } = useNetworkStatusContext();

    const groupedSensorsBySortingId = useMemo(() => {
        if (!currentSensorsData) return { sensorsWithSortingId: [], sensorsWithoutSortingId: [] };

        const sensorsWithSortingId = {};
        const sensorsWithoutSortingId = [];

        currentSensorsData.forEach(item => {
            let rawId = item.sensor.sorting_id;

            // Prevent null → 0 conversion
            let sortingId = rawId == null ? null : Math.floor(Number(rawId));

            // Handle NaN cases
            if (!Number.isFinite(sortingId)) sortingId = null;

            if (sortingId == null) {
                sensorsWithoutSortingId.push(item);
            } else {
                if (!sensorsWithSortingId[sortingId]) {
                    sensorsWithSortingId[sortingId] = [];
                }
                sensorsWithSortingId[sortingId].push(item);
            }
        });

        // Convert map → sorted array: [row1, row2, row3, ...]
        const rows = Object.keys(sensorsWithSortingId)
            .sort((a, b) => Number(a) - Number(b))
            .map(key => sensorsWithSortingId[key]);

        return { sensorsWithSortingId: rows, sensorsWithoutSortingId };
    }, [currentSensorsData]);

    return (
        <Grid
            container
            item
            overflow="hidden"
            flex={1}
            maxWidth={maxWidth}
            margin="auto"
            alignItems="space-around"
            backgroundColor={isOnBannerPage ? "#f5f5f5" : "customAlternateBackground"}
            gap={2}
            justifyContent="center"
            sx={{ ...sx }}
        >
            {
                isOnBannerPage &&
                <Grid
                    item
                    xs={12}
                    sx={{
                        p: 1,
                        pt: isServerDown ? (isSmallScreen ? 7 : 9) : 1,
                        pb: 0,
                        m: 0,
                        mt: isSmallScreen ? 3 : 1,
                        mb: isSmallScreen ? -6 : 0
                    }}
                >
                    <Typography color="text.primary" variant="h5" textAlign="center" fontWeight="500">
                        {schoolID?.toUpperCase()} Air Quality
                    </Typography>
                </Grid>
            }

            <Grid item xs={12} sm={6}>
                <Box
                    height="100%"
                    minHeight={minMapHeight}
                    sx={{
                        '& .leaflet-container': {
                            borderRadius: (isSmallScreen === false && isOnBannerPage === false && maxWidth) && theme.shape.borderRadius
                        },
                        '& .leaflet-marker-icon': {
                            cursor: (isSmallScreen && isOnBannerPage) && "default"
                        }
                    }}
                >
                    <AQImap
                        tileOption={isNYUAD ? TileOptions.nyuad : TileOptions.default}
                        shouldCluster={!isNYUAD}
                        themePreference={isOnBannerPage ? ThemePreferences.light : themePreference}
                        centerCoordinates={
                            isNYUAD ?
                                returnSpecialCenterCoordinatesForNYUAD(isOnBannerPage) :
                                null
                        }
                        minZoom={defaultZoom ? defaultZoom - 1 : returnDefaultZoom(schoolID) - 1}
                        maxZoom={defaultZoom ? defaultZoom + 1 : returnDefaultZoom(schoolID) + 1}
                        maxBounds={maxBounds}
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
                        <Box sx={{ mt: isSmallScreen ? -4 : -10, zIndex: 500, position: "relative" }}>
                            <CurrentAQIGrid
                                currentSensorsData={currentSensorsData?.slice(0, 1)}
                                showWeather={true}
                                showWeatherText={true}
                                showHeatIndex={false}
                                showAQI={false}
                                showRawMeasurements={false}
                                roundTemperature={true}
                                size={size ? size :
                                    (isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium)
                                }
                                showLastUpdate={true}
                            />
                        </Box>
                    ) : null
                }
            </Grid>

            {
                // Don't display the AQI grids when on smallScreen banner page
                // Only display an AQIScale
                (isOnBannerPage === true && isSmallScreen === true) ? (
                    <Grid item xs sx={{ mt: 3, px: 1 }}>
                        <AQIScale
                            size={size}
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
                            spacing={isOnBannerPage === false ? 2 : 0}
                        >
                            {groupedSensorsBySortingId.sensorsWithSortingId.map((sensorsWithTheSameSortingId, index) => {
                                const isFirst = index === 0;

                                return (
                                    <Grid item xs={12} key={index}>
                                        <CurrentAQIGrid
                                            currentSensorsData={sensorsWithTheSameSortingId}
                                            showWeather={!isOnBannerPage}
                                            showHeatIndex={isFirst ? !isOnBannerPage : false}
                                            showRawMeasurements={!isOnBannerPage}
                                            showLastUpdate={isFirst ? true : !isOnBannerPage}
                                            roundTemperature={isOnBannerPage}
                                            size={
                                                size ||
                                                (isFirst
                                                    ? (isSmallScreen ? CurrentAQIGridSize.small : CurrentAQIGridSize.medium)
                                                    : CurrentAQIGridSize.small)
                                            }
                                        />
                                    </Grid>
                                );
                            })}

                            <Grid item xs={isSmallScreen ? 10 : 12} mb={1}>
                                <SimpleAQIList
                                    currentSensorsData={groupedSensorsBySortingId.sensorsWithoutSortingId}
                                    useLocationShort={isSmallScreen}
                                    isOnBannerPage={isOnBannerPage}
                                    showCategory={false}
                                    size={size}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item xs={1.5} sm={12} textAlign="left" my={isSmallScreen ? 2 : 1}>
                            <AQIScale
                                size={size}
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

export default CurrentAQIMapWithGrid;