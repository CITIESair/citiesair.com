import { Box, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { CurrentAQIGridSize, ElementSizes } from "./CurrentAQIGridSize";
import { returnLocationName } from "./AQIGridUtils";

const displayAQI = ({ aqi, category, showCategory }) => {
    if (!aqi) return "--";
    else {
        return `${aqi}${showCategory ? `(${category || '--'})` : ''} `;
    }
}

const SimpleAQIList = (props) => {
    const {
        currentSensorsData,
        useLocationShort = false,
        size = CurrentAQIGridSize.medium,
        showCategory = true
    } = props;

    const theme = useTheme();

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
                    (Object.entries(currentSensorsData).map(([_, sensorData], index) => (
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
                                    location_short: sensorData.sensor?.location_short,
                                    location_long: sensorData.sensor?.location_long
                                })}
                                :
                                &nbsp;
                                <Box
                                    component="span"
                                    color={
                                        (sensorData?.current?.aqi?.categoryIndex !== null && sensorData.sensor?.sensor_status) ?
                                            theme.palette.text.aqi[sensorData?.current?.aqi?.categoryIndex] :
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