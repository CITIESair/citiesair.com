// disable eslint for this file
/* eslint-disable */
import { Button, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import TvIcon from '@mui/icons-material/Tv';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindHover, bindFocus, bindMenu } from 'material-ui-popup-state';
import MenuItemAsNavLink from "./Header/MenuItemAsNavLink";
import NavLinkBehavior from "./Header/NavLinkBehavior";

const ScreenDialog = ({ schoolID, screens }) => {
  if (!Array.isArray(screens)) return null;

  if (screens.length <= 1) return <LinkButtonToScreen url={`/screen/${schoolID}`} />
  else return <DialogToScreen schoolID={schoolID} screens={screens} />
};

const DialogToScreen = ({ schoolID, screens }) => {
  return (
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
                  to={`/screen/${schoolID}/${screen.screen_name}`}
                  label={screen.location_long}
                  sx={{ fontSize: '0.8rem' }}
                />
              ))}
          </HoverMenu>
        </>
      )}
    </PopupState>
  )
}

const LinkButtonToScreen = ({ url }) => {
  return (
    <Button
      variant="contained"
      component={Link}
      to={url}
    >
      <TvIcon sx={{ fontSize: '1rem' }} />&nbsp;TV Screen
    </Button>
  )
}

export default ScreenDialog;