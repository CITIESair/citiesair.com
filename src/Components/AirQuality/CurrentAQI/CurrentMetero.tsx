import { Typography } from "@mui/material"
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { CurrentAQIGridSizeType, ElementSizes } from "./CurrentAQIGridSize";
import { convertTemperature, TemperatureUnits } from "../../../business-domain/air-quality/temperature.utils";
import { usePreferences } from "../../../ContextProviders/PreferenceContext";
import type { components } from "../../../types/backend-api.types";

type CurrentMeasurement = components["schemas"]["CurrentMeasurement"];
type SensorInfo = components["schemas"]["SensorInfo"];

interface TemperatureStringProps {
    temperature: number | null | undefined;
    roundTemperature?: boolean;
}

const TemperatureString = ({ temperature, roundTemperature }: TemperatureStringProps) => {
    const { temperatureUnitPreference } = usePreferences();
    const formattedTemperature = roundTemperature && temperature ? Math.round(temperature) : temperature;

    const temperatureUnitLabel = temperatureUnitPreference?.charAt(0).toUpperCase();

    return (
        <>
            {formattedTemperature ? convertTemperature(
                temperature!,
                TemperatureUnits.CELSIUS,
                temperatureUnitPreference
            ) : "--"}
            °{temperatureUnitLabel}
        </>
    );
}

interface CurrentWeatherProps {
    size: CurrentAQIGridSizeType;
    current: CurrentMeasurement | null | undefined;
    roundTemperature?: boolean;
    showWeatherText?: boolean;
    showWeatherIcon?: boolean;
}

export const CurrentWeather = ({
    size,
    current,
    roundTemperature,
    showWeatherText = true,
    showWeatherIcon = true
}: CurrentWeatherProps) => {
    return (
        <Typography variant={ElementSizes[size].metero}>
            {showWeatherText ?
                <Typography variant='caption' fontWeight="500">Weather: </Typography>
                : null}

            {showWeatherIcon ? <ThermostatIcon /> : null}
            <TemperatureString temperature={current?.temperature} roundTemperature={roundTemperature} />

            &nbsp;&nbsp;-&nbsp;

            {showWeatherIcon ? <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} /> : null}
            {current?.rel_humidity ? Math.round(current?.rel_humidity) : "--"}%

        </Typography>
    )
}

interface CurrentHeatIndexProps {
    sensor: SensorInfo | null | undefined;
    current: CurrentMeasurement | null | undefined;
    size: CurrentAQIGridSizeType;
    roundTemperature?: boolean;
}

export const CurrentHeatIndex = ({ sensor, current, size, roundTemperature }: CurrentHeatIndexProps) => {
    const { temperatureUnitPreference } = usePreferences();

    if (!sensor || !current) return null;
    if (!['outdoors', 'indoors_gym'].includes(sensor.location_type)) return null;

    const heatIndexObject = current?.heat_index_C;

    return (
        <Typography variant={ElementSizes[size].heatIndex} sx={{ fontWeight: '300 !important' }}>
            Heat Index:&nbsp;
            {heatIndexObject && heatIndexObject.val !== undefined && heatIndexObject.val !== null
                ? <>
                    <TemperatureString temperature={heatIndexObject.val} roundTemperature={roundTemperature} />
                    &nbsp;
                    ({heatIndexObject.category || '--'})
                </>
                : '--'
            }
        </Typography>
    );
}
