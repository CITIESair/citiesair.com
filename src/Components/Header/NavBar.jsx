import { styled } from '@mui/material/styles';
import { MenuList } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';

import MenuItemAsNavLink from './MenuItemAsNavLink';
import NavLinkBehavior from './NavLinkBehavior';
import BarChartIcon from '@mui/icons-material/BarChart';

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
                label={"School Dashboard (Required login)"}
                behavior={NavLinkBehavior.toNewPage}
                to="/dashboard"
                icon={<BarChartIcon />}
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
