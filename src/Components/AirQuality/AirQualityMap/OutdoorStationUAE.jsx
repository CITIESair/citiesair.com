import { useContext } from "react";
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { CITIESair } from "../../../Utils/GlobalVariables"
import AQImap from "./AQImap"
import { TileOptions } from './AirQualityMapUtils'

const OutdoorStationUAE = ({ overridenThemePreference }) => {
    const { publicMapData } = useContext(DashboardContext);

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