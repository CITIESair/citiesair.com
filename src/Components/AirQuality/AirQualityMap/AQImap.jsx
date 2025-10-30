// disable eslint for this file
/* eslint-disable */
import { useState, useMemo, useCallback, useContext } from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvent, Rectangle, CircleMarker, ImageOverlay } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEventHandlers } from '@react-leaflet/core';

import LaunchIcon from '@mui/icons-material/Launch';

import { getFormattedLastSeen, SensorStatus } from "../SensorStatus";

import { getFormattedTemperature, TemperatureUnits } from '../../../Utils/AirQuality/TemperatureUtils';

import { styled } from '@mui/material/styles';
import { PreferenceContext } from '../../../ContextProviders/PreferenceContext';
import { calculateCenterAndBounds, disableInteractionParameters, disableZoomParameters, displayAqiCategory, displayAqiValue, displayPM2_5, FitMapToDatapoints, getMiniMapColors, getTileUrl, MapPlaceholder, POSITION_CLASSES, tileAccessToken, tileAttribution, TileOptions } from './AirQualityMapUtils';
import { isValidArray } from '../../../Utils/UtilFunctions';
import LoadingAnimation from '../../LoadingAnimation';
import { DataTypeKeys, DataTypes } from '../../../Utils/AirQuality/DataTypes';
import getAQIDivIcon from './AQIDivIcon';
import { calculateAQI } from '../../../Utils/AirQuality/aqiCalculator';

const StyledLeafletPopup = styled(Popup)(({ theme }) => ({
    '& .leaflet-popup-tip-container': {
        display: 'none !important'
    }
}));

const AQImap = (props) => {
    const { themePreference, temperatureUnitPreference, language } = useContext(PreferenceContext);
    const {
        overridenThemePreference = null,
        tileOption,
        centerCoordinates,
        maxBounds,
        minZoom = 8,
        maxZoom = 14,
        defaultZoom,
        disableInteraction = false,
        displayMinimap = true,
        fullSizeMap = false,
        showAttribution = true,
        locationTitle,
        mapData,
        markerSizeInRem = 1,
        shouldCluster = true,
        ariaLabel = "A map of air quality sensors",
    } = props;


    // Filter out invalid mapData entries 
    const sanitizedMapData = useMemo(() => {
        if (!isValidArray(mapData)) return [];

        return mapData
            // Filter invalid coordinates
            .filter((location) => {
                const coords = location?.sensor?.coordinates;
                return (
                    coords &&
                    typeof coords.latitude === "number" &&
                    typeof coords.longitude === "number" &&
                    !Number.isNaN(coords.latitude) &&
                    !Number.isNaN(coords.longitude)
                );
            })
            // Sort by lastSeenInMinutes (descending)
            // So most recently updated sensors are plotted last (on top)
            .sort((a, b) => {
                const aRaw = a?.sensor?.lastSeenInMinutes;
                const bRaw = b?.sensor?.lastSeenInMinutes;

                const aNum = Number.isFinite(Number(aRaw)) ? Number(aRaw) : -Infinity;
                const bNum = Number.isFinite(Number(bRaw)) ? Number(bRaw) : -Infinity;

                return bNum - aNum; // descending (newest first)
            });
    }, [mapData]);

    // Calculate the center coordinate dynamically
    const { center, fitBounds, maxBounds: computedMaxBounds } = useMemo(
        () => {
            const coords = Object.values(sanitizedMapData).map(loc => ({
                latitude: loc.sensor.coordinates.latitude,
                longitude: loc.sensor.coordinates.longitude
            }));
            return calculateCenterAndBounds(coords);
        },
        [sanitizedMapData]
    );

    // If the parent component passes an overridenThemePreference prop (e.g. 'dark' or 'light'),
    // use that instead of the global themePreference from context.
    const effectiveThemePreference = overridenThemePreference || themePreference;

    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const MinimapBounds = ({ parentMap, zoom }) => {
        const minimap = useMap()

        // Clicking a point on the minimap sets the parent's map center
        const onClick = useCallback(
            (e) => {
                parentMap.setView(e.latlng, parentMap.getZoom())
            },
            [parentMap],
        )
        useMapEvent('click', onClick)

        // Keep track of bounds in state to trigger renders
        const [bounds, setBounds] = useState(parentMap.getBounds())
        const onChange = useCallback(() => {
            setBounds(parentMap.getBounds())
            // Update the minimap's view to match the parent map's center and zoom
            minimap.setView(parentMap.getCenter(), zoom)
        }, [minimap, parentMap, zoom])

        // Listen to events on the parent map
        const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
        useEventHandlers({ instance: parentMap }, handlers)

        return (
            <Rectangle
                bounds={bounds}
                pathOptions={{
                    weight: 1,
                    ...getMiniMapColors({ themePreference: effectiveThemePreference })
                }}
            />
        );
    }

    const MinimapControl = ({ position, zoom, mapData }) => {
        const parentMap = useMap();
        const mapZoom = zoom || minZoom - 2;
        const theme = useTheme();

        // Memoize the minimap so it's not affected by position changes
        const minimap = useMemo(
            () => (
                <MapContainer
                    style={{ height: "20vh", width: "30vw", maxWidth: "250px", maxHeight: "200px" }}
                    center={parentMap.getCenter()}
                    zoom={mapZoom}
                    scrollWheelZoom={false}
                    {...disableInteractionParameters} // always disable interaction for minimap
                    {...disableZoomParameters} // always disable zoom for minimap
                    attributionControl={false}
                >
                    <TileLayer
                        url={getTileUrl({ tileOption, themePreference: effectiveThemePreference, isMiniMap: true })}
                        accessToken={tileAccessToken}
                    />
                    {mapData
                        ? Object.entries(mapData)
                            .filter(([_, location]) => {
                                const coords = location.sensor?.coordinates;
                                return (
                                    coords &&
                                    typeof coords.latitude === 'number' &&
                                    typeof coords.longitude === 'number'
                                );
                            })
                            .map(([key, location]) => (
                                <CircleMarker
                                    key={key}
                                    center={[location.sensor.coordinates.latitude, location.sensor.coordinates.longitude]}
                                    pathOptions={{
                                        fillColor:
                                            location?.current?.aqi?.categoryIndex !== null &&
                                                location?.sensor?.sensor_status === SensorStatus.active
                                                ? theme.palette.text.aqi[location.current.aqi.categoryIndex]
                                                : theme.palette.text.aqi[SensorStatus.offline],
                                        radius: 3,
                                        weight: 0,
                                        fillOpacity: 1,
                                    }}
                                    keyboard={false}
                                />
                            ))
                        : null}

                    <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
                </MapContainer>
            ),
            [],
        )

        const positionClass =
            (position && POSITION_CLASSES[position]) || POSITION_CLASSES.bottomleft
        return (
            <div className={positionClass}>
                <div className="leaflet-control leaflet-bar">{minimap}</div>
            </div>
        )
    }

    // Only render map when data and computed geometry are available
    if (!sanitizedMapData || !isValidArray(center) || !isValidArray(fitBounds)) {
        return (
            <Box
                aria-label={ariaLabel}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: fullSizeMap ? '100%' : '55vh',
                    color: 'text.secondary'
                }}
            >
                <LoadingAnimation />
            </Box>
        );
    }

    const createClusterCustomIcon = (cluster) => {
        // Average PM2.5 for this cluster for AQI calculation 
        const values = cluster
            .getAllChildMarkers()
            .map(m => m?.options?.options?.[DataTypeKeys.pm2_5])   // get raw value (string or number)
            .map(v => (v != null ? Number(v) : NaN))              // convert to Number, null/undefined → NaN
            .filter(Number.isFinite);                             // keep only valid numbers
        const avgPM25 = values.length ? values.reduce((a, b) => a + b) / values.length : null;
        const roundedPM25 = Number.isFinite(avgPM25) ? Math.round(avgPM25 * 10) / 10 : null;
        const { aqi, category, categoryIndex } =
            calculateAQI(roundedPM25, DataTypes[DataTypeKeys.pm2_5].threshold_mapping_name);

        // Aggregate sensor status: at least one sensor active -> this cluster active
        const allStatuses = cluster
            .getAllChildMarkers()
            .map(m => m?.options?.options?.sensor_status)
            .filter(status => status != null);
        const aggregatedStatus = allStatuses.includes(SensorStatus.active)
            ? SensorStatus.active
            : SensorStatus.offline;

        const markerColor = (categoryIndex != null && aggregatedStatus === SensorStatus.active) ? theme.palette.text.aqi[categoryIndex]
            : theme.palette.text.aqi[SensorStatus.offline];

        return getAQIDivIcon({
            theme, markerSizeInRem, markerColor,
            numChildCluster: cluster.getChildCount(),
            location: {
                current: { aqi: { ...category, ...categoryIndex, val: aqi } }
            }
        });
    };

    return (
        <Box
            aria-label={ariaLabel}
            sx={{
                ...(fullSizeMap ? { height: '100%' } : {
                    height: "55vh",
                    [theme.breakpoints.down('md')]: {
                        height: '60vh',
                    },
                }),
                '& .leaflet-container': {
                    height: "100%",
                    width: "100%",
                    background: "transparent"
                },
                '& .leaflet-control-attribution': {
                    ...(showAttribution ? { fontSize: '0.5rem' } : { display: 'none' }),
                },
                '& .leaflet-marker-icon': {
                    cursor: disableInteraction ? 'auto' : 'pointer'
                },
                "& .aqi-marker-icons": {
                    width: "fit-content !important"
                },
                "& .aqi-marker-icons .circle-marker-with-label": {
                    width: `${2.25 * markerSizeInRem}rem`,
                    height: `${2.25 * markerSizeInRem}rem`,
                    borderRadius: '50%',
                    border: `solid ${markerSizeInRem / 8}rem`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: `${markerSizeInRem}rem`,
                    fontWeight: 600,
                    color: 'black',
                    transition: "0.15s ease-in-out",
                    ...(disableInteraction === false && {
                        '&:hover, &:focus': {
                            transform: "scale(1.2)",
                        }
                    })
                },
                '& .aqi-marker-icons .circle-marker-cluster': {
                    position: 'absolute', // sit behind the main marker
                    width: `${3.25 * markerSizeInRem}rem`, // slightly bigger
                    height: `${3.25 * markerSizeInRem}rem`,
                    borderRadius: '50%',
                    opacity: 0.5,
                    top: `calc(-0.5 * ${markerSizeInRem}rem)`, // center behind main circle
                    left: `calc(-0.5 * ${markerSizeInRem}rem)`,
                    zIndex: -1, // behind the main circle
                },
                '& .aqi-marker-icons .point-marker-cluster': {
                    position: 'absolute',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: theme.palette.customBackground,
                    background: theme.palette.text.primary,
                    fontWeight: 500,
                    width: `${1.4 * markerSizeInRem}rem`,
                    height: `${1.4 * markerSizeInRem}rem`,
                    borderRadius: '50%',
                    top: `calc(-0.7 * ${markerSizeInRem}rem)`,
                    right: `calc(-0.7 * ${markerSizeInRem}rem)`
                }
            }}>
            <MapContainer
                center={centerCoordinates || center}
                zoom={defaultZoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                maxBounds={maxBounds || computedMaxBounds}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder placeholderText={ariaLabel} />}
                attributionControl={false}
                {...(disableInteraction ? { ...disableInteractionParameters, ...disableZoomParameters } : {})}
            >
                {/* If defaultZoom isn't supplied, then automatically fit the viewport to the fetched data points  */}
                {!defaultZoom && sanitizedMapData && isValidArray(fitBounds) && <FitMapToDatapoints bounds={fitBounds} />}

                {/* Display mini map here */}
                {displayMinimap === true && <MinimapControl position="bottomleft" mapData={sanitizedMapData} />}

                {/* Use either an image or fetch map tile */}
                {tileOption === TileOptions.nyuad ? (
                    <ImageOverlay
                        url={getTileUrl({ tileOption, themePreference: effectiveThemePreference })}
                        bounds={[[24.521723, 54.43135], [24.52609, 54.43779]]}
                    />
                ) : (
                    <TileLayer
                        attribution={tileAttribution}
                        url={getTileUrl({ tileOption, themePreference: effectiveThemePreference })}
                        bounds={maxBounds}
                        accessToken={tileAccessToken}
                    />
                )}

                {/* Attribution to Leaflet */}
                <AttributionControl position="bottomright" prefix={false} />

                {/* Markers */}
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                    maxClusterRadius={shouldCluster ? markerSizeInRem * 16 * 5 : 1}
                    polygonOptions={{
                        color: theme.palette.text.primary,
                        weight: 2,
                        opacity: 1,
                        fillColor: theme.palette.text.primary,
                        fillOpacity: 0.3
                    }}
                    spiderLegPolylineOptions={{ color: theme.palette.text.primary, opacity: 1 }}
                >
                    {
                        isValidArray(sanitizedMapData) ? sanitizedMapData.map((location, index) => {
                            const markerColor = (location?.current?.aqi?.categoryIndex !== null && location?.sensor?.sensor_status === SensorStatus.active) ?
                                theme.palette.text.aqi[location.current.aqi.categoryIndex] : theme.palette.text.aqi[SensorStatus.offline];

                            const markerIcon = getAQIDivIcon({ theme, markerColor, markerSizeInRem, locationTitle, location });
                            return (
                                <Marker
                                    key={index}
                                    position={[location.sensor?.coordinates?.latitude, location.sensor?.coordinates?.longitude]}
                                    options={{
                                        [DataTypeKeys.pm2_5]: location.current?.[DataTypeKeys.pm2_5],
                                        sensor_status: location?.sensor?.sensor_status
                                    }}
                                    icon={markerIcon}
                                    zIndexOffset={index}
                                    riseOnHover={true}
                                    keyboard={false}
                                    iconAnchor={[0, 0]}
                                >
                                    {
                                        disableInteraction === false &&
                                        <StyledLeafletPopup>
                                            {
                                                location.sensor?.public_iqAir_station_link ?
                                                    <Stack direction="row" spacing={smallScreen ? 1 : 3}>
                                                        <Link
                                                            variant={smallScreen ? 'body2' : 'body1'}
                                                            fontWeight={500}
                                                            href={location.sensor.public_iqAir_station_link}
                                                            target='_blank'
                                                            rel="noopener noreferrer"
                                                            color={`${theme.palette.primary.main}!important`}
                                                            underline="hover"
                                                        >
                                                            {location.sensor?.location_long}
                                                            &nbsp;
                                                            <sup>
                                                                <LaunchIcon fontSize='0.8rem' />
                                                            </sup>
                                                        </Link>
                                                        <Box sx={{
                                                            '& img': {
                                                                height: smallScreen ? "50%" : 'unset'
                                                            }
                                                        }}>
                                                            <img src="/images/iqair_logo.svg" />
                                                        </Box>
                                                    </Stack>
                                                    :
                                                    <Typography
                                                        variant={smallScreen ? 'body2' : 'body1'}
                                                        fontWeight="500"
                                                        sx={{
                                                            margin: '0!important',
                                                            marginBottom: smallScreen === false && '0.25rem !important'
                                                        }}>
                                                        {location.sensor?.location_long}
                                                    </Typography>
                                            }


                                            <Box sx={{ '& *': { color: markerColor }, mb: 2 }}>
                                                <Typography variant={smallScreen ? 'h4' : 'h3'} fontWeight="500" lineHeight={0.9}>
                                                    {displayAqiValue(location)}
                                                    <Typography variant='caption' fontWeight="500">(US AQI)</Typography>
                                                </Typography>

                                                <Typography variant={smallScreen ? 'body2' : 'body1'} component="span" fontWeight="500">
                                                    {displayAqiCategory(location)}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'block' }}
                                            >
                                                <Typography variant='caption' fontWeight="500">PM2.5:</Typography>
                                                &nbsp;
                                                {displayPM2_5(location)}
                                            </Typography>

                                            {
                                                location.sensor?.allowedDataTypes?.includes(DataTypeKeys.temperature_C) && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ display: 'block' }}
                                                    >
                                                        <Typography variant='caption' fontWeight="500">Weather: </Typography>
                                                        {getFormattedTemperature({
                                                            rawTemp: location.current?.temperature,
                                                            currentUnit: TemperatureUnits.celsius,
                                                            returnUnit: temperatureUnitPreference
                                                        })}
                                                        &nbsp;-&nbsp;
                                                        {location.current?.rel_humidity ? Math.round(location.current?.rel_humidity) : "--"}%
                                                    </Typography>
                                                )
                                            }


                                            <Typography variant="caption">
                                                <Typography variant='caption' fontWeight="500">Status:</Typography>
                                                &nbsp;
                                                {
                                                    `${location.sensor?.sensor_status} (${getFormattedLastSeen(location.sensor?.lastSeenInMinutes, language)})`
                                                }
                                            </Typography>
                                        </StyledLeafletPopup>
                                    }

                                </Marker>)
                        }
                        ) : null
                    }
                </MarkerClusterGroup>

            </MapContainer>
        </Box>
    )
}

export default AQImap;