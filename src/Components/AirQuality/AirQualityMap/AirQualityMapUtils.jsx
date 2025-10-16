import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { NYUAD } from "../../../Utils/GlobalVariables";
import { isValidArray, roundNumberTo } from "../../../Utils/UtilFunctions";
import ThemePreferences from "../../../Themes/ThemePreferences";

export const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
};

export const tileAttribution = '<a href="https://leafletjs.com/" target="_blank"><b>Leaflet</b></a> | <a href="https://jawg.io" target="_blank">&copy; <b>Jawg</b>Maps</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors';
export const tileAccessToken = 'N4ppJQTC3M3uFOAsXTbVu6456x1MQnQTYityzGPvAkVB3pS27NMwJ4b3AfebMfjY';

export const TileOptions = {
    default: 'default',
    nyuad: NYUAD
};

export const Tiles = {
    default: {
        [ThemePreferences.light]: 'b6b5a641-4123-4535-b8e7-3b6711fd430b',
        [ThemePreferences.dark]: '407650b3-59a3-49fe-8c1c-bedcd4a8e6b5'
    },
    nyuad: {
        [ThemePreferences.light]: '/images/nyuad-campus-map/light.svg',
        [ThemePreferences.dark]: '/images/nyuad-campus-map/dark.svg'
    }
};

export const getTileUrl = ({ tileOption, themePreference, isMiniMap }) => {
    let tileTheme;
    let svgUrl;
    switch (themePreference) {
        case ThemePreferences.dark:
            tileTheme = isMiniMap ? ThemePreferences.light : ThemePreferences.dark;
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad[ThemePreferences.dark];
            break
        default:
            tileTheme = isMiniMap ? ThemePreferences.dark : ThemePreferences.light;
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad[ThemePreferences.light];
            break
    }
    if (tileOption === TileOptions.nyuad) return svgUrl;
    else return `https://{s}.tile.jawg.io/${Tiles[tileOption][tileTheme]}/{z}/{x}/{y}{r}.png?access-token={accessToken}`;
}

export const getMiniMapColors = ({ themePreference }) => {
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

export const LocationTitles = {
    short: 'short',
    long: 'long'
};

export const MapPlaceholder = ({ placeholderText }) => {
    return (
        <p>
            {placeholderText}
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    );
};

export const disableZoomParameters = {
    doubleClickZoom: false,
    attributionControl: false,
    zoomControl: false
}

export const disableInteractionParameters = {
    dragging: false,
    tap: false
};

export const FitMapToDatapoints = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
        if (isValidArray(bounds)) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);

    return null;
};

/**
 * Calculates the geographic center, fitBounds, and maxBounds of a coordinate set.
 * Padding automatically adapts to how spread out the coordinates are.
 *
 * @param {Array<{latitude: number, longitude: number}>} coords
 * @returns {{
 *   center: [number, number] | null,
 *   fitBounds: [[number, number], [number, number]] | [null, null],
 *   maxBounds: [[number, number], [number, number]] | [null, null]
 * }}
 */
export const calculateCenterAndBounds = (coords) => {
    // Validate coords array
    if (!isValidArray(coords)) {
        return { center: null, bounds: [null, null] };
    }

    // Extract valid lat/lng
    const latitudes = [];
    const longitudes = [];

    for (const c of coords) {
        const { latitude, longitude } = c
        latitudes.push(latitude);
        longitudes.push(longitude);
    }

    // Calculate extremes
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Calculate coordinate ranges
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    const latPadding = latRange * getAdaptivePaddingFactor(latRange);
    const lngPadding = lngRange * getAdaptivePaddingFactor(lngRange);

    return {
        center: [roundNumberTo((minLat + maxLat) / 2), roundNumberTo((minLng + maxLng) / 2)],
        maxBounds: [
            [roundNumberTo(minLat - latPadding), roundNumberTo(minLng - lngPadding)], // southwest
            [roundNumberTo(maxLat + latPadding), roundNumberTo(maxLng + lngPadding)], // northeast
        ],
        fitBounds: [
            [roundNumberTo(minLat), roundNumberTo(minLng)], // southwest
            [roundNumberTo(maxLat), roundNumberTo(maxLng)], // northeast
        ]
    };
};

// Adaptive padding based on spatial range
const getAdaptivePaddingFactor = (range) => {
    if (range < 0.5) return 1.5; // very tight cluster
    if (range < 5) return 0.5;  // regional
    return 0.1; // continental/global
};