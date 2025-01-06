// React components
import { React, useMemo, lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// MUI components
import { Box } from "@mui/material/";

// Theme
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ThemePreferences from "./Themes/ThemePreferences";
import CustomThemes from "./Themes/CustomThemes";

// UI components
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer";
import FourOhFour from "./Pages/404";
import LoadingAnimation from "./Components/LoadingAnimation";
import Login from "./Components/Account/Login";
import SignUp from "./Components/Account/SignUp";
import Verify from "./Components/Account/Verify";
import NYUADmap from "./Pages/Embeds/NYUADmap";
import SpeedDialButton from "./Components/SpeedDial/SpeedDialButton";

import { AppRoutes } from "./Utils/AppRoutes";
import NYUADbanner from "./Pages/Embeds/NYUADbanner";

import { DashboardProvider } from "./ContextProviders/DashboardContext";
import { PreferenceContext } from "./ContextProviders/PreferenceContext";
import { MetadataContext } from "./ContextProviders/MetadataContext";

import jsonData from "./section_data.json";

import { CITIESair } from "./Utils/GlobalVariables";
import GoogleOAuthCallback from "./Components/Account/OAuth/GoogleOAuthCallback";
import ScrollToTop from "./Components/ScrollToTop";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home/Home"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Screen = lazy(() => import("./Pages/Screen"));

// Create theme design tokens based on theme preference
const getDesignTokens = (themePreference) => ({
  palette: {
    mode: themePreference,
    ...(themePreference === ThemePreferences.dark
      ? {
        ...CustomThemes.dark.palette,
        ...CustomThemes.universal.palette,
        typography: CustomThemes.universal.palette,
      }
      : {
        ...CustomThemes.light.palette,
        ...CustomThemes.universal.palette,
        typography: CustomThemes.universal.palette,
      }),
  },
});

function App() {
  const { themePreference, setThemePreference } = useContext(PreferenceContext);
  const { chartsTitlesList } = useContext(MetadataContext);

  // Create theme using getDesignTokens
  const theme = useMemo(
    () => createTheme(getDesignTokens(themePreference)),
    [themePreference]
  );

  // set backgroundColor of 'body' element depending on theme.
  // this is to set bg-color of left/right padding on landscape iOS devices
  document.body.style.background = theme.palette.customAlternateBackground;

  // Update the themePreference to if it is included in queryParams when the app is mounted
  // and reset it when the component is unmounted
  useEffect(() => {
    // Use vanilla JS to get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const optionallyPassedThemePreference = queryParams.get("themePreference");
    if (optionallyPassedThemePreference) {
      const previousTheme = themePreference;
      setThemePreference(optionallyPassedThemePreference);

      return () => {
        setThemePreference(previousTheme);
      };
    }
  }, []);

  return (
    <BrowserRouter basename="/">
      <ScrollToTop />
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "customBackground",
          }}
        >
          <SpeedDialButton
            chartsTitlesList={chartsTitlesList}
            topAnchorID={jsonData.topAnchor.id}
          />

          <Suspense
            fallback={<LoadingAnimation optionalText="Loading Dashboard" />}
          >
            <Routes>
              {/* ----- HOME ----- */}
              <Route
                path={AppRoutes.home}
                element={
                  <Box>
                    <Header />
                    <Home title={CITIESair} />
                    <Footer />
                  </Box>
                }
              />

              {/* ----- AUTHENTICATION ROUTES ----- */}
              <Route
                path={AppRoutes.login}
                element={
                  <Box>
                    <Header />
                    <Login />
                    <Footer />
                  </Box>
                }
              />
              <Route
                path={AppRoutes.signUp}
                element={
                  <Box>
                    <Header />
                    <SignUp />
                    <Footer />
                  </Box>
                }
              />
              <Route
                path={AppRoutes.verify}
                element={
                  <Box>
                    <Header />
                    <Verify />
                    <Footer />
                  </Box>
                }
              />
              <Route
                path={AppRoutes.googleCallback}
                element={
                  <Box>
                    <Header />
                    <GoogleOAuthCallback />
                    <Footer />
                  </Box>
                }
              />

              {/* ----- DASHBOARD ROUTES ----- */}
              {[AppRoutes.dashboard, AppRoutes.dashboardWithParam].map(
                (path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <Box>
                        <Header />
                        <DashboardProvider>
                          <Dashboard />
                        </DashboardProvider>
                        <Footer />
                      </Box>
                    }
                  />
                )
              )}

              {/* ----- OTHER ROUTES: SCREENS, MAPS, BANNERS... ----- */}
              <Route
                path={AppRoutes.anyScreen}
                element={<Screen title={`${CITIESair} | Screen`} />}
              />

              <Route path={AppRoutes.nyuadMap} element={<NYUADmap />} />

              <Route
                path={AppRoutes.nyuadBanner}
                element={<NYUADbanner isOnBannerPage={true} />}
              />

              {/* ----- 404 ROUTES ----- */}
              <Route
                path={AppRoutes[404]}
                element={<FourOhFour title={`${CITIESair} | Page Not Found`} />}
              />
              <Route
                path="*"
                element={<Navigate replace to={AppRoutes[404]} />}
              />
            </Routes>
          </Suspense>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
