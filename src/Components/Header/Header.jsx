import { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link, Tooltip, Box, Typography, Container, Paper, AppBar, Toolbar, useScrollTrigger, Slide, Stack, Drawer, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/UtilFunctions';

import * as Tracking from '../../Utils/Tracking';

import { MetadataContext } from '../../ContextProviders/MetadataContext';
import FullWidthBox from '../FullWidthBox';

import ThemeSelector from './ThemeSelector';
import NavBar from './NavBar';

import sectionData from '../../section_data.json';
import CITIESlogoLinkToHome from './CITIESlogoLinkToHome';
import TemperatureUnitToggle from './TemperatureUnitToggle';
import { AppRoutes } from '../../Utils/AppRoutes';

import { useTheme } from '@mui/material';
import { CITIESair } from '../../Utils/GlobalVariables';
import Promo from '../Promo/Promo';

export const showInMobile = (defaultDisplay) => ({ display: { xs: (defaultDisplay || 'block'), lg: 'none' } });
export const showInDesktop = (defaultDisplay) => ({ display: { xs: 'none', lg: (defaultDisplay || 'block') } });

const toolBarHeightInRem = 3;

const StyledAppBar = styled(AppBar)(() => ({
  boxShadow: 'none',
  '& .MuiToolbar-root': {
    padding: 0
  }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2)
  }
}));

export default function Header() {
  const { currentPage } = useContext(MetadataContext);

  // trigger for hiding/showing the AppBar
  const triggerHideAppBar = useScrollTrigger({
    target: window,
    threshold: 70
  });

  // hamburger menu on mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const theme = useTheme();

  return (
    <>
      {/* Hidable navbar */}
      <Slide appear={false} direction="down" in={!triggerHideAppBar}>
        <StyledAppBar enableColorOnDark component="nav">
          <Toolbar sx={{ backgroundColor: 'primary', height: `${toolBarHeightInRem}rem` }}>
            <Container sx={{ height: '100%' }}>
              {/* CITIES logo and navbar */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" height="100%">
                <Paper
                  elevation={4}
                  sx={{
                    height: `${(toolBarHeightInRem * 4) / 3}rem`,
                    mt: `${toolBarHeightInRem}rem`,
                    opacity: triggerHideAppBar ? 0 : 1,
                    borderRadius: theme.shape.borderRadius,
                    transition: '0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.1)' },
                    mr: 2
                  }}
                >
                  <CITIESlogoLinkToHome />
                </Paper>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  width="100%"
                  height="100%"
                >
                  {/* Navbar in landscape placed here, will be hidden in mobile  */}
                  <Box sx={{ ...showInDesktop('block'), height: '100%' }}>
                    <NavBar currentPage={currentPage} isMobile={false} />
                  </Box>

                  <Tooltip title="Navigation Menu" enterDelay={0} leaveDelay={200}>
                    <IconButton
                      color="inherit"
                      aria-label="open mobile menu drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={showInMobile('flex')}
                    >
                      <MenuIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Settings" enterDelay={0} leaveDelay={200}>
                    <IconButton
                      color="inherit"
                      aria-label="open setting drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={{ ...showInDesktop('flex'), ml: 0 }}
                    >
                      <SettingsIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>

              </Stack>
            </Container>
          </Toolbar>
        </StyledAppBar>
      </Slide >

      <Box>
        <StyledDrawer
          anchor="right" // from which side the drawer slides in
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <Stack onClick={handleDrawerToggle}>
            <Box sx={showInMobile('block')}>
              <Container sx={{ py: 2 }}>
                <Typography variant="h6" color="text.secondary" fontWeight="medium" gutterBottom>
                  {CITIESair}
                </Typography>
                <NavBar currentPage={currentPage} isMobile={true} />
              </Container>
              <Divider />
            </Box>

            <Container sx={{ pt: 2, pb: 3 }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="h6" color="text.secondary" fontWeight="medium" >
                  Page Settings
                </Typography>
                <ThemeSelector isFullWidth />
                <TemperatureUnitToggle />
              </Stack>

            </Container>

          </Stack>
        </StyledDrawer>
      </Box>

      {/* From MUI's documentation:
      When you render the app bar position fixed,
      the dimension of the element doesn't impact the rest of the page.
      This can cause some part of your content to be invisible,
      behind the app bar. Here is how to fix:
      You can render a second <Toolbar /> component: */}

      <Toolbar
        id={sectionData.topAnchor.id}
        sx={{ backgroundColor: 'customAlternateBackground', height: `${toolBarHeightInRem * 1.5}rem` }}
      />

      <FullWidthBox sx={{
        backgroundColor: "customAlternateBackground",
        pt: 2
      }}>
        <Promo />
      </FullWidthBox>

      {
        (
          [AppRoutes.home, AppRoutes.login, AppRoutes.signUp, AppRoutes.verify].includes(currentPage)
            ? (
              <FullWidthBox sx={{
                width: '100%',
                pt: 1,
                pb: 3,
                backgroundColor: 'customAlternateBackground'
              }}
              >
                <Container>
                  <Typography
                    variant="h3"
                    color="text.primary"
                    fontWeight="medium"
                  >
                    CITIESair
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {parse(sectionData.siteDescription, {
                      replace: replacePlainHTMLWithMuiComponents,
                    })}
                    <br />
                  </Typography>
                  <Link
                    href={`#${sectionData.getInTouch.id}`}
                    underline="hover"
                    onClick={(e) => {
                      // Smooth scrolling
                      e.preventDefault();
                      const section = document.getElementById(sectionData.getInTouch.id);
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }

                      Tracking.sendEventAnalytics(
                        Tracking.Events.internalNavigation,
                        {
                          destination_id: sectionData.getInTouch.id,
                          origin_id: 'header'
                        }
                      );
                    }}
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Reach out to get involved!
                  </Link>
                </Container>
              </FullWidthBox>
            ) : null
        )
      }

    </>
  );
}
