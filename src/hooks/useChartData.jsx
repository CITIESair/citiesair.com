import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchDataFromURL } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/ApiUrls';

const useChartData = (chartID) => {
    const { allChartsConfigs, currentSchoolID } = useContext(DashboardContext);
    const chartConfig = allChartsConfigs[chartID];

    return useQuery({
        queryKey: [chartConfig, currentSchoolID],
        queryFn: async () => {
            const url = getApiUrl({
                paths: [chartConfig.endpoint, currentSchoolID],
                queryParams: chartConfig.queryParams
            });
            return fetchDataFromURL({ url });
        },
        enabled: !!currentSchoolID && !!chartConfig?.endpoint, // only run when ready
        staleTime: 1000 * 60 * 10, // 10-minute cache,
        placeholderData: (prev) => prev // Keep data from previous queryKey to avoid flashing charts
    });
}

export default useChartData;
