// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvent, Rectangle, CircleMarker } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core';
import L from 'leaflet';

import LaunchIcon from '@mui/icons-material/Launch';

import IQAir_Logo from '../../IQAir_logo.svg';

import { SensorStatus, calculateSensorStatus, getFormattedElapsedTimeFromNow } from '../Screen/ScreenUtils';

import { fetchDataFromURL } from '../../Components/DatasetDownload/DatasetFetcher';

import { getFormattedTemperature, TemperatureUnits } from '../Screen/TemperatureUtils';

import AQIdatabase from '../../Utils/AirQualityIndexHelper';
import convertToAQI from '../../Utils/AirQualityIndexCalculator';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThemePreferences from '../../Themes/ThemePreferences';

import { styled } from '@mui/material/styles';

const StyledLeafletPopup = styled(Popup)(({ theme }) => ({
    '& .leaflet-popup-tip-container': {
        display: 'none !important'
    }
}));


function MapPlaceholder() {
    return (
        <p>
            Map of CITIESair stations in Abu Dhabi
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    )
}

const getTileUrl = ({ themePreference, isMiniMap }) => {
    let tileTheme;
    switch (themePreference) {
        case ThemePreferences.dark:
            tileTheme = isMiniMap ? 'light' : 'dark';
            break
        default:
            tileTheme = isMiniMap ? 'dark' : 'light';
            break
    }
    return `https://{s}.tile.jawg.io/jawg-${tileTheme}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
}
const getMiniMapBoundOptions = ({ themePreference }) => {
    switch (themePreference) {
        case ThemePreferences.dark:
            return {
                fillColor: "#000",
                color: "#000"
            }
        default:
            return {
                fillColor: "#fff",
                color: "#fff"
            }
    }
}
const tileAttribution = '<a href="https://leafletjs.com/" target="_blank"><b>Leaflet</b></a> | <a href="https://jawg.io" target="_blank">&copy; <b>Jawg</b>Maps</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors';
const tileAccessToken = 'N4ppJQTC3M3uFOAsXTbVu6456x1MQnQTYityzGPvAkVB3pS27NMwJ4b3AfebMfjY';
const centerCoordinate = [24.46, 54.52];
const maxBounds = [
    [22.608292, 51.105185], // [Southwest corner coordinates]
    [26.407575, 56.456571], // [Northeast corner coordinates]
];

const MIN_ZOOM = 8;
const MAX_ZOOM = 12;
const DEFAULT_ZOOM = 10;
const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

const Map = ({ themePreference, temperatureUnitPreference }) => {
    const [mapData, setMapData] = useState({});
    const theme = useTheme();

    const url = 'https://api.citiesair.com/map_public_outdoors_stations';

    useEffect(() => {
        fetchDataFromURL(url, 'json').then((data => {
            Object.entries(data).map(([_, location]) => {
                // Calculate if the sensor is currently active or not
                const now = new Date();
                const currentTimestamp = new Date(location.current?.timestamp);
                const lastSeenInHours = Math.round((now - currentTimestamp) / 1000 / 3600);
                if (location.current) {
                    location.current.lastSeenInHours = lastSeenInHours;
                    location.current.sensor_status = calculateSensorStatus(lastSeenInHours);
                }

                // Calculate AQI from raw measurements
                if (location.current?.["pm2.5"]) {
                    const aqiObject = convertToAQI(location.current["pm2.5"]);
                    if (aqiObject) {
                        const aqiCategory = AQIdatabase[aqiObject.aqi_category_index];
                        location.current.aqi = aqiObject.aqi;
                        location.current.category = aqiCategory.category;

                        // Only add color if the sensor is active
                        location.current.color = aqiCategory.lightThemeColor;
                    }
                }

                // Create the marker icon on the map
                location.markerIcon = new L.DivIcon({
                    className: 'aqi-marker-icon',
                    html: `<div onmouseover="this.style.opacity=1;" onmouseleave="this.style.opacity=0.75;" style="width: 2.25rem; height: 2.25rem; background-color: ${location.current.color}; border-radius: 50%; border: solid 2px; display: flex; justify-content: center; align-items: center; font-size: 1rem; font-weight: 500; color: ${themePreference === ThemePreferences.light ? 'black' : 'white'}; opacity: 0.75; :hover: {opacity: 1}">${location.current.aqi || '--'}</div>`

                });
            });
            setMapData(data);
        }));

    }, []);

    function MinimapBounds({ parentMap, zoom }) {
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
                    ...getMiniMapBoundOptions({ themePreference })
                }}
            />
        );
        return null;
    }

    function MinimapControl({ position, zoom, mapData }) {
        const parentMap = useMap()
        const mapZoom = zoom || MIN_ZOOM - 2;

        // Memoize the minimap so it's not affected by position changes
        const minimap = useMemo(
            () => (
                <MapContainer
                    style={{ height: "20vh", width: "30vw", maxWidth: "250px", maxHeight: "200px" }}
                    center={parentMap.getCenter()}
                    zoom={mapZoom}
                    dragging={false}
                    doubleClickZoom={false}
                    scrollWheelZoom={false}
                    attributionControl={false}
                    zoomControl={false}
                >
                    <TileLayer
                        url={getTileUrl({ themePreference, isMiniMap: true })}
                        accessToken={tileAccessToken}
                    />
                    {
                        Object.entries(mapData).map(([key, location]) => (
                            <CircleMarker
                                key={key}
                                center={[location.sensor?.coordinates?.latitude, location.sensor?.coordinates?.longitude]}
                                pathOptions={{
                                    fillColor: location.current?.color,
                                    radius: 3,
                                    weight: 0,
                                    fillOpacity: 1
                                }}
                            >
                            </CircleMarker>

                        ))
                    }
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

    return (
        <Box height="50vh" sx={{
            '& .leaflet-container': { height: "100%", width: "100%" },
            '& .leaflet-control-attribution': { fontSize: '0.5rem' }
        }}>
            <MapContainer
                center={centerCoordinate}
                zoom={DEFAULT_ZOOM}
                maxBounds={maxBounds}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder />}
                attributionControl={false}
            >
                <TileLayer
                    attribution={tileAttribution}
                    url={getTileUrl({ themePreference })}
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    bounds={maxBounds}
                    accessToken={tileAccessToken}
                />
                <AttributionControl position="bottomright" prefix={false} />
                {
                    Object.entries(mapData).map(([key, location]) => (
                        <Marker
                            key={key}
                            position={[location.sensor?.coordinates?.latitude, location.sensor?.coordinates?.longitude]}
                            icon={location.markerIcon}
                        >
                            <StyledLeafletPopup>
                                <Stack direction="row" spacing={3}>
                                    <Link
                                        variant="body1"
                                        fontWeight={500}
                                        href={location.sensor?.public_iqAir_station_link}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        color={`${theme.palette.primary.main}!important`}
                                        underline="hover"
                                    >
                                        {location.sensor?.public_iqAir_station_name}
                                        &nbsp;
                                        <sup>
                                            <LaunchIcon fontSize='0.8rem' />
                                        </sup>
                                    </Link>
                                    <Box>
                                        <img src={IQAir_Logo} />
                                    </Box>
                                </Stack>

                                <Box sx={{ '& *': { color: location.current?.color } }}>
                                    <Typography variant="h3" fontWeight="500" lineHeight={0.9}>
                                        {location.current?.aqi || '--'}
                                        <Typography variant='caption' fontWeight="500">(US AQI)</Typography>
                                    </Typography>

                                    <Typography variant="body1" component="span" fontWeight="500">
                                        {location.current?.category || '--'}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block', fontWeight: 500 }}
                                    gutterBottom
                                >
                                    PM2.5: {location.current?.["pm2.5"] || '--'}µg/m<sup>3</sup>
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block', fontWeight: 500 }}
                                    gutterBottom
                                >
                                    <ThermostatIcon sx={{ fontSize: '1rem', verticalAlign: 'sub' }} />
                                    {
                                        getFormattedTemperature({
                                            rawTemp: location.current?.temperature,
                                            currentUnit: TemperatureUnits.celsius,
                                            returnUnit: temperatureUnitPreference
                                        })}
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <WaterDropIcon sx={{ fontSize: '1rem', verticalAlign: 'sub' }} />
                                    {location.current?.rel_humidity ? Math.round(location.current?.rel_humidity) : "--"}%
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>

                                </Typography>
                                <Box>
                                    <Typography variant='caption' sx={{ mt: 0 }}>
                                        Last update:
                                        {location.current?.timestamp
                                            ? ` ${getFormattedElapsedTimeFromNow(location.current.timestamp)} ago (${new Date(location.current.timestamp).toLocaleString()})`
                                            : '--'}
                                    </Typography>
                                </Box>
                            </StyledLeafletPopup>
                        </Marker>

                    ))
                }
                <MinimapControl position="bottomleft" mapData={mapData} />

            </MapContainer>
        </Box>
    )
}

export default Map;