// disable eslint for this file
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
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

function MapPlaceholder() {
    return (
        <p>
            Map of CITIESair stations in Abu Dhabi
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    )
}

const Map = ({ themePreference }) => {
    const [mapData, setMapData] = useState({});
    const theme = useTheme();

    const url = 'https://raw.githubusercontent.com/CITIES-air/cities-air.github.io/main/src/Pages/Home/tmp_data.json';

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
                    html: `<div style="width: 2.25rem; height: 2.25rem; background-color: ${location.current.color}; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1rem; color: white;">${location.current.aqi || '--'}</div>`

                });
            });
            setMapData(data);
        }));

    }, []);

    const tileUrl = `https://{s}.tile.jawg.io/jawg-${themePreference ? themePreference.toLowerCase() : 'light'}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
    const tileAttribution = '<a href="https://leafletjs.com/" target="_blank"><b>Leaflet</b></a> | <a href="https://jawg.io" target="_blank">&copy; <b>Jawg</b>Maps</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors';
    const tileAccessToken = 'N4ppJQTC3M3uFOAsXTbVu6456x1MQnQTYityzGPvAkVB3pS27NMwJ4b3AfebMfjY';
    const centerCoordinate = [24.4132075, 54.5181108];

    return (
        <Box height="50vh" sx={{
            '& .leaflet-container': { height: "100%", width: "100%" },
            '& .leaflet-control-attribution': { fontSize: '0.5rem' }
        }}>
            <MapContainer
                center={centerCoordinate}
                zoom={10}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder />}
                attributionControl={false}
            >
                <TileLayer
                    attribution={tileAttribution}
                    url={tileUrl}
                    minZoom={8}
                    maxZoom={12}
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
                            <Popup>
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
                                            returnUnit: TemperatureUnits.celsius
                                        })}
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <WaterDropIcon sx={{ fontSize: '1rem', verticalAlign: 'sub' }} />{location.current?.rel_humidity || '--'}%
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
                            </Popup>
                        </Marker>

                    ))
                }

            </MapContainer>
        </Box>
    )
}

export default Map;