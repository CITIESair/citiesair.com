import { CITIESair } from "../../../Utils/GlobalVariables"
import AQImap from "./AQImap"
import { TileOptions } from './AirQualityMapUtils'

import { useQuery } from '@tanstack/react-query';
import { fetchAndProcessCurrentSensorsData } from '../../../API/ApiFetch';
import { getApiUrl } from '../../../API/ApiUrls';
import { GeneralAPIendpoints } from '../../../API/Utils';

const OutdoorStationUAE = ({ overridenThemePreference }) => {
    const { data: publicMapData } = useQuery({
        queryKey: ['publicMapData'],
        queryFn: async () => {
            const url = getApiUrl({ endpoint: GeneralAPIendpoints.map });
            return fetchAndProcessCurrentSensorsData({ url });
        },
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5, // actively refresh every 5 min
        refetchOnWindowFocus: true, // optional: also refresh when user returns to tab
        placeholderData: (prev) => prev
    });

    return (
        <AQImap
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