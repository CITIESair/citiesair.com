// disable eslint for this file
/* eslint-disable */

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Menu, MenuItem, MenuList } from "@mui/material";
import { CustomChip } from "../Pages/Project";

import PlaceIcon from '@mui/icons-material/Place';
import { LocalStorage } from "../Utils/LocalStorage";
import { UniqueRoutes } from "../Utils/RoutesUtils";

import * as Tracking from '../Utils/Tracking';

import { DashboardContext } from "../ContextProviders/DashboardContext";
import { UserContext } from "../ContextProviders/UserContext";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const SchoolSelector = () => {
  const { currentSchoolID, schoolMetadata } = useContext(DashboardContext);
  const { user } = useContext(UserContext);

  // If there is only one school, return a Chip displaying the name of that school
  if (!Array.isArray(user.allowedSchools) || user.allowedSchools.length <= 1)
    return (
      <CustomChip
        icon={<PlaceIcon />}
        label={schoolMetadata?.name || "N/A"}
        tooltipTitle={"School"}
      />
    );

  // Else, display a drop down menu that allows choosing between different schools
  const [schoolID, setSchoolID] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleItemSelect = (schoolID) => () => {
    if (currentSchoolID !== schoolID) {
      localStorage.setItem(LocalStorage.schoolID, schoolID)
      setSchoolID(schoolID);

      Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
        {
          origin_school: currentSchoolID,
          destination_school_id: schoolID,
          origin_id: 'school_selector'
        });

      navigate(`${UniqueRoutes.dashboard}/${schoolID}`)
    }
    handleClose();
  };

  const returnChipLabel = () => {
    return (
      <Box sx={{
        '& svg': {
          fontSize: "1rem", verticalAlign: "sub", marginLeft: "0.25rem"
        }
      }
      }>
        {schoolMetadata?.name || "N/A"}
        {Boolean(anchorEl) ? (
          <ArrowDropUpIcon />
        ) : (
          <ArrowDropDownIcon />
        )}
      </Box>
    );
  };

  return (
    <>
      <CustomChip
        icon={<PlaceIcon />}
        label={returnChipLabel()}
        tooltipTitle={"Click to Select School"}
        clickable
        onClick={handleClick}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList dense>
          {user.allowedSchools.map((school, index) => (
            <MenuItem
              key={index}
              onClick={handleItemSelect(school.school_id)}
            >
              {school.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default SchoolSelector;