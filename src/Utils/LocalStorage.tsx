export const LocalStorage = {
  theme: 'theme',
  temperatureUnit: 'temperatureUnit',
  schoolId: 'schoolId',
  hiddenPromos: 'hiddenPromos',
} as const;

export type LocalStorageKey = typeof LocalStorage[keyof typeof LocalStorage];
