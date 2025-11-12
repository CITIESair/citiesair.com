import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchDataFromURL } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from '../API/Utils';

const useSchoolMetadata = () => {
    const { currentSchoolID } = useContext(DashboardContext);

    return useQuery({
        queryKey: [GeneralAPIendpoints.schoolmetadata, currentSchoolID],
        queryFn: async () => {
            const url = getApiUrl({
                paths: [GeneralAPIendpoints.schoolmetadata, currentSchoolID]
            });

            return fetchDataFromURL({ url });
        },
        enabled: !!currentSchoolID, // only run when ready
        staleTime: 1000 * 60 * 60, // 1-hour cache,
        placeholderData: (prev) => prev // Keep data from previous queryKey to avoid flashing charts
    });
}

export default useSchoolMetadata;