import { MouseEvent } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { LocalStorage } from '../../Utils/LocalStorage';
import { TemperatureUnits } from '../../business-domain/air-quality/temperature.utils';
import * as Tracking from '../../Utils/Tracking';
import { TemperatureUnit, usePreferences } from '../../ContextProviders/PreferenceContext';

export default function TemperatureUnitToggle() {
  const { temperatureUnitPreference, setTemperatureUnitPreference } = usePreferences();

  const handleChange = (_event: MouseEvent<HTMLElement>, newUnit: TemperatureUnit | null) => {
    // newUnit is null when the already-selected button is clicked — ignore that
    if (newUnit === null) return;

    Tracking.sendEventAnalytics(Tracking.Events.temperatureUnitChange, {
      old_temperature: temperatureUnitPreference,
      new_temperature: newUnit,
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
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.CELSIUS} aria-label={TemperatureUnits.CELSIUS}>
          {TemperatureUnits.CELSIUS}
        </ToggleButton>
        <ToggleButton sx={{ px: "0.75rem" }} value={TemperatureUnits.FAHRENHEIT} aria-label={TemperatureUnits.FAHRENHEIT}>
          {TemperatureUnits.FAHRENHEIT}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
