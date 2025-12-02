import { useContext } from "react";
import { PreferenceContext } from "../../../ContextProviders/PreferenceContext";
import { Box, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { AQI_Database } from "../../../Utils/AirQuality/AirQualityIndexHelper";
import { getTranslation } from "../../../Utils/UtilFunctions";
import { CurrentAQIGridSize, ElementSizes } from "./CurrentAQIGridSize";

const AQIScale = (props) => {
    const { isOnBannerPage, showLabel = true, size = CurrentAQIGridSize.medium } = props;

    const { themePreference, language } = useContext(PreferenceContext);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return (
        <Stack
            direction={isSmallScreen ? "column-reverse" : "row"}
            justifyContent="center"
            flex={1}
        >
            {AQI_Database.map((element, index) => (
                <Tooltip
                    key={index}
                    title={!isOnBannerPage && isSmallScreen && getTranslation(element.category, language)}
                    slotProps={{
                        popper: {
                            modifiers: [
                                { name: 'offset', options: { offset: [0, -48] } }
                            ],
                        },
                    }}
                >
                    <Stack
                        direction={isSmallScreen ? "row-reverse" : "column"}
                        width={isSmallScreen ? "auto" : "15%"}
                        justifyContent={isSmallScreen && "flex-end"}
                        alignItems={isSmallScreen && "flex-end"}
                        spacing={0.5}
                        flex={1}
                    >
                        <Typography
                            variant={ElementSizes[size].aqiScaleText}
                            fontWeight={500}
                            lineHeight={1}
                            color="text.secondary"
                        >
                            <small>{element.aqiUS.low === 301 ? '301+' : element.aqiUS.low}</small>
                        </Typography>
                        <Box
                            backgroundColor={element.color[themePreference]}
                            width={isSmallScreen ? ElementSizes[size].aqiScaleWidth : "100%"}
                            height={isSmallScreen ? "100%" : ElementSizes[size].aqiScaleHeight}
                        />

                        {(showLabel === true) &&
                            <Typography
                                variant={ElementSizes[size].aqiScaleText}
                                lineHeight={0.9}
                                color="text.secondary"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                    px: 0.25
                                }}
                            >
                                <small>{getTranslation(element.category, language)}</small>
                            </Typography>
                        }
                    </Stack>
                </Tooltip>
            ))}
        </Stack>
    )
}

export default AQIScale;