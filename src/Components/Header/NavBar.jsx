import { useContext, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { MenuList } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

import MenuItemAsNavLink from './MenuItemAsNavLink';
import NavLinkBehavior from './NavLinkBehavior';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { UserContext } from '../../ContextProviders/UserContext';

import LaunchIcon from '@mui/icons-material/Launch';
import PersonIcon from '@mui/icons-material/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindFocus, bindMenu } from 'material-ui-popup-state';

import LogOut from '../Account/Logout';

const StyledMenuList = styled(MenuList)(({ theme }) => ({
  // Make these items display on the same line on large display
  '& .MuiMenuItem-root': {
    [theme.breakpoints.up('lg')]: {
      display: 'inline-flex !important',
      height: '100%',
    },
  }
}));

export default function NavBar(props) {
  const { currentPage, isMobile } = props;
  const { user } = useContext(UserContext);
  const [navbar, setNavbar] = useState();

  const homeNavLink = (
    <MenuItemAsNavLink
      behavior={NavLinkBehavior.toNewPage}
      to="/"
      icon={<HomeIcon />}
      analyticsOriginID="navbar"
    />
  );

  const reservedAreaMenu = (
    user.authenticated ?
      (
        isMobile ?
          [<MenuItemAsNavLink
            label={`${user.username}'s Dashboard`}
            behavior={NavLinkBehavior.toNewPage}
            icon={<PersonIcon />}
            analyticsOriginID="navbar"
            to={"/dashboard"}
          />,
          <LogOut />]
          :
          <PopupState variant="popover" popupId="reserved-area-menu">
            {(popupState) => (
              <>
                <MenuItemAsNavLink
                  label={`${user.username}'s Dashboard`}
                  behavior={NavLinkBehavior.hoverMenu}
                  icon={<PersonIcon />}
                  analyticsOriginID="navbar"
                  to={"/dashboard"}
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
      :
      <MenuItemAsNavLink
        label={"School Login"}
        behavior={NavLinkBehavior.toNewPage}
        icon={<PersonIcon />}
        analyticsOriginID="navbar"
        to={"/login"}
      />

  );
  const nyuadDashboardNavLink = (
    <MenuItemAsNavLink
      label={"NYUAD Dashboard (Public access)"}
      behavior={NavLinkBehavior.toExternalPage}
      to="https://citiesdashboard.com/project/air-quality"
      icon={<LaunchIcon />}
      analyticsOriginID="navbar"
    />
  );
  const blogNavLink = (
    <MenuItemAsNavLink
      label={"CITIESair Blog"}
      behavior={NavLinkBehavior.toExternalPage}
      to="https://blog.citiesair.com"
      icon={<MenuBookIcon />}
      analyticsOriginID="navbar"
    />
  )

  useEffect(() => {
    switch (currentPage) {
      case 'home':
        setNavbar([nyuadDashboardNavLink, blogNavLink, reservedAreaMenu])
        break;
      default:
        setNavbar([homeNavLink, nyuadDashboardNavLink, blogNavLink, reservedAreaMenu])
        break;
    }
  }, [currentPage, user])

  return (
    <StyledMenuList sx={{ height: '100%', p: 0 }}>
      {navbar}
    </StyledMenuList>
  );
}
