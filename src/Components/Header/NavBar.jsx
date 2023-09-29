import { styled } from '@mui/material/styles';
import { MenuList } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import CommentIcon from '@mui/icons-material/Comment';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import jsonData from '../../section_data.json';
import MenuItemAsNavLink from './MenuItemAsNavLink';
import NavLinkBehavior from './NavLinkBehavior';

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
                // If the current page is homepage, then display ABOUT link
                // If not homepage, display HOME link
                currentPage === 'home'
                  ? (
                    <MenuItemAsNavLink
                      behavior={NavLinkBehavior.scrollTo}
                      scrollToSectionID={jsonData.about.id}
                      icon={<InfoIcon />}
                      analyticsOriginID="navbar"
                    />
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
      {
                // If the current page is project, then display COMMENT link
                currentPage === 'project'
                && (
                <MenuItemAsNavLink
                  behavior={NavLinkBehavior.scrollTo}
                  scrollToSectionID={jsonData.commentSection.id}
                  icon={<CommentIcon />}
                  analyticsOriginID="navbar"
                />
                )
            }
      <MenuItemAsNavLink
        behavior={NavLinkBehavior.scrollTo}
        scrollToSectionID={jsonData.getInTouch.id}
        icon={<EmailIcon />}
        analyticsOriginID="navbar"
      />
    </StyledMenuList>
  );
}
