import { useTheme } from '@mui/material';
import { getTranslation } from "../../../Utils/UtilFunctions";
import { Typography } from "@mui/material";
import { CurrentAQIGridSizeType, ElementSizes } from "./CurrentAQIGridSize";
import ErrorIcon from '@mui/icons-material/Error';
import sectionData from '../../../SectionData/sectionData';
import { getFormattedLastSeen, SensorStatus, SensorStatusType } from "../SensorStatus";
import { usePreferences } from '../../../ContextProviders/PreferenceContext';

interface LastUpdateAndSensorStatusProps {
    sensor_status: SensorStatusType;
    lastSeenInMinutes: number | null;
    size: CurrentAQIGridSizeType;
}

const LastUpdateAndSensorStatus = ({ sensor_status, lastSeenInMinutes, size }: LastUpdateAndSensorStatusProps) => {
    const theme = useTheme();
    const { language } = usePreferences();

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
                sensor_status !== SensorStatus.active
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
            {`${lastUpdateText}: ${getFormattedLastSeen(lastSeenInMinutes, language)}`}
        </Typography>
    )
}

export default LastUpdateAndSensorStatus;
