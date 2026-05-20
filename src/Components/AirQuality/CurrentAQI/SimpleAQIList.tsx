import { Box, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { CurrentAQIGridSize, CurrentAQIGridSizeType, ElementSizes } from "./CurrentAQIGridSize";
import { returnLocationName } from "./AQIGridUtils";
import { SensorStatus } from "../SensorStatus";
import { useNetworkStatus } from "../../../ContextProviders/NetworkStatusContext";
import { CurrentSensorsData } from "../../../hooks/useCurrentSensorsData";

interface DisplayAQIParams {
    aqi: number | null | undefined;
    category: string | null | undefined;
    showCategory: boolean;
}

const displayAQI = ({ aqi, category, showCategory }: DisplayAQIParams): string => {
    if (!aqi) return "--";
    else {
        return `${aqi}${showCategory ? `(${category || '--'})` : ''} `;
    }
}

interface SimpleAQIListProps {
    currentSensorsData: CurrentSensorsData | undefined;
    useLocationShort: boolean;
    size: CurrentAQIGridSizeType;
    showCategory: boolean;
}

const SimpleAQIList = (props: SimpleAQIListProps) => {
    const {
        currentSensorsData,
        useLocationShort = false,
        size = CurrentAQIGridSize.medium,
        showCategory = true
    } = props;

    const theme = useTheme();

    const { isServerDown } = useNetworkStatus();
    if (isServerDown) return null;

    return (
        <Grid
            container
            justifyContent="left"
            sx={{
                '& .condensedFont': {
                    fontFamily: 'IBM Plex Sans Condensed, sans-serif !important',
                    '& *': {
                        fontFamily: 'IBM Plex Sans Condensed, sans-serif !important'
                    }
                }
            }}
        >
            {
                currentSensorsData ?
                    (currentSensorsData.map((sensorData, index) => (
                        <Grid
                            item
                            key={index}
                            xs={6}
                            display="block"
                        >
                            <Typography
                                color="text.secondary"
                                display="block"
                                variant={ElementSizes[size].metero}
                                fontWeight="500"
                                className='condensedFont'
                                textTransform="capitalize"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                textAlign="center"
                                noWrap
                            >
                                {returnLocationName({
                                    useLocationShort,
                                    location_short: sensorData.sensor.location_short,
                                    location_long: sensorData.sensor.location_long
                                })}
                                :
                                &nbsp;
                                <Box
                                    component="span"
                                    color={
                                        (sensorData.current?.aqi?.categoryIndex !== null && sensorData.sensor?.sensor_status === SensorStatus.active) ?
                                            theme.palette.text.aqi[sensorData.current?.aqi?.categoryIndex] :
                                            'text.secondary'
                                    }
                                >
                                    {displayAQI({
                                        aqi: sensorData.current?.aqi?.val,
                                        category: sensorData.current?.aqi?.category,
                                        showCategory
                                    })}
                                </Box>
                            </Typography>
                        </Grid>
                    ))
                    )
                    :
                    (
                        <Stack direction="column" alignItems="center" justifyContent="center">
                            {[...Array(3)].map((_, index) => (
                                <Skeleton key={index} variant='text' sx={{ width: '80%', fontSize: '1rem' }} />
                            ))}
                        </Stack>
                    )
            }
        </Grid>
    );
}

export default SimpleAQIList;
