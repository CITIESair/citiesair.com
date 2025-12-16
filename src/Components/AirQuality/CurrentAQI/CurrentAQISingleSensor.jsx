import { useTheme } from '@mui/material';
import { useContext } from "react";
import { PreferenceContext } from "../../../ContextProviders/PreferenceContext";
import { AQI_Database } from "../../../Utils/AirQuality/AirQualityIndexHelper";
import { getTranslation } from "../../../Utils/UtilFunctions";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { returnSensorStatusString, SensorStatus } from "../SensorStatus";
import { INACTIVE_SENSOR_COLORS } from "../../../Themes/CustomColors";
import { returnLocationName } from "./AQIGridUtils";
import { ElementSizes } from "./CurrentAQIGridSize";
import { CurrentHeatIndex, CurrentWeather } from "./CurrentMetero";
import LastUpdateAndSensorStatus from "./LastUpdateAndSensorStatus";
import { DataTypeKeys } from "../../../Utils/AirQuality/DataTypes";
import useSchoolMetadata from '../../../hooks/useSchoolMetadata';

const CurrentAQISingleSensor = (props) => {
    const {
        sensor, current, size, showLastUpdate, showWeatherText, gridSizes, isScreen, showAQI, useLocationShort, showRawMeasurements, showWeather, roundTemperature, showHeatIndex
    } = props;
    const { data: schoolMetadata } = useSchoolMetadata();

    const theme = useTheme();
    const { language } = useContext(PreferenceContext);

    const categoryObject = AQI_Database[current?.aqi?.categoryIndex];
    const categoryText = categoryObject ? getTranslation(AQI_Database[current?.aqi?.categoryIndex]?.category, language) : null;

    return (
        <Grid
            item
            {...gridSizes}
        >
            {
                showAQI ? (
                    <Box>
                        <Box sx={{
                            '& .MuiTypography-root': {
                                color: (current?.aqi?.categoryIndex !== null && sensor?.sensor_status === SensorStatus.active) ?
                                    theme.palette.text.aqi[current?.aqi?.categoryIndex]
                                    : (isScreen ? INACTIVE_SENSOR_COLORS.screen : theme.palette.text.aqi[SensorStatus.offline])
                            }
                        }}>
                            <Typography variant={ElementSizes[size].locationAndCategory} fontWeight="500" className='condensedFont' textTransform="capitalize">
                                {returnLocationName({
                                    useLocationShort,
                                    location_short: sensor?.location_short,
                                    location_long: sensor?.location_long
                                })}
                            </Typography>
                            <Typography variant={ElementSizes[size].aqi} fontWeight="500" lineHeight={ElementSizes[size].aqiLineHeight}>
                                {current?.aqi?.val !== null && current?.aqi?.val !== undefined ? current.aqi.val : '--'}
                            </Typography>
                            <Typography
                                variant={ElementSizes[size].locationAndCategory}
                                fontWeight="500"
                                className='condensedFont'
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {categoryText || "--"}
                            </Typography>
                        </Box>

                        {showRawMeasurements ?
                            <Typography
                                variant={ElementSizes[size].rawValues}
                                display="block"
                                fontWeight="500"
                                className='condensedFont'
                                color={isScreen ? INACTIVE_SENSOR_COLORS.screen : 'text.secondary'}
                            >
                                {`PM2.5: ${current?.["pm2.5"] || "--"} μg/m3`}
                            </Typography> : null
                        }
                    </Box>
                ) : null
            }
            <Stack
                sx={{
                    '& *': {
                        color:
                            isScreen ? (
                                sensor?.sensor_status === SensorStatus.active ?
                                    '#c8dcff' : INACTIVE_SENSOR_COLORS.screen
                            )
                                : 'text.secondary'
                    }, mt: ElementSizes[size].meteroDataMarginTop
                }}
                className='condensedFont'
                position="relative"
            >
                {
                    schoolMetadata?.sensors.find(
                        sensor => sensor.sensor_id === sensor.sensor_id
                    )?.allowedDataTypes?.includes(DataTypeKeys.temperature_C) && <>
                        {
                            showWeather &&
                            <CurrentWeather
                                size={size}
                                current={current}
                                showWeatherText={showWeatherText}
                                roundTemperature={roundTemperature}
                            />
                        }
                        {
                            showHeatIndex && <CurrentHeatIndex
                                sensor={sensor}
                                size={size}
                                current={current}
                            />
                        }
                    </>
                }

                {/* If the sensor is offline then show last update and status message regardless of given preference  */}
                {
                    (showLastUpdate || (!showLastUpdate && sensor?.sensor_status !== SensorStatus.active)) && <LastUpdateAndSensorStatus
                        sensor={sensor}
                        size={size}
                    />
                }
            </Stack>

            {
                sensor?.sensor_status !== SensorStatus.active &&
                <Typography variant={ElementSizes[size].sensorStatus} className="condensedFont">
                    {returnSensorStatusString(current, language)}
                </Typography>
            }
        </Grid>
    )
}

export default CurrentAQISingleSensor;