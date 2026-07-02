import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { CURRENT_DATA_EXPIRATION_TIME_MS } from '../Utils/GlobalVariables';
import useSchoolMetadata from './useSchoolMetadata';
import { useDashboard } from '../ContextProviders/DashboardContext';
import { addSensorStatus } from '../shared/utils/addSensorStatus';
import type { CurrentSensorsResponse } from '../types/api-contract.types';

export const TEN_YEARS_IN_MINUTES = 10 * 365 * 24 * 60;

export type GetCurrentSchoolResponse = CurrentSensorsResponse;

// Augment with frontend calculated data
export type CurrentSensorsData = ReturnType<
    typeof addSensorStatus<GetCurrentSchoolResponse[number]>
>;
export type CurrentSensorData = CurrentSensorsData[number];

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
            const data = await fetchDataFromURL({ url }) as GetCurrentSchoolResponse;
            return addSensorStatus(data);
        },
        enabled: enabled && !!currentSchoolID && isMetadataReady, // only run when ready
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchOnWindowFocus: true
    });
}

export default useCurrentSensorsData;
