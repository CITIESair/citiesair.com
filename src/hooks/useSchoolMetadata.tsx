import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { getApiUrl } from '../API/APIUtils';
import { useDashboard } from '../ContextProviders/DashboardContext';
import type { paths, components } from '../types/backend-api.types';

type GetSchoolMetadataResponse =
    paths["/school_metadata/{school}"]["get"]["responses"][200]["content"]["application/json"];

export type SchoolMetadata = components["schemas"]["SchoolMetadataResponse"];

interface UseSchoolMetadataParams {
    enabled?: boolean;
}

const useSchoolMetadata = ({ enabled = true }: UseSchoolMetadataParams = {}): UseQueryResult<SchoolMetadata, Error> => {
    const { currentSchoolID } = useDashboard();
    const url = getApiUrl({
        endpoint: "school_metadata",
        paths: [currentSchoolID]
    });

    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetchDataFromURL({ url }) as Promise<GetSchoolMetadataResponse>;
        },
        enabled: enabled && !!currentSchoolID, // only run when ready
        staleTime: 1000 * 60 * 60, // 1-hour cache,
        placeholderData: (prev) => prev // Keep data from previous to avoid flashing charts
    });
}

export default useSchoolMetadata;
