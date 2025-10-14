import { Typography } from "@mui/material"
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useContext } from "react";
import { PreferenceContext } from "../../../ContextProviders/PreferenceContext";
import { ElementSizes } from "./CurrentAQIGridSize";
import { getFormattedTemperature, TemperatureUnits } from "../../../Utils/AirQuality/TemperatureUtils";

export const CurrentWeather = ({ size, current, roundTemperature, showWeatherText }) => {
    const { temperatureUnitPreference } = useContext(PreferenceContext);

    return (
        <Typography variant={ElementSizes[size].metero}>
            {showWeatherText ? "Weather:" : null}
            <ThermostatIcon />
            {
                getFormattedTemperature({
                    rawTemp: roundTemperature ? Math.round(current?.temperature) : current?.temperature,
                    currentUnit: TemperatureUnits.celsius,
                    returnUnit: temperatureUnitPreference
                })
            }
            &nbsp;&nbsp;-&nbsp;
            <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} />
            {current?.rel_humidity ? Math.round(current?.rel_humidity) : "--"}%
        </Typography>
    )
}

export const CurrentHeatIndex = ({ sensor, current, size }) => {
    const { temperatureUnitPreference } = useContext(PreferenceContext);

    if (!sensor || !current) return null;
    if (!['outdoors', 'indoors_gym'].includes(sensor.location_type)) return null;

    const heatIndexObject = current?.heat_index_C;

    return (
        <Typography variant={ElementSizes[size].heatIndex} sx={{ fontWeight: '300 !important' }}>
            Heat Index:&nbsp;
            {heatIndexObject && heatIndexObject.val !== undefined && heatIndexObject.val !== null
                ? <>
                    {getFormattedTemperature({
                        rawTemp: heatIndexObject.val,
                        currentUnit: TemperatureUnits.celsius,
                        returnUnit: temperatureUnitPreference
                    })}
                    &nbsp;
                    ({heatIndexObject.category || '--'})
                </>
                : '--'
            }
        </Typography>
    );
}