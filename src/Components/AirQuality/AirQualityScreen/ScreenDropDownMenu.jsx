import { useState, useContext } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../../../ContextProviders/DashboardContext";
import { isValidArray } from "../../../Utils/UtilFunctions";
import useSchoolMetadata from "../../../hooks/useSchoolMetadata";

// Use this code block if TV screen should be only for logged in users even for publicly available institutions
// import useLoginHandler from "../../Account/useLoginHandler";

const ScreenDropDownMenu = () => {
  // Use this code block if TV screen should be only for logged in users even for publicly available institutions
  // const ScreenDropDownMenu = ({ onButtonClick }) => {
  const { currentSchoolID } = useContext(DashboardContext);
  const { data: schoolMetadata } = useSchoolMetadata();

  // Use this code block if TV screen should be only for logged in users even for publicly available institutions
  // const { handleRestrictedAccess } = useLoginHandler(onButtonClick);

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  if (!schoolMetadata) return null;

  const screens = schoolMetadata.screens;

  if (!isValidArray(screens)) return null;

  const handleSingleScreenClick = () => {
    const screen_name = screens && screens[0]?.screen_name;
    if (screen_name === "screen") navigate(`/screen/${currentSchoolID}`);
    else navigate(`/screen/${currentSchoolID}/${screen_name}`);

    // Use this code block if TV screen should be only for logged in users even for publicly available institutions
    // handleRestrictedAccess(() => {
    //   const screen_name = screens && screens[0]?.screen_name;
    //   if (screen_name === "screen") navigate(`/screen/${currentSchoolID}`);
    //   else navigate(`/screen/${currentSchoolID}/${screen_name}`);
    // });
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
    navigate(`/screen/${currentSchoolID}/${screenName}`);

    // Use this code block if TV screen should be only for logged in users even for publicly available institutions
    // handleRestrictedAccess(() => {
    //   setAnchorEl(null);
    //   navigate(`/screen/${currentSchoolID}/${screenName}`);
    // });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);

    // Use this code block if TV screen should be only for logged in users even for publicly available institutions
    // handleRestrictedAccess(() => setAnchorEl(event.currentTarget));
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
