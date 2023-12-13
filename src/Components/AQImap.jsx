// disable eslint for this file
/* eslint-disable */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvent, Rectangle, CircleMarker, Tooltip } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core';
import L from 'leaflet';

import LaunchIcon from '@mui/icons-material/Launch';

import IQAir_Logo from '../IQAir_logo.svg';

import { SensorStatus, calculateSensorStatus, getFormattedElapsedTimeFromNow } from '../Pages/Screen/ScreenUtils';

import { getFormattedTemperature, TemperatureUnits } from '../Pages/Screen/TemperatureUtils';

import AQIdatabase from '../Utils/AirQualityIndexHelper';
import convertToAQI from '../Utils/AirQualityIndexCalculator';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThemePreferences from '../Themes/ThemePreferences';

import { styled } from '@mui/material/styles';
import CustomThemes from '../Themes/CustomThemes';

const StyledLeafletPopup = styled(Popup)(({ theme }) => ({
    '& .leaflet-popup-tip-container': {
        display: 'none !important'
    }
}));

const MapPlaceholder = ({ placeholderText }) => {
    return (
        <p>
            {placeholderText}
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    )
}
export const TileOptions = {
    default: 'default',
    nyuad: 'nyuad'
};

const Tiles = {
    default: {
        light: 'jawg-light',
        dark: 'jawg-dark'
    },
    nyuad: {
        light: 'b6b5a641-4123-4535-b8e7-3b6711fd430b',
        dark: '407650b3-59a3-49fe-8c1c-bedcd4a8e6b5'
    }
}

const getTileUrl = ({ tileOption, themePreference, isMiniMap }) => {
    let tileTheme;
    switch (themePreference) {
        case ThemePreferences.dark:
            tileTheme = isMiniMap ? 'light' : 'dark';
            break
        default:
            tileTheme = isMiniMap ? 'dark' : 'light';
            break
    }
    return `https://{s}.tile.jawg.io/${Tiles[tileOption][tileTheme]}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
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

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

export const TypeOfAQImap = {
    publicOutdoorStations: 'publicOutdoorStations',
    nyuadSensors: 'nyuadSensors'
}

const AQImap = (props) => {
    const {
        tileOption,
        themePreference,
        temperatureUnitPreference,
        placeholderText,
        centerCoordinates,
        maxBounds,
        minZoom = 8,
        maxZoom = 12,
        defaultZoom = 10,
        displayMinimap = true,
        rawMapData
    } = props;

    const disableZoomParameters = {
        doubleClickZoom: false,
        attributionControl: false,
        zoomControl: false
    }

    const [mapData, setMapData] = useState({});
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!Array.isArray(rawMapData) || rawMapData.length === 0) return;

        const transformedData = rawMapData.map(location => {
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

                    if (location.current.sensor_status === SensorStatus.active) {
                        location.current.color = aqiCategory.lightThemeColor;
                    } else {
                        location.current.color = CustomThemes.universal.palette.inactiveSensor;
                    }
                }
            }

            // Create the marker icon on the map
            location.markerIcon = new L.DivIcon({
                className: 'aqi-marker-icon',
                html: `<div onmouseover="this.style.opacity=1;" onmouseleave="this.style.opacity=0.75;" style="width: 40px; height: 40px; background-color: ${location.current.color}; border-radius: 50%; border: solid 2px; display: flex; justify-content: center; align-items: center; font-size: 1rem; font-weight: 500; color: ${themePreference === ThemePreferences.light ? 'black' : 'white'}; opacity: 0.75; :hover: {opacity: 1}">${location.current.aqi || '--'}</div>`
            });

            return location;
        });

        setMapData(transformedData);
    }, [rawMapData]);


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
                    ...getMiniMapBoundOptions({ themePreference })
                }}
            />
        );
    }

    const MinimapControl = ({ position, zoom, mapData }) => {
        const parentMap = useMap()
        const mapZoom = zoom || minZoom - 2;

        // Memoize the minimap so it's not affected by position changes
        const minimap = useMemo(
            () => (
                <MapContainer
                    style={{ height: "20vh", width: "30vw", maxWidth: "250px", maxHeight: "200px" }}
                    center={parentMap.getCenter()}
                    zoom={mapZoom}
                    scrollWheelZoom={false}
                    dragging={false}
                    {...disableZoomParameters}
                    attributionControl={false}
                >
                    <TileLayer
                        url={getTileUrl({ tileOption, themePreference, isMiniMap: true })}
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
        <Box sx={{
            height: "50vh",
            [theme.breakpoints.down('md')]: {
                height: '60vh',
            },
            '& .leaflet-container': { height: "100%", width: "100%" },
            '& .leaflet-control-attribution': { fontSize: '0.5rem' },
            '& .leaflet-tooltip': {
                backgroundColor: 'transparent !important',
                border: 'unset',
                boxShadow: 'unset',
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontSize: '0.9rem'
            },
            '& .leaflet-tooltip-bottom:before': {
                borderBottomColor: 'transparent !important',
            }
        }}>
            <MapContainer
                center={centerCoordinates}
                zoom={defaultZoom}
                maxBounds={maxBounds}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder placeholderText={placeholderText} />}
                attributionControl={false}
            >
                {displayMinimap === true && <MinimapControl position="bottomleft" mapData={mapData} />}

                <TileLayer
                    attribution={tileAttribution}
                    url={getTileUrl({ tileOption, themePreference })}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
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
                            <Tooltip
                                permanent={tileOption === TileOptions.nyuad ? true : false}
                                direction="bottom"
                                offset={[15, -40]}
                            >
                                {location.sensor?.location_long}
                            </Tooltip>

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
                                                <img src={IQAir_Logo} />
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


                                <Box sx={{ '& *': { color: location.current?.color } }}>
                                    <Typography variant={smallScreen ? 'h4' : 'h3'} fontWeight="500" lineHeight={0.9}>
                                        {location.current?.aqi || '--'}
                                        <Typography variant='caption' fontWeight="500">(US AQI)</Typography>
                                    </Typography>

                                    <Typography variant={smallScreen ? 'body2' : 'body1'} component="span" fontWeight="500">
                                        {location.current?.category || '--'}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block' }}
                                    gutterBottom
                                >
                                    <Typography variant='caption' fontWeight="500">PM2.5:</Typography>
                                    &nbsp;
                                    {location.current?.["pm2.5"] || '--'}µg/m<sup>3</sup>
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block' }}
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
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant='caption' sx={{ mt: 0 }}>
                                        <Typography variant='caption' fontWeight="500">Last update:</Typography>
                                        {location.current?.timestamp
                                            ? ` ${getFormattedElapsedTimeFromNow(location.current.timestamp)} ago`
                                            : '--'}
                                    </Typography>
                                    <br />
                                    <Typography
                                        variant="caption"
                                        textTransform="capitalize"
                                    >
                                        <Typography variant='caption' fontWeight="500">Status:</Typography>
                                        &nbsp;
                                        {location.current?.sensor_status}
                                    </Typography>
                                </Box>
                            </StyledLeafletPopup>
                        </Marker>

                    ))
                }

            </MapContainer>
        </Box>
    )
}

export default AQImap;