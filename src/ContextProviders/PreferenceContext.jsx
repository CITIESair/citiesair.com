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

  // Set promo dialog display preference state based on localStorage
  // It is an array containing unique IDs of promos that have already been shown before
  // initiate it as an empty array []
  const [hiddenPromos, setHiddenPromos] = useState(
    () => {
      const storedValue = localStorage.getItem(LocalStorage.hiddenPromos);
      if (storedValue === null) {
        localStorage.setItem(LocalStorage.hiddenPromos, JSON.stringify([]));
        return [];
      } else {
        return JSON.parse(storedValue)
      }
    }
  );

  // ------ Language ------
  const [language, setLanguage] = useState("en");
  const [languages, setLanguages] = useState(["en"]);

  // eslint-disable-next-line max-len
  const providerValue = useMemo(() => ({
    themePreference, setThemePreference,
    temperatureUnitPreference, setTemperatureUnitPreference,
    hiddenPromos, setHiddenPromos,
    language, setLanguage,
    languages, setLanguages
  }), [themePreference, temperatureUnitPreference, hiddenPromos, language, languages]);

  // return context provider
  return (
    <PreferenceContext.Provider value={providerValue}>
      {children}
    </PreferenceContext.Provider>
  );
}
