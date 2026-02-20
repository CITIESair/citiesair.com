import { useQuery } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { useDashboard } from '../ContextProviders/DashboardContext';

const useSchoolMetadata = ({ enabled = true } = {}) => {
    const { currentSchoolID } = useDashboard();
    const url = getApiUrl({
        endpoint: "school_metadata",
        paths: [currentSchoolID]
    });

    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetchDataFromURL({ url });
        },
        enabled: enabled && !!currentSchoolID, // only run when ready
        staleTime: 1000 * 60 * 60, // 1-hour cache,
        placeholderData: (prev) => prev // Keep data from previous to avoid flashing charts
    });
}

export default useSchoolMetadata;