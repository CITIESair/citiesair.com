import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { MenuItem, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LightMode, DarkMode, Contrast } from '@mui/icons-material';

import ThemePreferences from '../../Themes/ThemePreferences';

import * as Tracking from '../../Utils/Tracking';
import { LocalStorage, parseLocalStorageEnum } from '../../Utils/LocalStorage';
import { usePreferences } from '../../ContextProviders/PreferenceContext';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  '& .MuiFormLabel-root, .MuiInputBase-root .MuiTypography-root, svg': {
    fontSize: '0.75rem',
  },
  '& svg': {
    marginRight: '0.25rem',
    verticalAlign: 'middle',
  },
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
    '&:before,:hover,:after': {
      borderBottom: 'none !important',
    },
    '&:hover': {
      background: 'rgba(0,0,0,0.25)',
    },
  },
  '& .MuiSelect-select': {
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
    '&:focus': {
      background: 'none',
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '& .MuiTypography-root, svg': {
    fontSize: '0.75rem',
  },
  '& svg': {
    marginRight: theme.spacing(0.5),
    verticalAlign: 'middle',
  },
}));

interface ThemeSelectorProps {
  isFullWidth?: boolean;
}

export default function ThemeSelector({ isFullWidth }: ThemeSelectorProps) {
  const { setThemePreference } = usePreferences();

  const [themeValue, setThemeValue] = useState<ThemePreferences>(
    parseLocalStorageEnum(
      LocalStorage.theme,
      Object.values(ThemePreferences),
      ThemePreferences.system
    )
  );

  const handleChange = (event: SelectChangeEvent<ThemePreferences>) => {
    Tracking.sendEventAnalytics(Tracking.Events.themeChange, {
      old_theme: themeValue,
      new_theme: event.target.value,
    });
    localStorage.setItem(LocalStorage.theme, event.target.value);
    setThemeValue(event.target.value as ThemePreferences);
  };

  const themeChangeHandler = useCallback(({ matches }: MediaQueryListEvent) => {
    setThemePreference(matches ? ThemePreferences.dark : ThemePreferences.light);
  }, [setThemePreference]);

  useEffect(() => {
    switch (themeValue) {
      case ThemePreferences.dark:
        setThemePreference(ThemePreferences.dark);
        break;

      case ThemePreferences.light:
        setThemePreference(ThemePreferences.light);
        break;

      case ThemePreferences.system: {
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkThemeMq.matches) {
          setThemePreference(ThemePreferences.dark);
        } else {
          setThemePreference(ThemePreferences.light);
        }
        darkThemeMq.addEventListener('change', themeChangeHandler);

        return () => {
          darkThemeMq.removeEventListener('change', themeChangeHandler);
        };
      }

      default:
        break;
    }
    return () => { };
  }, [themeValue, themeChangeHandler, setThemePreference]);

  return (
    <StyledFormControl sx={{ display: isFullWidth ? 'grid' : '' }} variant="filled" size="small">
      <InputLabel id="select-filled-label">THEME</InputLabel>
      <Select
        labelId="select-filled-label"
        id="select-filled"
        value={themeValue}
        onChange={handleChange}
      >
        <StyledMenuItem value={ThemePreferences.system}>
          <Typography color="text.primary">
            <Contrast />
            {ThemePreferences.system}
          </Typography>
        </StyledMenuItem>

        <StyledMenuItem value={ThemePreferences.light}>
          <Typography color="text.primary">
            <LightMode />
            {ThemePreferences.light}
          </Typography>
        </StyledMenuItem>

        <StyledMenuItem value={ThemePreferences.dark}>
          <Typography color="text.primary">
            <DarkMode />
            {ThemePreferences.dark}
          </Typography>
        </StyledMenuItem>
      </Select>
    </StyledFormControl>
  );
}
