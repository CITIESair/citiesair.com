import { useQuery } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { useContext } from 'react';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/ApiUrls';
import { GeneralAPIendpoints, SupportedFetchExtensions } from '../API/Utils';

const useDatasetDownload = ({ sensor, aggregationType, isSample, enabled = true }) => {
    const { currentSchoolID } = useContext(DashboardContext);

    return useQuery({
        queryKey: [GeneralAPIendpoints.raw, currentSchoolID, sensor, aggregationType, isSample],
        queryFn: async () => {
            const url = getApiUrl({
                paths: [GeneralAPIendpoints.raw, currentSchoolID, sensor],
                queryParams: {
                    aggregationType,
                    isSample
                }
            });
            return fetchDataFromURL({ url, extension: SupportedFetchExtensions.csv });
        },
        enabled: !!currentSchoolID && !!sensor && !!enabled,
        staleTime: 1000 * 60 * 5,
        retry: false
    });
};

export default useDatasetDownload;