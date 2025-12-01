import { Box, createTheme, Grid, Stack, ThemeProvider, Typography, useTheme } from "@mui/material";
import AtAGlance from "../Home/AtAGlance";
import AQImap from "../../Components/AirQuality/AirQualityMap/AQImap";
import { LocationTitles } from '../../Components/AirQuality/AirQualityMap/AirQualityMapUtils';
import { TileOptions } from '../../Components/AirQuality/AirQualityMap/AirQualityMapUtils';
import { useContext } from "react";
import { CITIESair, KAMPALA, NYUAD } from "../../Utils/GlobalVariables";
import CITIESlogoLinkToHome from "../../Components/Header/CITIESlogoLinkToHome";
import { ScreenContext } from "../../ContextProviders/ScreenContext";
import ThemePreferences from "../../Themes/ThemePreferences";
import CustomThemes from "../../Themes/CustomThemes";
import OutdoorStationUAE from "../../Components/AirQuality/AirQualityMap/OutdoorStationUAE";
import useCurrentSensorsData from "../../hooks/useCurrentSensorsData";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import useSchoolMetadata from "../../hooks/useSchoolMetadata";
import CurrentAQIMapWithGrid from "../../Components/AirQuality/CurrentAQI/CurrentAQIMapWithGrid";
import CurrentAQIGrid from "../../Components/AirQuality/CurrentAQI/CurrentAQIGrid";

import sectionData from "../../section_data.json";
import { getTranslation } from "../../Utils/UtilFunctions";
import { PreferenceContext } from "../../ContextProviders/PreferenceContext";
import BlackScreen from "./BlackScreen";
import ScreenQRcode from "../../Components/AirQuality/AirQualityScreen/ScreenQRcode";
import { CurrentAQIGridSize } from "../../Components/AirQuality/CurrentAQI/CurrentAQIGridSize";

const lightOnlyTheme = createTheme({
    palette: {
        mode: ThemePreferences.light,
        ...CustomThemes.light.palette,
        ...CustomThemes.universal.palette,
    },
});

const AllSensorsScreen = () => {
    const { shouldDisplayScreen } = useContext(ScreenContext);
    const { language } = useContext(PreferenceContext);
    const { currentSchoolID } = useContext(DashboardContext);

    const theme = useTheme();


    const isNYUAD = currentSchoolID === NYUAD;

    if (!shouldDisplayScreen) return <BlackScreen />

    return (
        <ThemeProvider theme={lightOnlyTheme}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '5vw',
                    height: '5vw',
                    mx: theme.spacing(4),
                    my: theme.spacing(3)
                }}
            >
                <CITIESlogoLinkToHome />
            </Box>

            <Stack
                sx={{
                    height: '100vh',
                    cursor: 'none',
                    overflow: 'hidden',
                    backgroundColor: "customAlternateBackground"
                }}
            >
                <Grid container px={4} py={3}>
                    <Grid item md={12} lg={6}>
                        <Stack>
                            <Typography
                                variant="h2"
                                color="text.primary"
                                fontWeight="medium"
                                mb={1}
                            >
                                {CITIESair}
                            </Typography>

                            {
                                !isNYUAD && <Typography
                                    variant="h4"
                                    color="text.secondary"
                                    fontWeight="medium"
                                    textTransform="capitalize"
                                >
                                    {getTranslation(sectionData.allSensorsScreen.content.title, language)}
                                    &nbsp;
                                    {!isNYUAD && currentSchoolID}
                                </Typography>
                            }

                            {
                                currentSchoolID === KAMPALA && <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    textTransform="capitalize"
                                >
                                    {getTranslation(sectionData.screen.content.dataProvider, language)}
                                </Typography>
                            }

                            {isNYUAD && <AtAGlance />}
                        </Stack>
                    </Grid>


                    <Grid item md={12} lg={6}>
                        <Stack alignItems="center" justifyContent="space-around" height="100%">
                            <Typography
                                variant={isNYUAD ? "h4" : "h4"}
                                color="text.primary"
                                fontWeight="medium"
                                gutterBottom
                                textTransform="capitalize"
                            >
                                {getTranslation(
                                    isNYUAD ? sectionData.allSensorsScreen.content.nyuadTitle : sectionData.allSensorsScreen.content.learnMore,
                                    language
                                )}
                            </Typography>

                            <Box height="auto" width="7vw">
                                <ScreenQRcode />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                {
                    isNYUAD ? <NYUADscreen /> : <GeneralScreen />
                }

            </Stack >
        </ThemeProvider>

    )
}

const GeneralScreen = () => {
    const { shouldDisplayScreen } = useContext(ScreenContext);
    const { currentSchoolID } = useContext(DashboardContext);
    const { data: currentSensorsData } = useCurrentSensorsData({ enabled: shouldDisplayScreen });
    const { data: schoolMetadata } = useSchoolMetadata({ enabled: shouldDisplayScreen });

    return (
        schoolMetadata?.has_map ? (
            <CurrentAQIMapWithGrid
                currentSensorsData={currentSensorsData}
                schoolID={currentSchoolID}
                isOnBannerPage={false}
                minMapHeight={"250px"}
                maxWidth={null}
                size={CurrentAQIGridSize.large}
                sx={{
                    paddingRight: "2rem"
                }}
            />
        ) : (
            <CurrentAQIGrid
                currentSensorsData={currentSensorsData}
                isScreen={false}
                size={CurrentAQIGridSize.large}
            />
        )
    )
}

const NYUADscreen = () => {
    const { shouldDisplayScreen } = useContext(ScreenContext);
    const { data: currentSensorsData } = useCurrentSensorsData({ enabled: shouldDisplayScreen, schoolID: NYUAD });

    return (
        <Grid container flex={1}>
            <Grid item md={12} lg={6}
                sx={{
                    backgroundColor: "customAlternateBackground"
                }}
            >
                <Stack direction="column" justifyContent="space-between" sx={{ height: "100%" }}>

                    <OutdoorStationUAE overridenThemePreference={ThemePreferences.light} fullSizeMap={true} />
                </Stack>
            </Grid>

            <Grid item md={12} lg={6}
                sx={{
                    px: 2,
                    backgroundColor: "customAlternateBackground"
                }}
            >
                <Stack direction="column" alignItems="center"
                    sx={{ height: "100%" }}
                >
                    <Box width="100%" flex={1} my={1}>
                        <AQImap
                            tileOption={TileOptions.nyuad}
                            shouldCluster={false}
                            themePreference={ThemePreferences.light}
                            defaultZoom={17.5}
                            minZoom={17.5}
                            maxZoom={17.5}
                            disableInteraction={true}
                            displayMinimap={false}
                            locationTitle={LocationTitles.short}
                            fullSizeMap={true}
                            showAttribution={false}
                            mapData={currentSensorsData}
                            markerSizeInRem={1.5}
                            ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
                        />
                    </Box>

                </Stack>

            </Grid>
        </Grid>
    )
}

export default AllSensorsScreen;