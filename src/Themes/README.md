# Theme Configurations

> This folder contains theme configurations for our application, focusing on providing a consistent and customizable user interface. 

### [CustomThemes.jsx](./CustomThemes.jsx)
This file defines custom themes for the application. It configures theme settings such as colors, typography, and other UI elements that can be applied across the application to maintain a consistent look and feel, for both `light` and `dark` mode. These themes are then made available to the application through Material-UI's `ThemeProvider` in [App.js](/src/App.jsx), which applies the selected theme to all components within its context. 

### [ThemePreferences.jsx](./ThemePreferences.jsx)
Contains an enumeration of the allowed themes for this application: `LIGHT`, `DARK`, and `SYSTEM` (based on the current device's preference)
