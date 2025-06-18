import { Box, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { useTheme } from '@mui/material';
import { isValidArray } from '../../../../../Utils/UtilFunctions';

export const SimplePicker = (props) => {
  const { icon, label, value, options, handleChange, disabled, ...otherProps } = props;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      gap={icon ? 1 : 0}
      alignItems="center"
      {...otherProps}
    >
      <Box
        aria-hidden={true}
        sx={{
          '& .MuiSvgIcon-root': {
            color: disabled ? theme.palette.text.secondary : theme.palette.text.primary,
            verticalAlign: "middle"
          }
        }}
      >
        {icon}
      </Box>

      <FormControl
        fullWidth
        size='small'
        disabled={disabled}
        sx={{ minWidth: "100px", marginLeft: "0 !important" }}
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
    </Stack >
  );
};
