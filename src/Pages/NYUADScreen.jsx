import { Box, Container, createTheme, Grid, Stack, ThemeProvider, Typography } from "@mui/material";
import NYUADbanner from "./Embeds/NYUADbanner";
import AtAGlance from "./Home/AtAGlance";
import AQImap, { TileOptions } from "../Components/AirQuality/AQImap";
import { useContext } from "react";
import { DashboardContext } from "../ContextProviders/DashboardContext";
import { CITIESair, CITIESair_URL } from "../Utils/GlobalVariables";
import CITIESlogoLinkToHome from "../Components/Header/CITIESlogoLinkToHome";
import { ScreenContext } from "../ContextProviders/ScreenContext";
import ThemePreferences from "../Themes/ThemePreferences";
import CustomThemes from "../Themes/CustomThemes";
import QRCode from "react-qr-code";

const darkOnlyTheme = createTheme({
    palette: {
        mode: ThemePreferences.dark,
        ...CustomThemes.dark.palette,
        ...CustomThemes.universal.palette,
    },
});

const NYUADScreen = () => {
    const { publicMapData } = useContext(DashboardContext);
    const { isLayoutReversed } = useContext(ScreenContext);

    return (
        <Grid
            container
            sx={{
                height: '100vh'
            }}
        >
            <ThemeProvider theme={darkOnlyTheme}>
                <Grid item md={12} lg={6}
                    sx={{
                        order: isLayoutReversed ? 1 : 0,
                        backgroundColor: "customBackground"
                    }}
                >
                    <Stack direction="column" justifyContent="space-between" sx={{ height: "100%" }}>
                        <Stack px={4} justifyContent="space-between" flex={1}>
                            <Stack>
                                <Typography
                                    variant="h2"
                                    color="text.primary"
                                    fontWeight="medium"
                                    mt={3}
                                >
                                    CITIESair
                                </Typography>

                                <Typography
                                    variant="h4"
                                    color="text.secondary"
                                    fontWeight="medium"
                                    sx={{ mb: 4 }}
                                >
                                    Real-time Air Quality Monitoring Network in the UAE
                                </Typography>

                                <AtAGlance />
                            </Stack>


                            <Typography color="text.primary" fontWeight="medium" variant="h4" sx={{ mb: 2 }}>
                                Public Outdoor Stations
                            </Typography>
                        </Stack>


                        <AQImap
                            overridenThemePreference={ThemePreferences.dark}
                            tileOption={TileOptions.default}
                            centerCoordinates={[24.44, 54.45]}
                            defaultZoom={11}
                            disableInteraction={true}
                            mapData={publicMapData}
                            ariaLabel={`Map of ${CITIESair} public outdoor air quality stations in UAE`}
                        />
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

                <Stack direction="column" alignItems="center" py={3} px={4}
                    sx={{ height: "100%" }}
                >
                    <Typography variant="h4" fontWeight="medium" color="text.primary" gutterBottom>
                        Learn More About Our Initiative!
                    </Typography>

                    <Box height="auto" width="7vw" sx={{ mb: 4 }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`https://${CITIESair_URL}`}
                            viewBox={`0 0 256 256`}
                        />
                    </Box>

                    <NYUADbanner
                        disableInteraction={true}
                        isOnBannerPage={false}
                    />
                </Stack>

            </Grid>
        </Grid >
    )
}

export default NYUADScreen;