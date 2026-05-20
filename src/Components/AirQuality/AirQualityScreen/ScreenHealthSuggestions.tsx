import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { INACTIVE_SENSOR_COLORS } from "../../../Themes/CustomColors";
import { AQI_Database } from "../../../business-domain/air-quality/air-quality.database";
import { TypesOfScreen } from "./ScreenUtils";
import { getTranslation } from "../../../Utils/UtilFunctions";
import sectionData from '../../../SectionData/sectionData';
import { usePreferences } from "../../../ContextProviders/PreferenceContext";
import { DataTypeKeys } from "../../../business-domain/data-types/data-type.types";
import { ReactNode } from "react";
import { ScreenSensorData, ScreenSensorsData } from "../../../Pages/Screens/SensorPairScreen";

interface ComparisonProps {
    data: ScreenSensorsData | undefined;
}

const Comparison = ({ data }: ComparisonProps) => {
    const { language } = usePreferences();

    // Type guard to check if response has data
    const hasData = (sensor: ScreenSensorData) => {
        return sensor.current.aqi !== null;
    };

    // Only display air quality comparison if we have data
    if (!Object.values(data ?? {}).length) return null;

    const outdoorsSensor = data?.find(d => hasData(d) && d.sensor?.location_type === "outdoors");
    if (!outdoorsSensor || !hasData(outdoorsSensor)) return null;

    const outdoorsAQI = outdoorsSensor.current.aqi?.val;
    if (!outdoorsAQI) return null;

    // Don't display comparison if outdoor air is already good
    if (outdoorsAQI <= AQI_Database[0][DataTypeKeys.aqi].high) return null;

    const indoorsSensor = data?.find(d => hasData(d) && d.sensor?.location_type.startsWith("indoors"));
    if (!indoorsSensor || !hasData(indoorsSensor)) return null;

    const indoorsAQI = indoorsSensor.current.aqi?.val;
    if (!indoorsAQI) return null;

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

interface ScreenHealthSuggestionsProps {
    typeOfScreen: TypesOfScreen;
    data: ScreenSensorsData | undefined;
}

const ScreenHealthSuggestions = ({ typeOfScreen, data }: ScreenHealthSuggestionsProps) => {
    const { language } = usePreferences();

    // Type guard to check if response has data
    const hasData = (sensor: ScreenSensorData) => {
        return sensor.current.aqi !== null;
    };

    const getHealthSuggestion = (sensorData: ScreenSensorData): ReactNode | null => {
        if (!hasData(sensorData)) return null;

        if (sensorData.current?.aqi?.categoryIndex !== undefined && sensorData.current.aqi.categoryIndex !== null) {
            const { healthSuggestions, category } =
                AQI_Database[sensorData.current.aqi.categoryIndex];
            const healthSuggestionText = getTranslation(
                healthSuggestions[sensorData.sensor?.location_type],
                language
            )

            switch (typeOfScreen) {
                case "indoorsVsOutdoors":
                    return healthSuggestionText;
                default:
                    const categoryText = getTranslation(category, language);
                    return `${categoryText}: ${healthSuggestionText}`;
            }
        }
        return null;
    };

    // Collect unique suggestions + whether they are unhealthy
    const suggestionsMap = new Map<ReactNode | null, boolean>();
    Object.values(data ?? {}).forEach((sensorData) => {
        const suggestion = getHealthSuggestion(sensorData);
        if (!suggestion) return;

        const isUnhealthy =  sensorData.current?.aqi?.val !== undefined &&
            sensorData.current.aqi.val >= AQI_Database[2][DataTypeKeys.aqi].low;

        // If suggestion already exists, keep it unhealthy if ANY sensor was unhealthy
        if (suggestionsMap.has(suggestion)) {
            suggestionsMap.set(
                suggestion,
                suggestionsMap.get(suggestion)! || isUnhealthy
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
            {typeOfScreen === "indoorsVsOutdoors" && (
                <Comparison data={data} />
            )}

            {[...suggestionsMap.entries()].map(([text, isUnhealthy], idx) => (
                <ListItem
                    key={idx}
                    className={isUnhealthy ? "flashingRed" : ""}
                >
                    <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
    );
};

export default ScreenHealthSuggestions;
