import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchAndProcessCurrentSensorsData } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/ApiUrls';
import { CURRENT_DATA_EXPIRATION_TIME_MS, KAMPALA } from '../Utils/GlobalVariables';
import AggregationType from '../Components/DateRangePicker/AggregationType';
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

            // aggregationType is necessary here to determine the appropriate SensorStatus based on last_seen (active/offline)
            return fetchAndProcessCurrentSensorsData({
                url,
                aggregationType: currentSchoolID === KAMPALA ? AggregationType.hour : null
            });
        },
        enabled: !!currentSchoolID, // only run when ready
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        placeholderData: (prev) => prev // Keep data from previous queryKey to avoid flashing charts
    });
}

export default useCurrentSensorsData;