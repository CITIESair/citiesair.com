/* eslint-disable */
import { useState, useEffect } from 'react';
import { Stack, Grid, MenuItem, FormControl, Select, Chip, Radio, Checkbox, Typography, Switch } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import VisibilityIcon from '@mui/icons-material/Visibility';

const SELECT_ALL = 'Display All Series';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function SeriesSelector(props) {
  const { items: itemsFromChart, selectorID, allowMultiple, onSeriesSelection } = props;

  const theme = useTheme();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5.55 + ITEM_PADDING_TOP,
        overflow: 'visible !important',
        background: theme.palette.customAlternateBackground
      }
    },
    anchorOrigin: {
      vertical: -6,
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };

  const [items, setItems] = useState(itemsFromChart);
  const [selectAll, setSelectAll] = useState(allowMultiple); // default: all is selected if multiSelect is true

  useEffect(() => {
    setItems(itemsFromChart);
  }, [itemsFromChart]);

  useEffect(() => {
    setSelectAll(items.every(item => item.selected)); // set selectAll if all items are selected
  }, [items]);

  const handleChange = (event) => {
    // Get the array of the currently selected value(s)
    const {
      target: { value }
    } = event;

    // If the current selection has SELECT_ALL
    // Behavior:
    // - If SELECT_ALL is being selected now, then set all items to selected
    // - IF SELECT_ALL is being de-selected now, then set all items but the first one to be unselected 
    // (to make sure there's always at least 1 item being selected)
    if (value.includes(SELECT_ALL)) {
      const updatedItems = items.map((item, index) => ({ ...item, selected: index == 0 ? true : !selectAll }));
      onSeriesSelection(updatedItems);
      setSelectAll(!selectAll);
    }
    // Else, if an ordinary item is selected/de-selected:
    else {
      const selectedItems = items.filter(item => value.includes(item.label));
      const updatedItems = items.map(item => ({
        ...item,
        selected: selectedItems.some(selectedItem => selectedItem.label === item.label)
      }));
      onSeriesSelection(updatedItems);
      setSelectAll(false);
    }
  };

  const handleItemToggle = (item) => {
    const updatedItems = items.map(existingItem =>
      existingItem.label === item.label ? { ...existingItem, selected: !existingItem.selected } : existingItem
    );
    onSeriesSelection(updatedItems);
  };

  const renderedLabel = (selected) => {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <VisibilityIcon fontSize="1.5rem" sx={{ color: theme.palette.text.secondary }} />
        <Typography variant="caption" color="text.secondary">
          { /* show # of series selected if multiSelect. show cur selected serie if singleSelect */}
          {allowMultiple ? `${selected.length} series displayed${selectAll ? ` (all)` : ""}`
            : selected
          }
        </Typography>
      </Stack>
    )
  };

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <FormControl sx={{
        [theme.breakpoints.down('sm')]: { width: '100%' },
        minWidth: '200px',
        '& .MuiInputBase-root': { mt: 1, borderRadius: theme.spacing(1) }
      }} size="small">
        <Select
          labelId={`${selectorID}-label`}
          id={selectorID}
          multiple={allowMultiple}
          value={items.filter(item => item.selected).map(item => item.label)}
          onChange={handleChange}
          MenuProps={MenuProps}
          renderValue={(selected) => renderedLabel(selected)}
          sx={{ fontSize: '0.75em' }}
        >
          {/* Display all available items, together with checkbox for each item to select from */}
          {items.map((item) => (
            <MenuItem
              disabled={
                // If there is only 1 selected item and this is the selected item
                // Then, prevent user from de-select this item too
                // To ensure at least there is 1 selected item at all times
                (items.filter(item => item.selected).length === 1 && item.selected) ? true : false
              }
              key={item.label}
              value={item.label}
              sx={{
                backgroundColor: 'unset !important',
                "&:hover": {
                  backgroundColor: 'inherit !important',
                }
              }}
            >
              { /* checkboxes for MultiSelect, radioButtons for singleSelect*/}
              {allowMultiple ? <Checkbox
                checked={item.selected}
                onClick={() => handleItemToggle(item)}

                sx={{ p: 0.25, transform: 'scale(0.8)' }} />
                : <Radio
                  checked={item.selected}
                  onChange={() => handleChange(item)}

                  sx={{ p: 0.25, transform: 'scale(0.8)' }} />
              }
              <Typography variant='caption'>{item.label}</Typography>
            </MenuItem>
          ))}

          {/* Show the option to select all if multiSelect is true*/}
          {allowMultiple && <MenuItem key={SELECT_ALL} value={SELECT_ALL} sx={{
            borderTop: 'solid 0.5px', borderColor: theme.palette.text.secondary,
            position: 'sticky', bottom: 0, zIndex: 9999, marginBottom: theme.spacing(-1),
            background: theme.palette.customAlternateBackground,
            "&:hover": {
              background: theme.palette.customAlternateBackground
            }
          }}>
            <Stack direction='row' width='100%' alignItems='center' justifyContent='space-between'>
              <Typography fontWeight={500} variant='caption' sx={{ pl: 1 }}>{SELECT_ALL}</Typography>
              <Switch
                checked={selectAll}
                onClick={() => handleItemToggle(SELECT_ALL)}
                sx={{ transform: 'scale(0.8)' }}
              />
            </Stack>
          </MenuItem>
          }
        </Select>
      </FormControl>

      {/* Display only selected items in the Grids, and only in landscape mode and if multiSelect is true*/}
      {allowMultiple && <Grid container spacing={1}
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none'
          },
        }}
      >
        {items.filter(item => item.selected).map((item) => (
          <Grid item key={item.label}>
            <Chip
              label={<Typography variant='caption'>{item.label}</Typography>}
              size="small"
              {...(items.filter(item => item.selected).length !== 1 && { onDelete: () => handleItemToggle(item) })}
            />
          </Grid>
        ))}
      </Grid>}


    </Stack>
  );
}
