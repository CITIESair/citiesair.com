import { Box, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { useTheme } from '@emotion/react';
import { isValidArray } from '../../../../Utils/Utils';

export const SimplePicker = (props) => {
  const { icon, label, value, options, handleChange, disabled } = props;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center">
      <Box
        aria-hidden={true}
        sx={{
          '& .MuiSvgIcon-root': {
            color: disabled ? theme.palette.text.secondary : theme.palette.text.primary
          }
        }}
      >
        {icon}
      </Box>

      <FormControl
        fullWidth
        size='small'
        disabled={disabled}
        sx={{ minWidth: "200px" }}
      >
        <InputLabel id={`${label}-picker-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-picker-label`}
          id={`${label}-picker`}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {isValidArray(options) &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Stack>

  );
};
