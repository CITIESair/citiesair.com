import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { MenuItem, Box, Button } from '@mui/material';

import NavLinkBehavior from './NavLinkBehavior';

import * as Tracking from '../../Utils/Tracking';

import { capitalizePhrase } from '../../Utils/UtilFunctions';

export const StyledMenuItem = styled(MenuItem)(({ theme, sx }) => ({
  ...sx,
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  minHeight: 'unset',
  // Make height 100% and vertical align text elements of popup menu
  '& .MuiBox-root': {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  [theme.breakpoints.up('lg')]: {
    '&:hover': {
      backgroundColor: theme.palette.backgroundColorForNavLink
    }
  }
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '0.8rem'
  }
}));

export const scrollToSection = (scrollToSectionID) => {
  const section = document.getElementById(scrollToSectionID);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function MenuItemAsNavLink(props) {
  // eslint-disable-next-line max-len
  const { behavior, to, scrollToSectionID, icon, sx, analyticsOriginID, school_id, analyticsDestinationLabel, bindHoverProps, bindFocusProps } = props;
  let { label } = props;

  if (label && typeof label === 'string') label = capitalizePhrase(label);

  const newPageLabel = capitalizePhrase((to === '/') ? 'home' : to);

  switch (behavior) {
    case NavLinkBehavior.toNewPage: {
      return (
        <StyledMenuItem
          sx={sx}
          component={Link}
          to={to}
          onClick={() => {
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: to,
                destination_label: newPageLabel,
                destination_school_id: school_id,
                origin_id: analyticsOriginID
              }
            );
          }}
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label || newPageLabel}
        </StyledMenuItem>
      );
    }

    case NavLinkBehavior.toExternalPage:
      return (
        <StyledMenuItem
          sx={{ ...sx, textTransform: 'none' }}
          component={Button}
          href={to}
          target='blank'
          rel="noopener noreferrer"
          onClick={() => {
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: to,
                destination_label: label,
                origin_id: analyticsOriginID
              }
            );
          }}
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label}
        </StyledMenuItem>
      );

    case NavLinkBehavior.scrollTo:
      return (
        <StyledMenuItem
          sx={sx}
          onClick={() => {
            if (scrollToSectionID) {
              scrollToSection(scrollToSectionID);
            }
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: scrollToSectionID,
                destination_label: analyticsDestinationLabel,
                origin_id: analyticsOriginID
              }
            );
          }}
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label || capitalizePhrase(scrollToSectionID)}
        </StyledMenuItem>
      );

    case NavLinkBehavior.hoverMenu:
      return (
        <StyledMenuItem
          sx={sx}
          component={to && Link}
          to={to}
          onClick={() => {
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: to,
                destination_label: newPageLabel,
                origin_id: analyticsOriginID
              }
            );
          }}
          {...bindHoverProps}
          {...bindFocusProps}
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label}
        </StyledMenuItem>
      );

    case NavLinkBehavior.doNothing:
      return (
        <StyledMenuItem
          sx={sx}
          disabled
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label}
        </StyledMenuItem>
      );

    default:
      return null;
  }
}
