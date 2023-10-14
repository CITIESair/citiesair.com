import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { MenuList } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

import MenuItemAsNavLink from './MenuItemAsNavLink';
import NavLinkBehavior from './NavLinkBehavior';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { UserContext } from '../../ContextProviders/UserContext';

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
  const { currentPage } = props;
  const [authenticated, userName] = useContext(UserContext);
  const getSchoolDashboardLinkLabel = () => {
    if (authenticated && userName) {
      return `School Dashboard (User: ${userName})`
    } else {
      return 'School Dashboard (Private access)';
    }
  };

  return (
    <StyledMenuList sx={{ height: '100%', p: 0 }}>
      {
        // If the current page is homepage, then display Dashboard link
        // If not homepage, display HOME link
        currentPage === 'home'
          ? (
            <>
              <MenuItemAsNavLink
                label={"NYUAD Dashboard (Public access)"}
                behavior={NavLinkBehavior.toExternalPage}
                to="https://citiesdashboard.com/project/air-quality"
                icon={<BarChartIcon />}
                analyticsOriginID="navbar"
              />
              <MenuItemAsNavLink
                label={getSchoolDashboardLinkLabel()}
                behavior={NavLinkBehavior.toNewPage}
                to="/dashboard"
                icon={<BarChartIcon />}
                analyticsOriginID="navbar"
              /><MenuItemAsNavLink
                label={"CITIESair Blog"}
                behavior={NavLinkBehavior.toExternalPage}
                to="https://blog.citiesair.com"
                icon={<MenuBookIcon />}
                analyticsOriginID="navbar"
              />
            </>
          )
          : (
            <MenuItemAsNavLink
              behavior={NavLinkBehavior.toNewPage}
              to="/"
              icon={<HomeIcon />}
              analyticsOriginID="navbar"
            />
          )
      }
    </StyledMenuList>
  );
}
