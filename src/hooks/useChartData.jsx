import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { fetchDataFromURL } from '../API/ApiFetch';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getChartApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints } from '../API/Utils';

const useChartData = (chartID) => {
    const { allChartsConfigs, currentSchoolID } = useContext(DashboardContext);
    const chartConfig = allChartsConfigs[chartID];

    return useQuery({
        queryKey: [GeneralAPIendpoints.chartdata, chartID, chartConfig, currentSchoolID],
        queryFn: async () => {
            const url = getChartApiUrl({
                endpoint: chartConfig.endpoint,
                school_id: currentSchoolID,
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
