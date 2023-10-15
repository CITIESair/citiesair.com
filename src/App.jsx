// React components
import { React, useState, useMemo, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// MUI components
import { Box } from '@mui/material/';

// Theme
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ThemePreferences from './Themes/ThemePreferences';
import CustomThemes from './Themes/CustomThemes';

// UI components
import ScrollToTop from './Components/ScrollToTop';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import FourOhFour from './Pages/404';
import DeviceOrientationNotification from './Components/SnackBarNotifications';
import LoadingAnimation from './Components/LoadingAnimation';
import LogIn from './Components/Account/LogIn';

// Contexts
import { UserContext } from './ContextProviders/UserContext';
import { TemperatureUnits } from './Pages/Screen/TemperatureUtils';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Screen = lazy(() => import('./Pages/Screen/Screen'));

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
  // Get authentication context
  const [authenticated, _] = useContext(UserContext);

  // Set theme preference state based on localStorage or system preference
  const [themePreference, setThemePreference] = useState(
    localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemePreferences.dark : ThemePreferences.light)
  );
  // Set temperature unit preference state based on localStorage
  const [temperatureUnitPreference, setTemperatureUnitPreference] = useState(
    localStorage.getItem('temperatureUnit')
    || TemperatureUnits.celsius
  );

  // Create theme using getDesignTokens
  const theme = useMemo(
    () => createTheme(getDesignTokens(themePreference)),
    [themePreference]
  );

  // set backgroundColor of 'body' element depending on theme.
  // this is to set bg-color of left/right padding on landscape iOS devices
  document.body.style.background = theme.palette.customAlternateBackground;

  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <ScrollToTop />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: 'customBackground',
          }}
        >
          <DeviceOrientationNotification />
          <Suspense fallback={<LoadingAnimation optionalText="Loading Dashboard" />}>
            <Routes>
              <Route
                path="/"
                element={
                  <Box>
                    <Header setThemePreference={setThemePreference} temperatureUnitPreference={temperatureUnitPreference} setTemperatureUnitPreference={setTemperatureUnitPreference} />
                    <Home themePreference={themePreference} temperatureUnitPreference={temperatureUnitPreference} title="CITIESair" />
                    <Footer />
                  </Box>
                }
              />

              <Route
                path="/login"
                element={
                  <Box>
                    <Header setThemePreference={setThemePreference} temperatureUnitPreference={temperatureUnitPreference} setTemperatureUnitPreference={setTemperatureUnitPreference} />
                    <LogIn />
                    <Footer />
                  </Box>
                }
              />

              <Route
                path="/dashboard"
                element={
                  authenticated
                    ? (
                      <Box>
                        <Header setThemePreference={setThemePreference} temperatureUnitPreference={temperatureUnitPreference} setTemperatureUnitPreference={setTemperatureUnitPreference} />
                        <Dashboard themePreference={themePreference} temperatureUnitPreference={temperatureUnitPreference} title="CITIESair | Dashboard" />
                        <Footer />
                      </Box>
                    )
                    : (
                      <Box>
                        <Header setThemePreference={setThemePreference} temperatureUnitPreference={temperatureUnitPreference} setTemperatureUnitPreference={setTemperatureUnitPreference} title="CITIESair | Login" />
                        <LogIn />
                        <Footer />
                      </Box>
                    )
                }
              />

              <Route
                path="/screen/*"
                element={<Screen temperatureUnitPreference={temperatureUnitPreference} title="CITIESair | Screen" />}
              />

              <Route path="/404" element={<FourOhFour title="Page Not Found | CITIESair" />} />
              <Route path="*" element={<Navigate replace to="/404" />} />

            </Routes>
          </Suspense>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
