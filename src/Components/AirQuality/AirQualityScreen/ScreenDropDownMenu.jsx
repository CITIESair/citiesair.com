// disable eslint for this file
/* eslint-disable */
import { useState, useContext } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Link } from 'react-router-dom';
import TvIcon from '@mui/icons-material/Tv';
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { isValidArray } from "../../../Utils/UtilFunctions";

const ScreenDropDownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { currentSchoolID, schoolMetadata } = useContext(DashboardContext);

  if (!schoolMetadata) return;
  const screens = schoolMetadata.screens;

  if (!isValidArray(screens)) return null;

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
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'tv-screen-list-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
      >
        <TvIcon sx={{ fontSize: '1rem' }} />
        &nbsp;
        TV Screens
      </Button>
      <Menu
        id="tv-screen-list-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          screens.map((screen, index) => (
            <MenuItem
              key={index}
              component={Link}
              to={`/screen/${currentSchoolID}/${screen.screen_name}`}
              onClick={handleClose}
              sx={{ fontSize: '0.8rem' }}
            >
              {screen.location_long}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default ScreenDropDownMenu;