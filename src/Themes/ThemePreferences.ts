export const ThemePreferences = {
  dark: 'Dark',
  light: 'Light',
  system: 'Same as System',
} as const;

export type ThemePreferences =
  typeof ThemePreferences[keyof typeof ThemePreferences];

export default ThemePreferences;
