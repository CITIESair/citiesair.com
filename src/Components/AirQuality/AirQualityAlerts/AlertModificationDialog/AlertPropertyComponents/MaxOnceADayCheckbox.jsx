import { FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, Typography } from '@mui/material';

export const MaxOnceADayCheckbox = ({ value, handleChange, disabled }) => {

  const returnHelperText = () => {
    if (value === true) {
      return (
        <>
          Send alert <strong>at most once a day</strong> when the threshold is breached
        </>
      );
    } else {
      return (
        <>
          Send alert <strong>every hour</strong> for as long as the threshold is breached
        </>
      );
    }
  };
  return (
    <FormControl
      component="fieldset"
      variant="standard"
      sx={{ mt: { md: -1 } }}
      disabled={disabled}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={handleChange}
              size='small'
            />
          }
          label={<Typography color="text.secondary" fontWeight={500}>Max Once a Day</Typography>}
          color="text.secondary"
        />
      </FormGroup>
      <FormHelperText sx={{ mt: -0.5 }}>{returnHelperText()}</FormHelperText>
    </FormControl>
  );
};
