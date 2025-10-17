import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Menu, MenuItem, MenuList } from "@mui/material";
import CustomChip from "./CustomChip";

import PlaceIcon from '@mui/icons-material/Place';
import { LocalStorage } from "../Utils/LocalStorage";
import { AppRoutes } from "../Utils/AppRoutes";

import * as Tracking from '../Utils/Tracking';

import { DashboardContext } from "../ContextProviders/DashboardContext";
import { UserContext } from "../ContextProviders/UserContext";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import useSchoolMetadata from "../hooks/useSchoolMetadata";

const SchoolSelector = () => {
  const { currentSchoolID } = useContext(DashboardContext);
  const { data: schoolMetadata } = useSchoolMetadata();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemSelect = (newSchoolID) => () => {
    if (currentSchoolID !== newSchoolID) {
      localStorage.setItem(LocalStorage.schoolID, newSchoolID)

      Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
        {
          origin_school: currentSchoolID,
          destination_school_id: newSchoolID,
          origin_id: 'school_selector'
        });

      navigate(`${AppRoutes.dashboard}/${newSchoolID}`)
    }
    handleClose();
  };

  if (!schoolMetadata) return;

  // If there is only one school, return a Chip displaying the name of that school
  if (!Array.isArray(user.allowedSchools) || user.allowedSchools.length <= 1)
    return (
      <CustomChip
        icon={<PlaceIcon />}
        label={schoolMetadata.name || "No School Name Given"}
        tooltipTitle={"School"}
      />
    );

  // Else, display a drop down menu that allows choosing between different schools
  return (
    <>
      <CustomChip
        icon={<PlaceIcon />}
        label={returnChipLabel(schoolMetadata.name, open)}
        tooltipTitle={"Click to Select School"}
        clickable
        onClick={handleClick}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
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

const returnChipLabel = (name, open) => {
  return (
    <Box sx={{
      '& svg': {
        fontSize: "1rem", verticalAlign: "sub", marginLeft: "0.25rem"
      }
    }
    }>
      {name || "Loading..."}
      {open ? (
        <ArrowDropUpIcon />
      ) : (
        <ArrowDropDownIcon />
      )}
    </Box>
  );
};

export default SchoolSelector;