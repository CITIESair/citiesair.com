import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { CURRENT_DATA_EXPIRATION_TIME_MS } from '../Utils/GlobalVariables';
import useSchoolMetadata from './useSchoolMetadata';
import { useDashboard } from '../ContextProviders/DashboardContext';
import type { paths, components } from '../types/backend-api.types';
import type { SensorStatusType } from '../Components/AirQuality/SensorStatus';

// Import the API response type from paths (preserves semantic meaning)
type GetCurrentSchoolResponse =
    paths["/current/{school}"]["get"]["responses"][200]["content"]["application/json"];

// The backend returns ProcessedSensorData[], but the frontend processing adds additional fields
type ProcessedSensorData = components["schemas"]["ProcessedSensorData"];

// Extended type with frontend-added fields from fetchAndProcessCurrentSensorsData
export type ProcessedSensorDataWithStatus = {
    sensor: ProcessedSensorData["sensor"] & {
        lastSeenInMinutes: number | null;
        sensor_status: SensorStatusType;
    };
    current: ProcessedSensorData["current"];
};

// The hook returns an array of processed sensor data
export type CurrentSensorsData = ProcessedSensorDataWithStatus[];

interface UseCurrentSensorsDataParams {
    schoolID?: string | null;
    enabled?: boolean;
}

const useCurrentSensorsData = ({
    schoolID = null,
    enabled = true
}: UseCurrentSensorsDataParams = {}): UseQueryResult<CurrentSensorsData, Error> => {
    const { currentSchoolID } = useDashboard();
    const { isSuccess: isMetadataReady } = useSchoolMetadata();

    const url = getApiUrl({
        endpoint: "current",
        paths: [schoolID || currentSchoolID]
    });

    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return await fetchAndProcessCurrentSensorsData({ url });
        },
        enabled: enabled && !!currentSchoolID && isMetadataReady, // only run when ready
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchOnWindowFocus: true
    });
}

export default useCurrentSensorsData;
