import { useState, createContext, useContext, useMemo, ReactNode, Dispatch, SetStateAction } from 'react';
import ThemePreferences from '../Themes/ThemePreferences';
import { TemperatureUnits, TemperatureUnit } from '../business-domain/air-quality/temperature.utils';
import { LocalStorage, parseLocalStorageEnum, parseLocalStorageStringArray } from '../Utils/LocalStorage';
import { AppRoute } from '../Utils/AppRoutes';

export type { TemperatureUnit };

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
    parseLocalStorageEnum(
      LocalStorage.theme,
      Object.values(ThemePreferences),
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemePreferences.dark : ThemePreferences.light
    )
  );

  // Set temperature unit preference state based on localStorage
  const [temperatureUnitPreference, setTemperatureUnitPreference] = useState<TemperatureUnit>(
    parseLocalStorageEnum<TemperatureUnit>(
      LocalStorage.temperatureUnit,
      Object.values(TemperatureUnits) as TemperatureUnit[],
      TemperatureUnits.CELSIUS as TemperatureUnit
    )
  );

  // Set promo dialog display preference state based on localStorage.
  // It is an array containing unique IDs of promos that have already been shown before.
  // Initialise as an empty array [].
  const [hiddenPromos, setHiddenPromos] = useState<string[]>(() => {
    const parsed = parseLocalStorageStringArray(LocalStorage.hiddenPromos);
    // Always sync back so the key is initialised (or reset if the stored shape was invalid)
    localStorage.setItem(LocalStorage.hiddenPromos, JSON.stringify(parsed));
    return parsed;
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
  if (!context) {
    throw new Error('usePreferences must be used within PreferenceProvider');
  }
  return context;
};