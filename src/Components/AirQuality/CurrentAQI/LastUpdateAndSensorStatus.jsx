import { useTheme } from '@mui/material';
import { useContext } from "react";
import { getTranslation } from "../../../Utils/UtilFunctions";
import { Typography } from "@mui/material";
import { ElementSizes } from "./CurrentAQIGridSize";
import ErrorIcon from '@mui/icons-material/Error';
import { PreferenceContext } from "../../../ContextProviders/PreferenceContext";
import sectionData from '../../../section_data.json';
import { getFormattedLastSeen, SensorStatus } from "../SensorStatus";

const LastUpdateAndSensorStatus = ({ sensor, size }) => {
    const theme = useTheme();
    const { language } = useContext(PreferenceContext);

    const offlineText = getTranslation(sectionData.status.content.offline, language);
    const lastUpdateText = getTranslation(sectionData.status.content.lastUpdate, language);

    return (
        <Typography
            variant={ElementSizes[size].sensorStatus}
            display="block"
            sx={{
                mt: 0,
                fontWeight: ElementSizes[size].importantFontWeight
            }}
        >
            {
                sensor?.sensor_status !== SensorStatus.active
                &&
                <>
                    <ErrorIcon
                        sx={{
                            '& *': {
                                color: `${theme.palette.text.aqi[3]} !important` // red
                            },
                            mr: 0.5
                        }} />
                    {offlineText}.&nbsp;
                </>
            }
            {`${lastUpdateText}: ${getFormattedLastSeen(sensor?.lastSeenInMinutes, language)}`}
        </Typography>
    )
}

export default LastUpdateAndSensorStatus;