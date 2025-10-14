import { Box, createTheme, Grid, Stack, ThemeProvider, Typography } from "@mui/material";
import AtAGlance from "./Home/AtAGlance";
import AQImap from "../Components/AirQuality/AirQualityMap/AQImap";
import { LocationTitles } from '../Components/AirQuality/AirQualityMap/AirQualityMapUtils';
import { TileOptions } from '../Components/AirQuality/AirQualityMap/AirQualityMapUtils';
import { useContext, useEffect, useState } from "react";
import { CITIESair, CITIESair_URL, FETCH_CURRENT_DATA_EVERY_MS, NYUAD } from "../Utils/GlobalVariables";
import CITIESlogoLinkToHome from "../Components/Header/CITIESlogoLinkToHome";
import { ScreenContext } from "../ContextProviders/ScreenContext";
import ThemePreferences from "../Themes/ThemePreferences";
import CustomThemes from "../Themes/CustomThemes";
import QRCode from "react-qr-code";
import { getApiUrl } from "../API/ApiUrls";
import { GeneralAPIendpoints } from "../API/Utils";
import { fetchAndProcessCurrentSensorsData } from "../API/ApiFetch";
import OutdoorStationUAE from "../Components/AirQuality/AirQualityMap/OutdoorStationUAE";

const darkOnlyTheme = createTheme({
    palette: {
        mode: ThemePreferences.light,
        ...CustomThemes.light.palette,
        ...CustomThemes.universal.palette,
    },
});

const NYUADScreen = () => {
    const { isLayoutReversed } = useContext(ScreenContext);

    const [nyuadCurrentData, setNYUADcurrentData] = useState();

    const url = getApiUrl({
        endpoint: GeneralAPIendpoints.current,
        school_id: NYUAD
    });

    useEffect(() => {
        fetchAndProcessCurrentSensorsData(url)
            .then((data) => {
                setNYUADcurrentData(data);
            })
            .catch((error) => console.error(error));

        // Set up interval to refresh data periodically
        const intervalId = setInterval(() => {
            fetchAndProcessCurrentSensorsData(url)
                .then((data) => {
                    setNYUADcurrentData(data);
                })
                .catch((error) => console.error(error));
        }, FETCH_CURRENT_DATA_EVERY_MS);

        // Cleanup interval when component unmounts or dependencies change
        return () => {
            clearInterval(intervalId);
        };
    }, [url]);

    return (
        <Grid
            container
            sx={{
                height: '100vh',
                cursor: 'none',
                overflow: 'hidden'
            }}
        >
            <ThemeProvider theme={darkOnlyTheme}>
                <Grid item md={12} lg={6}
                    sx={{
                        order: isLayoutReversed ? 1 : 0,
                        backgroundColor: "customAlternateBackground"
                    }}
                >
                    <Stack direction="column" justifyContent="space-between" sx={{ height: "100%" }}>
                        <Stack px={4} justifyContent="space-between" flex={1}>
                            <Stack>
                                <Typography
                                    variant="h1"
                                    color="text.primary"
                                    fontWeight="medium"
                                    mt={3}
                                >
                                    {CITIESair}
                                </Typography>

                                <Typography
                                    variant="h3"
                                    color="text.secondary"
                                    fontWeight="medium"
                                    gutterBottom
                                >
                                    Real-time Air Quality Monitoring Network in the UAE
                                </Typography>

                                <AtAGlance />
                            </Stack>
                        </Stack>

                        <OutdoorStationUAE overridenThemePreference={ThemePreferences.light} />
                    </Stack>
                </Grid>

            </ThemeProvider>

            <Grid item md={12} lg={6}
                sx={{
                    px: 2,
                    backgroundColor: "customAlternateBackground",
                    order: isLayoutReversed ? 0 : 1
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: !isLayoutReversed && 0,
                        left: isLayoutReversed && 0,
                        width: '5vw',
                        height: '5vw',
                        m: 1
                    }}
                >
                    <CITIESlogoLinkToHome />
                </Box>

                <Stack direction="column" alignItems="center" pt={3}
                    sx={{ height: "100%" }}
                >
                    <Typography variant="h2" fontWeight="medium" color="text.primary" gutterBottom>
                        Learn More!
                    </Typography>

                    <Box height="auto" width="7vw">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`https://${CITIESair_URL}`}
                            viewBox={`0 0 256 256`}
                        />
                    </Box>

                    <Box width="100%" flex={1} my={1}>
                        <AQImap
                            tileOption={TileOptions.nyuad}
                            themePreference={ThemePreferences.light}
                            defaultZoom={17.5}
                            minZoom={17.5}
                            maxZoom={17.5}
                            disableInteraction={true}
                            displayMinimap={false}
                            locationTitle={LocationTitles.short}
                            fullSizeMap={true}
                            showAttribution={false}
                            mapData={nyuadCurrentData}
                            markerSizeInRem={1.5}
                            ariaLabel={"A map of all air quality sensors at NYU Abu Dhabi"}
                        />
                    </Box>

                </Stack>

            </Grid>
        </Grid >
    )
}

export default NYUADScreen;