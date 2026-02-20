import { useState, createContext, useContext, useMemo, ReactNode, Dispatch, SetStateAction } from 'react';
import ThemePreferences from '../Themes/ThemePreferences';
import { TemperatureUnits } from '../Utils/AirQuality/TemperatureUtils';
import { LocalStorage } from '../Utils/LocalStorage';
import { AppRoute } from '../Utils/AppRoutes';

// TemperatureUtils.jsx is not yet typed (no `as const`), so TypeScript widens
// its values to `string`. Define the literal union explicitly here until
// TemperatureUtils is converted to TypeScript.
export type TemperatureUnit = 'C' | 'F';

interface PreferenceContextType {
  themePreference: ThemePreferences;
  setThemePreference: Dispatch<SetStateAction<ThemePreferences>>;
  temperatureUnitPreference: TemperatureUnit;
  setTemperatureUnitPreference: Dispatch<SetStateAction<TemperatureUnit>>;
  hiddenPromos: string[];
  setHiddenPromos: Dispatch<SetStateAction<string[]>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  currentPage: AppRoute | null;
  setCurrentPage: Dispatch<SetStateAction<AppRoute | null>>;
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  // Set theme preference state based on localStorage or system preference
  const [themePreference, setThemePreference] = useState<ThemePreferences>(
    (localStorage.getItem(LocalStorage.theme) as ThemePreferences | null)
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemePreferences.dark : ThemePreferences.light)
  );

  // Set temperature unit preference state based on localStorage
  const [temperatureUnitPreference, setTemperatureUnitPreference] = useState<TemperatureUnit>(
    (localStorage.getItem(LocalStorage.temperatureUnit) as TemperatureUnit | null)
    ?? (TemperatureUnits.celsius as TemperatureUnit)
  );

  // Set promo dialog display preference state based on localStorage.
  // It is an array containing unique IDs of promos that have already been shown before.
  // Initialise as an empty array [].
  const [hiddenPromos, setHiddenPromos] = useState<string[]>(() => {
    const storedValue = localStorage.getItem(LocalStorage.hiddenPromos);
    if (storedValue === null) {
      localStorage.setItem(LocalStorage.hiddenPromos, JSON.stringify([]));
      return [];
    }
    return JSON.parse(storedValue) as string[];
  });

  // ------ Language ------
  const [language, setLanguage] = useState<string>('en');

  // ------ Current page ------
  const [currentPage, setCurrentPage] = useState<AppRoute | null>(null);

  const providerValue = useMemo<PreferenceContextType>(() => ({
    themePreference, setThemePreference,
    temperatureUnitPreference, setTemperatureUnitPreference,
    hiddenPromos, setHiddenPromos,
    language, setLanguage,
    currentPage, setCurrentPage,
  }), [themePreference, temperatureUnitPreference, hiddenPromos, language, currentPage]);

  // return context provider
  return (
    <PreferenceContext.Provider value={providerValue}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferences = (): PreferenceContextType => {
  const context = useContext(PreferenceContext);
  if (context === null) {
    throw new Error('usePreferences must be used within PreferenceProvider');
  }
  return context;
};