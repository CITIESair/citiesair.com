import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/APIUtils';
import { CURRENT_DATA_EXPIRATION_TIME_MS } from '../Utils/GlobalVariables';
import useSchoolMetadata from './useSchoolMetadata';

const useCurrentSensorsData = ({ schoolID = null, enabled = true } = {}) => {
    const { currentSchoolID } = useContext(DashboardContext);
    const { isSuccess: isMetadataReady } = useSchoolMetadata();

    const url = getApiUrl({
        endpoint: "current",
        paths: [schoolID || currentSchoolID]
    });
    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetchAndProcessCurrentSensorsData({ url });
        },
        enabled: enabled && !!currentSchoolID && isMetadataReady, // only run when ready
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchOnWindowFocus: true
    });
}

export default useCurrentSensorsData;