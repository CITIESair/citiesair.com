import type { CurrentSensorInfo } from "../../../types/api-contract.types";

interface ReturnLocationNameParams {
    useLocationShort: boolean;
    location_short: CurrentSensorInfo["location_short"];
    location_long: CurrentSensorInfo["location_long"];
}

export const returnLocationName = ({
    useLocationShort,
    location_short,
    location_long
}: ReturnLocationNameParams): string => {
    return useLocationShort ? (location_short || 'N/A') : (location_long || 'No Location Name');
};
