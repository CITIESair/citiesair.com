import { displayAqiValue, LocationTitles, LocationTitleKey } from './AirQualityMapUtils';
import L from 'leaflet';
import { Theme } from '@mui/material';
import type { ProcessedSensorDataWithStatus } from '../../../hooks/useCurrentSensorsData';

interface GetAQIDivIconParams {
    theme: Theme;
    numChildCluster?: number;
    markerSizeInRem: number;
    markerColor: string;
    locationTitle?: LocationTitleKey;
    location: ProcessedSensorDataWithStatus;
}

const getAQIDivIcon = ({
    theme,
    numChildCluster,
    markerSizeInRem,
    markerColor,
    locationTitle,
    location,
}: GetAQIDivIconParams): L.DivIcon => {
    const title = locationTitle === LocationTitles.short ?
        location.sensor?.location_short : location.sensor?.location_long;

    return new L.DivIcon({
        className: "aqi-marker-icons",
        html: `
            <div aria-hidden="true" style="display: flex; flex-direction: column; width: fit-content;">
                ${numChildCluster
                ? `<div class="circle-marker-cluster" style="background-color: ${markerColor}"></div>`
                : ""}

                <div class="circle-marker-with-label" style="background-color: ${markerColor}">
                ${displayAqiValue(location)}
                </div>

                ${numChildCluster
                ? `<div class="point-marker-cluster">${numChildCluster}</div>`
                : ""}

                ${locationTitle
                ? `<div style="font-weight: 500; text-transform: capitalize; margin: auto; color: ${theme.palette.text.primary}; font-size: ${markerSizeInRem}rem; line-height: 1.1; padding-top: 4px">
                        ${title}
                    </div>`
                : ""
            }
            </div>
            `,
    });
};


export default getAQIDivIcon;
