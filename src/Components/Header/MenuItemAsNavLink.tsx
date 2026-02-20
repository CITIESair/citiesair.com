import React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { MenuItem, Box, Button } from '@mui/material';
import NavLinkBehavior from './NavLinkBehavior';
import type { NavLinkBehaviorValue } from './NavLinkBehavior';
import * as Tracking from '../../Utils/Tracking';
import { capitalizePhrase } from '../../Utils/UtilFunctions';

interface StyledMenuItemExtraProps {
  component?: React.ElementType;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const StyledMenuItem = styled(MenuItem)<StyledMenuItemExtraProps>(({ theme }: { theme: Theme }) => ({
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  textTransform: 'none',
  minHeight: 'unset',
  // Make height 100% and vertical align text elements of popup menu
  '& .MuiBox-root': {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  [theme.breakpoints.up('lg')]: {
    '&:hover': {
      backgroundColor: theme.palette.backgroundColorForNavLink,
    },
  },
}));

const StyledIcon = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '0.8rem',
  },
}));

export const scrollToSection = (scrollToSectionID: string) => {
  const section = document.getElementById(scrollToSectionID);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

interface MenuItemAsNavLinkProps {
  behavior: NavLinkBehaviorValue;
  to?: string;
  scrollToSectionID?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  analyticsOriginID?: string;
  school_id?: string | number;
  analyticsDestinationLabel?: string;
  bindHoverProps?: Record<string, any>;
  bindFocusProps?: Record<string, any>;
  label?: string;
}

export default function MenuItemAsNavLink(props: MenuItemAsNavLinkProps) {
  // eslint-disable-next-line max-len
  const { behavior, to, scrollToSectionID, icon, sx, analyticsOriginID, school_id, analyticsDestinationLabel, bindHoverProps, bindFocusProps } = props;
  let { label } = props;

  if (label && typeof label === 'string') label = capitalizePhrase(label);

  const newPageLabel = capitalizePhrase((to === '/') ? 'home' : (to || ''));

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
                origin_id: analyticsOriginID,
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
          sx={sx}
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
                origin_id: analyticsOriginID,
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
                origin_id: analyticsOriginID,
              }
            );
          }}
        >
          {icon && <StyledIcon>{icon}</StyledIcon>}
          {label || capitalizePhrase(scrollToSectionID || '')}
        </StyledMenuItem>
      );

    case NavLinkBehavior.hoverMenu:
      return (
        <StyledMenuItem
          sx={sx}
          component={to ? Link : undefined}
          to={to}
          onClick={() => {
            Tracking.sendEventAnalytics(
              Tracking.Events.internalNavigation,
              {
                destination_id: to,
                destination_label: newPageLabel,
                origin_id: analyticsOriginID,
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
