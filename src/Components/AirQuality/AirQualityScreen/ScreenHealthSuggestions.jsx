import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { INACTIVE_SENSOR_COLORS } from "../../../Themes/CustomColors";
import { AQI_Database } from "../../../Utils/AirQuality/AirQualityIndexHelper";
import { SensorStatus } from "../SensorStatus";
import { TypesOfScreen } from "./ScreenUtils";
import { getTranslation } from "../../../Utils/UtilFunctions";
import { useContext } from "react";
import { PreferenceContext } from "../../../ContextProviders/PreferenceContext";

import sectionData from '../../../section_data.json';
import parse from 'html-react-parser';

const Comparison = ({ data }) => {
    const { language } = useContext(PreferenceContext);

    // Only display air quality comparison if every sensor is currently active
    if (!Object.values(data).every((sensorData) => sensorData.sensor?.sensor_status === SensorStatus.active)) return null;

    const outdoorsSensor = data.find(d => d.sensor?.location_type === "outdoors");
    const outdoorsAQI = outdoorsSensor.current.aqi.val;
    // Don’t display comparison if outdoor air is already good
    if (outdoorsAQI <= AQI_Database[0].aqiUS.high) return null;

    const indoorsSensor = data.find(d => d.sensor?.location_type.startsWith("indoors"));
    const indoorsAQI = indoorsSensor.current.aqi.val;

    const ratio = outdoorsAQI / indoorsAQI;
    const comparison =
        ratio >= 2
            ? `${ratio.toFixed(1)}x`
            : ratio > 1.2
                ? `${Math.round(((outdoorsAQI - indoorsAQI) / indoorsAQI) * 100)}%`
                : null;

    if (!comparison) return null;

    return (
        <ListItem>
            <ListItemText
                primary={getTranslation(sectionData.screen.content.indoorsVsOutdoors, language, {
                    value: (
                        <Typography
                            component="span"
                            color={`${AQI_Database[0].color.Light} !important`}
                        >
                            {comparison}
                        </Typography>
                    ),
                })}
            />
        </ListItem>
    );
}

const ScreenHealthSuggestions = ({ typeOfScreen, data }) => {
    const { language } = useContext(PreferenceContext);

    const getHealthSuggestion = (sensorData) => {
        if (sensorData?.current?.aqi?.categoryIndex !== undefined) {
            const { healthSuggestions, category } =
                AQI_Database[sensorData.current.aqi.categoryIndex];
            const healthSuggestionText = getTranslation(
                healthSuggestions[sensorData.sensor?.location_type],
                language
            )

            switch (typeOfScreen) {
                case TypesOfScreen.indoorsVsOutdoors:
                    return healthSuggestionText;
                default:
                    const categoryText = getTranslation(category, language);
                    return `${categoryText}: ${healthSuggestionText}`
            }
        }
        return null;
    };

    // Collect unique suggestions + whether they are unhealthy
    const suggestionsMap = new Map();
    Object.values(data).forEach((sensorData) => {
        const suggestion = getHealthSuggestion(sensorData);
        if (!suggestion) return;

        const isUnhealthy =
            sensorData.current?.aqi?.val >= AQI_Database[2].aqiUS.low;

        // If suggestion already exists, keep it unhealthy if ANY sensor was unhealthy
        if (suggestionsMap.has(suggestion)) {
            suggestionsMap.set(
                suggestion,
                suggestionsMap.get(suggestion) || isUnhealthy
            );
        } else {
            suggestionsMap.set(suggestion, isUnhealthy);
        }
    });

    return (
        <List
            className="condensedFont"
            sx={{
                listStyleType: "disclosure-closed",
                "& .MuiTypography-root": { fontSize: "2rem" },
                "& .MuiListItem-root": { display: "list-item", ml: 3, p: 0, pr: 3 },
                "& .MuiTypography-root, .MuiListItem-root": {
                    color: INACTIVE_SENSOR_COLORS.screen,
                },
            }}
        >
            {typeOfScreen === TypesOfScreen.indoorsVsOutdoors && (
                <Comparison data={data} />
            )}

            {[...suggestionsMap.entries()].map(([text, isUnhealthy], idx) => (
                <ListItem
                    key={idx}
                    className={isUnhealthy ? "flashingRed" : ""}
                >
                    <ListItemText primary={parse(text)} />
                </ListItem>
            ))}
        </List>
    );
};

export default ScreenHealthSuggestions;