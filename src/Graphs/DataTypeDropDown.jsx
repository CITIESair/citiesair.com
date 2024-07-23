import { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { isValidArray } from "../Utils/UtilFunctions";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { returnSelectedDataType } from "../Utils/AirQuality/DataTypes";

const DataTypeDropDownMenu = ({ selectedDataType, dataTypes, fetchChartDataType }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!isValidArray(dataTypes)) return null;

  // If there is only 1 dataType, display it as a string of text
  if (dataTypes.length <= 1) {
    return (
      <Typography display="inline" variant="h6" color="text.primary">
        {dataTypes[0].name_title}
      </Typography>
    )
  }

  // If there are more than 1 dataTypes to choose from, display a popup dropdown menu
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (dataType) => {
    fetchChartDataType(dataType);
    handleClose();
  };

  return (
    <>
      <Button
        id="data-type-drop-down-menu-button"
        aria-controls={open ? 'data-type-drop-down-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="text"
        size="small"
        sx={{
          p: 0,
          minWidth: 'unset',
          borderRadius: 0,
          verticalAlign: 'top',
          textTransform: 'unset'
        }}
      >
        <Typography display="inline" variant="h6" borderBottom="dotted">
          {returnSelectedDataType({ dataTypeKey: selectedDataType, dataTypes: dataTypes, showUnit: true })}
        </Typography>
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="data-type-drop-down-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'data-type-drop-down-menu-button',
        }}
      >

        {dataTypes.map((dataType, index) => (
          <MenuItem
            key={index}
            sx={{ fontSize: '0.8rem' }}
            onClick={() => handleMenuItemClick(dataType.key)}
          >
            {dataType.name_title}
          </MenuItem>
        ))}

      </Menu>
    </>
  );
};

export default DataTypeDropDownMenu;