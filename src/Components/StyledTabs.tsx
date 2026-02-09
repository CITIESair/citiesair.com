import { styled } from '@mui/material/styles';
import { Tabs } from '@mui/material/';
import { Theme } from '@mui/material/styles';

interface StyledTabsProps {
  smallFontSize?: string;
  theme: Theme;
}

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'smallFontSize',
})<StyledTabsProps>(({ theme, smallFontSize = '0.625rem' }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  '& .MuiTabScrollButton-root': {
    color: theme.palette.text.primary
  },
  '& .MuiTab-root': {
    [theme.breakpoints.down('sm')]: {
      fontSize: smallFontSize,
      padding: theme.spacing(0.5)
    },
  },
  '& .MuiSvgIcon-root ': {
    [theme.breakpoints.down('sm')]: {
      fontSize: "1rem"
    }
  }
}));

export default StyledTabs;
