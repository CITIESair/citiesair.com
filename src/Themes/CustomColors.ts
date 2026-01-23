import { colors } from "@mui/material";
import ThemePreferences from "./ThemePreferences";

export const darkShade = 400 as const;
export const lightShade = 600 as const;
export const darkShadeColorAxis = 300 as const;

// MUI-style color palette for maroon
export const maroon = {
  50: '#f0e0e5',
  100: '#d8b3bd',
  200: '#bf8091',
  300: '#a54d65',
  400: '#912644',
  500: '#7e0023',
  600: '#76001f',
  700: '#6b001a',
  800: '#610015',
  900: '#4e000c',
  A100: '#ff8189',
  A200: '#ff4e5a',
  A400: '#ff1b2a',
  A700: '#ff0212'
} as const;

export type MaroonShade = keyof typeof maroon;

export const INACTIVE_SENSOR_COLORS = {
  [ThemePreferences.light]: colors.grey[600],
  [ThemePreferences.dark]: colors.grey[300],
  screen: colors.grey.A400
} as const;

export type InactiveSensorColorKey = keyof typeof INACTIVE_SENSOR_COLORS;
