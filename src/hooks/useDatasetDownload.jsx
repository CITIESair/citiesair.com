import { useQuery } from '@tanstack/react-query';
import { fetchDataFromURL } from '../API/ApiFetch';
import { useContext } from 'react';
import { DashboardContext } from '../ContextProviders/DashboardContext';
import { getApiUrl } from '../API/APIUtils';

const useDatasetDownload = ({ sensor, aggregationType, isSample, enabled = true }) => {
    const { currentSchoolID } = useContext(DashboardContext);
    const url = getApiUrl({
        endpoint: "raw",
        paths: [currentSchoolID, sensor],
        queryParams: {
            aggregationType,
            isSample
        }
    });

    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetchDataFromURL({ url, extension: "csv" });
        },
        enabled: !!currentSchoolID && !!sensor && !!enabled,
        staleTime: 1000 * 60 * 5,
        retry: false
    });
};

export default useDatasetDownload;