import { CITIESair, CURRENT_DATA_EXPIRATION_TIME_MS } from "../../../Utils/GlobalVariables"
import AQImap from "./AQImap"
import { TileOptions } from './AirQualityMapUtils'

import { useQuery } from '@tanstack/react-query';
import { fetchAndProcessCurrentSensorsData } from '../../../API/ApiFetch';
import { getApiUrl } from '../../../API/APIUtils';

const OutdoorStationUAE = ({ overridenThemePreference, fullSizeMap = false }) => {
    const url = getApiUrl({ endpoint: "map_public_outdoors_stations" });
    const { data: publicMapData } = useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetchAndProcessCurrentSensorsData({ url });
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