// React components
import { React, useMemo, lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';

// MUI components
import { Box } from '@mui/material/';

// Theme
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ThemePreferences from './Themes/ThemePreferences';
import CustomThemes from './Themes/CustomThemes';

// UI components
import Header from './Components/Header/Header';
import Footer from './Components/Footer';
import FourOhFour from './Pages/404';
import LoadingAnimation from './Components/LoadingAnimation';
import LogIn from './Components/Account/LogIn';
import NYUADmap from './Pages/Embeds/NYUADmap';
import SpeedDialButton from './Components/SpeedDial/SpeedDialButton';

import { UniqueRoutes } from './Utils/RoutesUtils';
import NYUADbanner from './Pages/Embeds/NYUADbanner';

import { DashboardProvider } from './ContextProviders/DashboardContext';
import { CommentCountsProvider } from './ContextProviders/CommentCountsContext';
import { PreferenceContext } from './ContextProviders/PreferenceContext';
import { LinkContext } from './ContextProviders/LinkContext';

import jsonData from './section_data.json';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Screen = lazy(() => import('./Pages/Screen'));

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
  const { chartsTitlesList } = useContext(LinkContext);

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
    const optionallyPassedThemePreference = queryParams.get('themePreference');
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
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: 'customBackground',
          }}
        >
          <SpeedDialButton chartsTitlesList={chartsTitlesList} topAnchorID={jsonData.topAnchor.id} />

          <Suspense fallback={<LoadingAnimation optionalText="Loading Dashboard" />}>
            <Routes>
              <Route
                path={UniqueRoutes.home}
                element={
                  <Box>
                    <Header />
                    <Home title="CITIESair" />
                    <Footer />
                  </Box>
                }
              />

              <Route
                path={UniqueRoutes.login}
                element={
                  <Box>
                    <Header />
                    <LogIn />
                    <Footer />
                  </Box>
                }
              />

              {
                [UniqueRoutes.dashboard, UniqueRoutes.dashboardWithParam].map((path) =>
                (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <Box>
                        <Header />
                        <DashboardProvider>
                          <CommentCountsProvider>
                            <Dashboard />
                          </CommentCountsProvider>
                        </DashboardProvider>
                        <Footer />
                      </Box>
                    }
                  />
                )
                )
              }

              <Route
                path={UniqueRoutes.anyScreen}
                element={<Screen title="CITIESair | Screen" />}
              />

              <Route
                path={UniqueRoutes.nyuadMap}
                element={<NYUADmap />}
              />

              <Route
                path={UniqueRoutes.nyuadBanner}
                element={<NYUADbanner isOnBannerPage={true} />}
              />

              <Route path={UniqueRoutes[404]} element={<FourOhFour title="Page Not Found | CITIESair" />} />
              <Route path="*" element={<Navigate replace to={UniqueRoutes[404]} />} />

            </Routes>
          </Suspense>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
