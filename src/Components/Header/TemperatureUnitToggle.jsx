import { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { TemperatureUnits } from '../../Pages/Screen/TemperatureUtils';
import { LocalStorage } from '../../Utils/LocalStorage';

export default function TemperatureUnitToggle({ passedTemperatureUnit, passedSetTemperatureUnitPreference }) {
  const [temperatureUnit, setTemperatureUnit] = useState(passedTemperatureUnit);

  const handleChange = (event, newUnit) => {
    localStorage.setItem(LocalStorage.temperatureUnit, newUnit);
    setTemperatureUnit(newUnit);
    passedSetTemperatureUnitPreference(newUnit);
  };

  return (
    <Box>
      <Typography variant="caption" display="block" color="text.secondary">TEMPERATURE UNIT</Typography>
      <ToggleButtonGroup
        value={temperatureUnit}
        exclusive
        onChange={handleChange}
        aria-label="temperature unit toggle"
        size="small"
      >
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.celsius} aria-label={TemperatureUnits.celsius}>
          °{TemperatureUnits.celsius}
        </ToggleButton>
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.fahrenheit} aria-label={TemperatureUnits.celsius}>
          °{TemperatureUnits.fahrenheit}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>

  );
}