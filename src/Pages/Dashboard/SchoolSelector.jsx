// disable eslint for this file
/* eslint-disable */

import { useState } from "react";
import { Menu, MenuItem, MenuList, FormControl, Select, InputLabel } from "@mui/material";
import { CustomChip } from "../Project/Project";

import PlaceIcon from '@mui/icons-material/Place';

export const SchoolSelector = (props) => {
  const { currentSchoolID, currentSchoolName, allowedSchools, fetchDashboardData } = props;
  if (!Array.isArray(allowedSchools) || allowedSchools.length <= 1)
    return (
      <CustomChip
        icon={<PlaceIcon />}
        label={currentSchoolName}
        tooltipTitle={"School"}
      />
    );

  const [schoolID, setSchoolID] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemSelect = (schoolID) => () => {
    if (currentSchoolID !== schoolID) {
      setSchoolID(schoolID);
      fetchDashboardData(schoolID);
    }
    handleClose();
  };

  return (
    <>
      <CustomChip
        icon={<PlaceIcon />}
        label={currentSchoolName}
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
          {allowedSchools.map((school, index) => (
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

