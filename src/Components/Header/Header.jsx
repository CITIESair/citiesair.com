import { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Link, Tooltip, Box, Typography, Container, Paper, AppBar, Toolbar, useScrollTrigger, Slide, Stack, Drawer, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import parse from 'html-react-parser';
import * as Tracking from '../../Utils/Tracking';

import { LinkContext } from '../../ContextProviders/LinkContext';
import FullWidthBox from '../FullWidthBox';

import ThemeSelector from './ThemeSelector';
import NavBar from './NavBar';
import SpeedDialButton from './SpeedDialButton';

// import images

import jsonData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';
import CITIESlogoLinkToHome from './CITIESlogoLinkToHome';

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
    borderRadius: '0.5rem',
    margin: theme.spacing(2)
  }
}));

export default function Header(props) {
  const { setThemePreference } = props;

  // eslint-disable-next-line no-unused-vars
  const [currentPage, _, chartsTitlesList, __] = useContext(LinkContext);

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
                    borderRadius: '0.5rem',
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
                  {/* <Box sx={{ ...showInDesktop('block'), height: '100%' }}>
                    <NavBar currentPage={currentPage} />
                  </Box> */}

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
                      sx={showInDesktop('flex')}
                    >
                      <SettingsIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>

              </Stack>
            </Container>
          </Toolbar>
        </StyledAppBar>
      </Slide>

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
            {/* // Only show the NavBar here in mobile  */}
            {/* <Box sx={showInMobile('block')}>
              <Container sx={{ py: 2 }}>
                <Typography variant="h6" color="text.secondary" fontWeight="medium" gutterBottom>
                  CITIES Dashboard
                </Typography>
                <NavBar currentPage={currentPage} />
              </Container>
              <Divider />
            </Box> */}

            <Container sx={{ pt: 2, pb: 3 }}>
              <Typography variant="h6" color="text.secondary" fontWeight="medium" gutterBottom>
                Dashboard Settings
              </Typography>
              <ThemeSelector isFullWidth setThemePreference={setThemePreference} />
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
        id={jsonData.topAnchor.id}
        sx={{ backgroundColor: 'customAlternateBackground', height: `${toolBarHeightInRem * 1.5}rem` }}
      />

      {(
        currentPage === 'home'
        && (
          <FullWidthBox sx={{
            width: '100%',
            pt: 4,
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
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {parse(jsonData.siteDescription, {
                  replace: replacePlainHTMLWithMuiComponents,
                })}
                <br />
              </Typography>
            </Container>
          </FullWidthBox>
        )
      )}

      <SpeedDialButton chartsTitlesList={chartsTitlesList} topAnchorID={jsonData.topAnchor.id} />

    </>
  );
}
