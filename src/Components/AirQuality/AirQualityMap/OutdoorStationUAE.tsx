import { CITIESair, CURRENT_DATA_EXPIRATION_TIME_MS } from "../../../Utils/GlobalVariables"
import AQImap from "./AQImap"
import { TileOptions } from './AirQualityMapUtils'

import { useQuery } from '@tanstack/react-query';
import { fetchDataFromURL } from '../../../API/ApiFetch';
import { getApiUrl } from '../../../API/APIUtils';
import { GetCurrentSchoolResponse } from "../../../hooks/useCurrentSensorsData";
import { addSensorStatus } from "../../../shared/utils/addSensorStatus";

interface OutdoorStationUAEProps {
    overridenThemePreference?: string;
    fullSizeMap?: boolean;
}

const OutdoorStationUAE = ({ overridenThemePreference, fullSizeMap = false }: OutdoorStationUAEProps) => {
    const url = getApiUrl({ endpoint: "map_public_outdoors_stations" });
    const { data: publicMapData } = useQuery({
        queryKey: [url],
        queryFn: async () => {
            const data = await fetchDataFromURL({ url });
            return addSensorStatus(data as GetCurrentSchoolResponse); // Temporary parse the API response as current
        },
        staleTime: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchInterval: CURRENT_DATA_EXPIRATION_TIME_MS,
        refetchOnWindowFocus: true,
        placeholderData: (prev) => prev
    });

    return (
        <AQImap
            fullSizeMap={fullSizeMap}
            overridenThemePreference={overridenThemePreference}
            tileOption={TileOptions.default}
            centerCoordinates={[24.44, 54.45]}
            defaultZoom={11}
            mapData={publicMapData}
            ariaLabel={`Map of ${CITIESair} public outdoor air quality stations in UAE`}
        />
    )
}

export default OutdoorStationUAE;
