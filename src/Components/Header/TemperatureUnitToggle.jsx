import { useContext } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { LocalStorage } from '../../Utils/LocalStorage';
import { TemperatureUnits } from '../../Utils/AirQuality/TemperatureUtils';
import * as Tracking from '../../Utils/Tracking';
import { PreferenceContext } from '../../ContextProviders/PreferenceContext';

export default function TemperatureUnitToggle() {
  const { temperatureUnitPreference, setTemperatureUnitPreference } = useContext(PreferenceContext);

  const handleChange = (event, newUnit) => {
    Tracking.sendEventAnalytics(Tracking.Events.temperatureUnitChange, {
      old_temperature: temperatureUnitPreference,
      new_temperature: event.target.value,
    });
    localStorage.setItem(LocalStorage.temperatureUnit, newUnit);
    setTemperatureUnitPreference(newUnit);
  };

  return (
    <Box>
      <Typography variant="caption" display="block" color="text.secondary">TEMPERATURE UNIT</Typography>
      <ToggleButtonGroup
        value={temperatureUnitPreference}
        exclusive
        onChange={handleChange}
        aria-label="temperature unit toggle"
        size="small"
      >
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.celsius} aria-label={TemperatureUnits.celsius}>
          °{TemperatureUnits.celsius}
        </ToggleButton>
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.fahrenheit} aria-label={TemperatureUnits.fahrenheit}>
          °{TemperatureUnits.fahrenheit}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>

  );
}