import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/ApiUrls';
import { CURRENT_DATA_EXPIRATION_TIME_MS } from '../Utils/GlobalVariables';
import { GeneralAPIendpoints } from '../API/Utils';

const useCurrentSensorsData = (schoolID = null) => {
    const { currentSchoolID } = useContext(DashboardContext);

    return useQuery({
        queryKey: [GeneralAPIendpoints.current, schoolID || currentSchoolID],
        queryFn: async () => {
            const url = getApiUrl({
                endpoint: GeneralAPIendpoints.current,
                school_id: schoolID || currentSchoolID
            });

            return fetchAndProcessCurrentSensorsData({ url });
        },
        enabled: !!currentSchoolID, // only run when ready
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        placeholderData: (prev) => prev // Keep data from previous queryKey to avoid flashing charts
    });
}

export default useCurrentSensorsData;