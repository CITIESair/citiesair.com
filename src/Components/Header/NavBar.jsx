import { useContext, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { MenuList } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

import MenuItemAsNavLink from './MenuItemAsNavLink';
import NavLinkBehavior from './NavLinkBehavior';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { UserContext } from '../../ContextProviders/UserContext';

import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindFocus, bindMenu } from 'material-ui-popup-state';

import LogOut from '../Account/Logout';
import { UniqueRoutes } from '../../Utils/RoutesUtils';
import { CITIESair, NYUAD } from '../../Utils/GlobalVariables';

const StyledMenuList = styled(MenuList)(({ theme }) => ({
  // Make these items display on the same line on large display
  '& .MuiMenuItem-root': {
    [theme.breakpoints.up('lg')]: {
      display: 'inline-flex !important',
      height: '100%',
    },
  }
}));

const NavBar = (props) => {
  const { currentPage, isMobile } = props;
  const { user } = useContext(UserContext);
  const [navbar, setNavbar] = useState([]);

  const homeNavLink = (
    <MenuItemAsNavLink
      key="home"
      behavior={NavLinkBehavior.toNewPage}
      to={UniqueRoutes.home}
      icon={<HomeIcon />}
      analyticsOriginID="navbar"
    />
  );

  const getFormattedUsername = (username) => {
    if (!username) return "NO USERNAME";
    return username.toUpperCase();
  };

  const reservedAreaMenu = user.authenticated ? (
    isMobile ? (
      [
        <MenuItemAsNavLink
          key="dashboard"
          label={`${getFormattedUsername(user.username)}'s Dashboard`}
          behavior={NavLinkBehavior.toNewPage}
          icon={<PersonIcon />}
          analyticsOriginID="navbar"
          to={UniqueRoutes.dashboard}
        />,
        <LogOut key="logout" />
      ]
    ) : (
      <PopupState key="reserved-area-menu" variant="popover" popupId="reserved-area-menu">
        {(popupState) => (
          <>
            <MenuItemAsNavLink
              label={`${getFormattedUsername(user.username)}'s Dashboard`}
              behavior={NavLinkBehavior.hoverMenu}
              icon={<PersonIcon />}
              analyticsOriginID="navbar"
              to={UniqueRoutes.dashboard}
              bindHoverProps={bindHover(popupState)}
              bindFocusProps={bindFocus(popupState)}
            />
            <HoverMenu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              onClick={popupState.close}
              PaperProps={{
                style: {
                  width: '1000'
                },
              }}
            >
              <LogOut />
            </HoverMenu>
          </>
        )}
      </PopupState>
    )
  ) : (
    <MenuItemAsNavLink
      key="login"
      label={"School Login"}
      behavior={NavLinkBehavior.toNewPage}
      icon={<PersonIcon />}
      analyticsOriginID="navbar"
      to={UniqueRoutes.login}
    />
  );

  const nyuadDashboardNavLink = (
    <MenuItemAsNavLink
      key={NYUAD}
      label={"NYUAD Dashboard (Public access)"}
      behavior={NavLinkBehavior.toNewPage}
      to={UniqueRoutes.nyuad}
      icon={<BarChartIcon />}
      analyticsOriginID="navbar"
      school_id={NYUAD}
    />
  );

  const blogNavLink = (
    <MenuItemAsNavLink
      key="blog"
      label={`${CITIESair} Blog`}
      behavior={NavLinkBehavior.toExternalPage}
      to={UniqueRoutes.blogSubdomain}
      icon={<MenuBookIcon />}
      analyticsOriginID="navbar"
    />
  );

  useEffect(() => {
    switch (currentPage) {
      case UniqueRoutes.home:
        setNavbar([nyuadDashboardNavLink, blogNavLink, reservedAreaMenu]);
        break;
      default:
        setNavbar([homeNavLink, blogNavLink, reservedAreaMenu]);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, user]);

  return (
    <StyledMenuList sx={{ height: '100%', p: 0 }}>
      {navbar}
    </StyledMenuList>
  );
};

export default NavBar;

