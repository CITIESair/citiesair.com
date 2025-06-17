// disable eslint for this file
/* eslint-disable */
import { useState, useMemo, useCallback, useContext } from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvent, Rectangle, CircleMarker, ImageOverlay } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core';
import L from 'leaflet';

import LaunchIcon from '@mui/icons-material/Launch';

import { getFormattedLastSeen, SensorStatus } from "./SensorStatus";

import { getFormattedTemperature, TemperatureUnits } from '../../Utils/AirQuality/TemperatureUtils';

import ThemePreferences from '../../Themes/ThemePreferences';

import { styled } from '@mui/material/styles';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';
import { NYUAD } from '../../Utils/GlobalVariables';

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
    nyuad: NYUAD
};

const Tiles = {
    default: {
        light: 'jawg-light',
        dark: 'jawg-dark'
    },
    nyuad: {
        light: '/images/nyuad-campus-map/light.svg',
        dark: '/images/nyuad-campus-map/dark.svg'
    }
}

const getTileUrl = ({ tileOption, themePreference, isMiniMap }) => {
    let tileTheme;
    let svgUrl;
    switch (themePreference) {
        case ThemePreferences.dark:
            tileTheme = isMiniMap ? 'light' : 'dark';
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad.dark;
            break
        default:
            tileTheme = isMiniMap ? 'dark' : 'light';
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad.light;
            break
    }

    if (tileOption === TileOptions.nyuad) return svgUrl;
    else return `https://{s}.tile.jawg.io/${Tiles[tileOption][tileTheme]}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
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

export const LocationTitles = {
    short: 'short',
    long: 'long'
}

const aqiMarkerIconClass = 'aqi-marker-icons';
const circleMarkerWithLabelClass = 'circle-marker-with-label';

const emptyValue = "--";

const AQImap = (props) => {
    const { themePreference, temperatureUnitPreference } = useContext(PreferenceContext);
    const {
        tileOption,
        centerCoordinates,
        maxBounds,
        minZoom = 8,
        maxZoom = 12,
        defaultZoom = 10,
        disableInteraction = false,
        displayMinimap = true,
        fullSizeMap = false,
        showAttribution = true,
        locationTitle,
        mapData,
        markerSizeInRem = 1,
        ariaLabel = "A map of air quality sensors"
    } = props;

    const placeholderText = ariaLabel;

    const disableZoomParameters = {
        doubleClickZoom: false,
        attributionControl: false,
        zoomControl: false
    }

    const disableInteractionParameters = {
        dragging: false,
        tap: false
    }

    // const [mapData, setMapData] = useState({});
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const nyuadMapBounds = [[24.521723, 54.43135], [24.52609, 54.43779]];

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
                        url={getTileUrl({ tileOption, themePreference, isMiniMap: true })}
                        accessToken={tileAccessToken}
                    />
                    {
                        mapData ? Object.entries(mapData).map(([key, location]) => (
                            <CircleMarker
                                key={key}
                                center={[location.sensor?.coordinates?.latitude, location.sensor?.coordinates?.longitude]}
                                pathOptions={{
                                    fillColor: (location?.current?.aqi?.category && location?.sensor?.sensor_status === SensorStatus.active) ?
                                        theme.palette.text.aqi[location.current.aqi.category] : theme.palette.text.aqi[SensorStatus.offline],
                                    radius: 3,
                                    weight: 0,
                                    fillOpacity: 1
                                }}
                                keyboard={false}
                            >
                            </CircleMarker>

                        )) : null
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

    const displayAqiValue = (location) => {
        if (
            !location.current ||
            location.current?.aqi == null ||
            location.current?.aqi.val == null
        ) return emptyValue;

        return location.current?.aqi.val;
    };

    const displayAqiCategory = (location) => {
        if (!location.current || !location.current?.aqi) return emptyValue;

        return location.current.aqi.category;
    }

    const displayPM2_5 = (location) => {
        if (!location.current || !location.current?.["pm2.5"]) return emptyValue;

        return (
            <>
                {location.current["pm2.5"]} µg/m<sup>3</sup>
            </>
        )
    }

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
                [`& .${aqiMarkerIconClass} .${circleMarkerWithLabelClass}`]: {
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
                }
            }}>
            <MapContainer
                center={centerCoordinates}
                zoom={defaultZoom}
                maxBounds={maxBounds}
                scrollWheelZoom={false}
                placeholder={<MapPlaceholder placeholderText={placeholderText} />}
                attributionControl={false}
                {...(disableInteraction ? { ...disableInteractionParameters, ...disableZoomParameters } : {})}
                minZoom={minZoom}
                maxZoom={maxZoom}
            >
                {displayMinimap === true && <MinimapControl position="bottomleft" mapData={mapData} />}

                {tileOption === TileOptions.nyuad ? (
                    <ImageOverlay
                        url={getTileUrl({ tileOption, themePreference })}
                        bounds={nyuadMapBounds}
                    />
                ) : (
                    <TileLayer
                        attribution={tileAttribution}
                        url={getTileUrl({ tileOption, themePreference })}
                        bounds={maxBounds}
                        accessToken={tileAccessToken}
                    />
                )}
                <AttributionControl position="bottomright" prefix={false} />
                {
                    mapData ? Object.entries(mapData).map(([key, location]) => {
                        const markerColor = (location?.current?.aqi?.category && location?.sensor?.sensor_status === SensorStatus.active) ?
                            theme.palette.text.aqi[location.current.aqi.category] : theme.palette.text.aqi[SensorStatus.offline];

                        const markerIcon = new L.DivIcon({
                            className: aqiMarkerIconClass,
                            html: `
                            <div
                                aria-hidden="true" 
                                style="display: flex; flex-direction: column; width: fit-content"
                            >
                                <div 
                                    class=${circleMarkerWithLabelClass}
                                    style="background-color: ${markerColor}"
                                >${displayAqiValue(location)}</div>

                                ${locationTitle ?
                                    `<div style="font-weight: 500;text-transform: capitalize;margin: auto;color: ${theme.palette.text.primary};font-size: ${markerSizeInRem}rem;">${locationTitle === LocationTitles.short ?
                                        location.sensor?.location_short : location.sensor?.location_long}</div>` : ""
                                }
                            </div>
                            `
                        });

                        return (
                            <Marker
                                key={key}
                                position={[location.sensor?.coordinates?.latitude, location.sensor?.coordinates?.longitude]}
                                icon={markerIcon}
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

                                        <Typography variant="caption">
                                            <Typography variant='caption' fontWeight="500">Status:</Typography>
                                            &nbsp;
                                            {
                                                `${location.sensor?.sensor_status} (${getFormattedLastSeen(location.sensor?.lastSeenInMinutes)})`
                                            }
                                        </Typography>
                                    </StyledLeafletPopup>
                                }

                            </Marker>)
                    }
                    ) : null
                }

            </MapContainer>
        </Box>
    )
}

export default AQImap;