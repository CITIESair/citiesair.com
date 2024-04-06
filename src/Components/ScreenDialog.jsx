// disable eslint for this file
/* eslint-disable */
import { useContext } from "react";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import TvIcon from '@mui/icons-material/Tv';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindFocus, bindMenu } from 'material-ui-popup-state';
import MenuItemAsNavLink from "./Header/MenuItemAsNavLink";
import NavLinkBehavior from "./Header/NavLinkBehavior";
import { DashboardContext } from "../ContextProviders/DashboardContext";

const ScreenDialog = () => {
  const { currentSchoolID, schoolMetadata } = useContext(DashboardContext);

  if (!schoolMetadata) return;
  const screens = schoolMetadata.screens;

  if (!Array.isArray(screens)) return null;

  // If there is only 1 screen, display a button linked to that screen
  if (screens.length <= 1) {
    return (
      <Button
        variant="contained"
        component={Link}
        to={`/screen/${currentSchoolID}`}
      >
        <TvIcon sx={{ fontSize: '1rem' }} />&nbsp;TV Screen
      </Button>
    )
  }
  // If there are more than 1 screens to choose from, display a popup dropdown menu
  else return (
    <PopupState variant="popover" popupId="tv-screens-list">
      {(popupState) => (
        <>
          <Button
            variant="contained"
            {...bindHover(popupState)}
            {...bindFocus(popupState)}
          >
            <TvIcon sx={{ fontSize: '1rem' }} />&nbsp;TV Screens List
          </Button>
          <HoverMenu
            {...bindMenu(popupState)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClick={popupState.close}
          >
            {
              screens.map((screen, index) => (
                <MenuItemAsNavLink
                  key={index}
                  behavior={NavLinkBehavior.toNewPage}
                  to={`/screen/${currentSchoolID}/${screen.screen_name}`}
                  label={screen.location_long}
                  sx={{ fontSize: '0.8rem' }}
                />
              ))}
          </HoverMenu>
        </>
      )}
    </PopupState>
  )
};

export default ScreenDialog;