import { useState, useContext } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { isValidArray } from "../../../Utils/UtilFunctions";
import useLoginHandler from "../../Account/useLoginHandler";

const ScreenDropDownMenu = ({ onButtonClick }) => {
  const { currentSchoolID, schoolMetadata } = useContext(DashboardContext);
  const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  if (!schoolMetadata) return null;

  const screens = schoolMetadata.screens;

  if (!isValidArray(screens)) return null;

  const handleSingleScreenClick = () => {
    handleRestrictedAccess(() => navigate(`/screen/${currentSchoolID}`));
  };

  // If there is only 1 screen, show a single button
  if (screens.length <= 1) {
    return (
      <Button
        variant="contained"
        size="small"
        onClick={handleSingleScreenClick}
      >
        <TvIcon sx={{ fontSize: "1rem" }} />&nbsp;TV Screen
      </Button>
    );
  }

  // If there are multiple screens, show a dropdown menu
  const open = Boolean(anchorEl);

  const handleMenuItemClick = (screenName) => {
    handleRestrictedAccess(() => {
      setAnchorEl(null);
      navigate(`/screen/${currentSchoolID}/${screenName}`);
    });
  };

  const handleMenuOpen = (event) => {
    handleRestrictedAccess(() => setAnchorEl(event.currentTarget));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "tv-screen-list-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleMenuOpen}
        variant="contained"
        size="small"
      >
        <TvIcon sx={{ fontSize: "1rem" }} />
        &nbsp;
        TV Screens
      </Button>
      <Menu
        id="tv-screen-list-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {screens.map((screen, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(screen.screen_name)}
            sx={{ fontSize: "0.8rem" }}
          >
            {screen.location_long}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ScreenDropDownMenu;
