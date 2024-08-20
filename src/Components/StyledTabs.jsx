import { styled } from '@mui/material/styles';
import { Tabs } from '@mui/material/';

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'smallFontSize',
})(({ theme, smallFontSize = '0.625rem' }) => ({
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