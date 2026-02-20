import { useQuery } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import useSchoolMetadata from './useSchoolMetadata';
import { useDashboard } from '../ContextProviders/DashboardContext';

const useChartData = ({ chartID }) => {
    const { allChartsConfigs, currentSchoolID } = useDashboard();
    const chartConfig = allChartsConfigs[chartID];

    const { isSuccess: isMetadataReady } = useSchoolMetadata();

    return useQuery({
        queryKey: [chartConfig, currentSchoolID],
        queryFn: async () => {
            const url = getApiUrl({
                endpoint: chartConfig.endpoint,
                paths: [currentSchoolID],
                queryParams: chartConfig.queryParams
            });
            return fetchDataFromURL({ url });
        },
        enabled: isMetadataReady && !!currentSchoolID && !!chartConfig?.endpoint, // only run when schoolMetadata has been fetched
        staleTime: 1000 * 60 * 10, // 10-minute cache,
        placeholderData: (prev) => prev // Keep data from previous to avoid flashing charts
    });
}

export default useChartData;
