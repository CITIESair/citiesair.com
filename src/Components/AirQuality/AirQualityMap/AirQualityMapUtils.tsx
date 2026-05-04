import { useEffect, ReactNode } from "react";
import { useMap } from "react-leaflet";
import { NYUAD } from "../../../Utils/GlobalVariables";
import { isValidArray, roundNumberTo } from "../../../Utils/UtilFunctions";
import ThemePreferences from "../../../Themes/ThemePreferences";
import type { ProcessedSensorDataWithStatus } from "../../../hooks/useCurrentSensorsData";
import type { components } from "../../../types/backend-api.types";
import { MapOptions } from 'leaflet';

type SensorCoordinates = components["schemas"]["SensorCoordinates"];

export const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
} as const;

export type PositionClassKey = keyof typeof POSITION_CLASSES;

export const tileAttribution = '<a href="https://leafletjs.com/" target="_blank"><b>Leaflet</b></a> | <a href="https://jawg.io" target="_blank">&copy; <b>Jawg</b>Maps</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors';
const tileAccessToken = 'N4ppJQTC3M3uFOAsXTbVu6456x1MQnQTYityzGPvAkVB3pS27NMwJ4b3AfebMfjY';

export const TileOptions = {
    default: 'default',
    nyuad: NYUAD
} as const;

export type TileOptionKey = typeof TileOptions[keyof typeof TileOptions];

export const Tiles: Record<TileOptionKey, Record<string, string>> = {
    default: {
        [ThemePreferences.light]: 'b6b5a641-4123-4535-b8e7-3b6711fd430b',
        [ThemePreferences.dark]: '407650b3-59a3-49fe-8c1c-bedcd4a8e6b5'
    },
    nyuad: {
        [ThemePreferences.light]: '/images/nyuad-campus-map/light.svg',
        [ThemePreferences.dark]: '/images/nyuad-campus-map/dark.svg'
    }
};

interface GetTileUrlParams {
    tileOption: TileOptionKey;
    themePreference: string;
    isMiniMap?: boolean;
}

export const getTileUrl = ({ tileOption, themePreference, isMiniMap }: GetTileUrlParams): string => {
    let tileTheme: string;
    let svgUrl: string | undefined;

    switch (themePreference) {
        case ThemePreferences.dark:
            tileTheme = isMiniMap ? ThemePreferences.light : ThemePreferences.dark;
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad[ThemePreferences.dark];
            break;
        default:
            tileTheme = isMiniMap ? ThemePreferences.dark : ThemePreferences.light;
            if (tileOption === TileOptions.nyuad) svgUrl = Tiles.nyuad[ThemePreferences.light];
            break;
    }

    if (tileOption === TileOptions.nyuad && svgUrl) return svgUrl;
    else return `https://{s}.tile.jawg.io/${Tiles[tileOption][tileTheme]}/{z}/{x}/{y}{r}.png?access-token=${tileAccessToken}`;
}

interface GetMiniMapColorsParams {
    themePreference: string;
}

export const getMiniMapColors = ({ themePreference }: GetMiniMapColorsParams): { fillColor: string; color: string } => {
    switch (themePreference) {
        case ThemePreferences.dark:
            return {
                fillColor: "#000",
                color: "#000"
            };
        default:
            return {
                fillColor: "#fff",
                color: "#fff"
            };
    }
}

export const LocationTitles = {
    short: 'short',
    long: 'long'
} as const;

export type LocationTitleKey = typeof LocationTitles[keyof typeof LocationTitles];

interface MapPlaceholderProps {
    placeholderText: string;
}

export const MapPlaceholder = ({ placeholderText }: MapPlaceholderProps) => {
    return (
        <p>
            {placeholderText}
            <noscript>You need to enable JavaScript to see this map.</noscript>
        </p>
    );
};


export const disableInteractionParameters: Partial<MapOptions> = {
    dragging: false,
    tap: false
};

export const disableZoomParameters: Partial<MapOptions> = {
    doubleClickZoom: false,
    zoomControl: false
};

interface FitMapToDatapointsProps {
    bounds: [[number, number], [number, number]] | [null, null];
}

export const FitMapToDatapoints = ({ bounds }: FitMapToDatapointsProps) => {
    const map = useMap();

    useEffect(() => {
        if (isValidArray(bounds)) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);

    return null;
};

interface CenterAndBounds {
    center: [number, number] | null;
    fitBounds: [[number, number], [number, number]] | [null, null];
    maxBounds: [[number, number], [number, number]] | [null, null];
}

/**
 * Calculates the geographic center, fitBounds, and maxBounds of a coordinate set.
 * Padding automatically adapts to how spread out the coordinates are.
 */
export const calculateCenterAndBounds = (coords: SensorCoordinates[]): CenterAndBounds => {
    // Validate coords array
    if (!isValidArray(coords)) {
        return { center: null, fitBounds: [null, null], maxBounds: [null, null] };
    }

    // Extract valid lat/lng
    const latitudes: number[] = [];
    const longitudes: number[] = [];

    for (const c of coords) {
        const { latitude, longitude } = c;
        if (latitude !== null && longitude !== null) {
            latitudes.push(latitude);
            longitudes.push(longitude);
        }
    }

    if (latitudes.length === 0 || longitudes.length === 0) {
        return { center: null, fitBounds: [null, null], maxBounds: [null, null] };
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
const getAdaptivePaddingFactor = (range: number): number => {
    if (range < 0.5) return 1.5; // very tight cluster
    if (range < 5) return 0.5;  // regional
    return 0.1; // continental/global
};

const emptyValue = "--";

export const displayAqiValue = (location: ProcessedSensorDataWithStatus): string | number => {
    if (
        !location.current ||
        location.current?.aqi == null ||
        location.current?.aqi.val == null
    ) return emptyValue;

    return location.current?.aqi.val;
};

export const displayAqiCategory = (location: ProcessedSensorDataWithStatus): string => {
    if (!location.current || !location.current?.aqi) return emptyValue;

    return location.current.aqi.category || emptyValue;
}

export const displayPM2_5 = (location: ProcessedSensorDataWithStatus): ReactNode => {
    if (!location.current || !location.current?.["pm2.5"]) return emptyValue;

    return (
        <>
            {location.current["pm2.5"]} µg/m<sup>3</sup>
        </>
    );
}
