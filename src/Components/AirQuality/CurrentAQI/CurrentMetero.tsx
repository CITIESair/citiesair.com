import { Typography } from "@mui/material"
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { CurrentAQIGridSizeType, ElementSizes } from "./CurrentAQIGridSize";
import { convertTemperature, TemperatureUnits } from "../../../business-domain/air-quality/temperature.utils";
import { usePreferences } from "../../../ContextProviders/PreferenceContext";
import type { HeatIndexResult } from "../../../types/api-contract.types";

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
    temperature: number | null | undefined;
    rel_humidity: number | null | undefined;
    roundTemperature?: boolean;
    showWeatherText?: boolean;
    showWeatherIcon?: boolean;
}

export const CurrentWeather = ({
    size,
    temperature,
    rel_humidity,
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
            <TemperatureString temperature={temperature} roundTemperature={roundTemperature} />

            &nbsp;&nbsp;-&nbsp;

            {showWeatherIcon ? <WaterDropIcon sx={{ transform: 'scaleX(0.9)' }} /> : null}
            {rel_humidity ? Math.round(rel_humidity) : "--"}%

        </Typography>
    )
}

interface CurrentHeatIndexProps {
    locationType: string;
    heatIndex: HeatIndexResult | null | undefined;
    size: CurrentAQIGridSizeType;
    roundTemperature?: boolean;
}

export const CurrentHeatIndex = ({ locationType, heatIndex, size, roundTemperature }: CurrentHeatIndexProps) => {
    if (!heatIndex) return null;
    if (!['outdoors', 'indoors_gym'].includes(locationType)) return null;

    return (
        <Typography variant={ElementSizes[size].heatIndex} sx={{ fontWeight: '300 !important' }}>
            Heat Index:&nbsp;
            {heatIndex && heatIndex.val !== undefined && heatIndex.val !== null
                ? <>
                    <TemperatureString temperature={heatIndex.val} roundTemperature={roundTemperature} />
                    &nbsp;
                    ({heatIndex.category || '--'})
                </>
                : '--'
            }
        </Typography>
    );
}
