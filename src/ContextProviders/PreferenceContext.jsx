// disable eslint for this file
/* eslint-disable */

import { useState, createContext, useMemo } from 'react';
import ThemePreferences from '../Themes/ThemePreferences';
import { TemperatureUnits } from '../Utils/AirQuality/TemperatureUtils';
import { LocalStorage } from '../Utils/LocalStorage';

export const PreferenceContext = createContext();

export function PreferenceProvider({ children }) {
  // Set theme preference state based on localStorage or system preference
  const [themePreference, setThemePreference] = useState(
    localStorage.getItem(LocalStorage.theme)
    || (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemePreferences.dark : ThemePreferences.light)
  );

  // Set temperature unit preference state based on localStorage
  const [temperatureUnitPreference, setTemperatureUnitPreference] = useState(
    localStorage.getItem(LocalStorage.temperatureUnit)
    || TemperatureUnits.celsius
  );

  console.log(temperatureUnitPreference)

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => ({
    themePreference, setThemePreference, temperatureUnitPreference, setTemperatureUnitPreference
  }), [themePreference, temperatureUnitPreference]);

  // return context provider
  return (
    <PreferenceContext.Provider value={providerValue}>
      {children}
    </PreferenceContext.Provider>
  );
}
