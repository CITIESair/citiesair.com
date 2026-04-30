import type { components } from "../../../types/backend-api.types";

type SensorInfo = components["schemas"]["SensorInfo"];

interface ReturnLocationNameParams {
    useLocationShort: boolean;
    location_short: SensorInfo["location_short"];
    location_long: SensorInfo["location_long"];
}

export const returnLocationName = ({
    useLocationShort,
    location_short,
    location_long
}: ReturnLocationNameParams): string => {
    return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
};
