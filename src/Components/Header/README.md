# Header

The `Header` directory contains components that are used to build the header section of the dashboard, including:

[CITIESlogoLinkToHome.jsx](CITIESlogoLinkToHome.jsx) - a clickable logo that serves as a navigational shortcut to the Home page. Wrapped in a `Tooltip` for added user guidance, it also features event tracking for analytics purposes.

[Header.jsx](Header.jsx) - Primary navigation component, integrating a dynamically hidable `AppBar` for efficient space utilization and enhanced user experience. It incorporates responsive design principles, adapting to device orientations for optimal display and interaction.

- Utilizes `useScrollTrigger` for a hide-on-scroll `AppBar`
- Features a mobile-responsive menu activated by a `MenuIcon`, revealing a drawer with `Settings` and `nav links` (though not implemented at the moment due to the simple design of the current home page).
- Incorporates a settings icon, opening a drawer for theme selection through `ThemeSelector`.
- Implements utility functions `showInMobile` and `showInDesktop` to toggle visibility of elements based on the device's screen size.

[MenuItemAsNavLink.jsx](MenuItemAsNavLink.jsx) - Crafts a versatile menu item component capable of executing different navigation behaviors:
- Navigating to a new page
- Scrolling to a specified section within a page
- Performing no action
- etc

[NavLinkBehavior.jsx](NavLinkBehavior.jsx) - Defines an enumeration for specifying the types of navigational actions a link can perform within the application:

- `toNewPage`: Directs the user to a new page within this React application.
- `toExternalPage`: Directs the user to a new page outside of this React application.
- `scrollTo`: Scrolls the page to a specific section identified by an ID.
- `hoverMenu`: Reveals a menu drawer upon component being hovered
- `doNothing`: Disables any action, making the link non-interactive.

[ThemeSelector.jsx](ThemeSelector.jsx) - Allows users to switch between different theme modes. It provides a dropdown menu for theme selection, persisting the choice in local storage and applying the selected theme across the application.

- Users can choose between `light`, `dark`, or `system` preferences. The selection is saved to local storage and used to set the application's theme accordingly.
- Adapts its layout (`FormControl`) to the available width, supporting both grid and default layouts.
- Listens for changes in the system's theme preference (light or dark) and automatically adjusts the application's theme if set to `system`.
- Incorporates analytics tracking for theme changes, helping in understanding user preferences and interactions with the theme selector.

[TemperatureUnitToggle.jsx](TemperatureUnitToggle.jsx) - Quite similar to the `ThemeSelector` but for temperature unit (Celsius or Fahrenheit).