# Embeds

This folder contains 2 pages designed to be embedded in external pages in `<iframe>` components:
- [NYUADmap](./Embeds/NYUADmap.jsx): used in [CITIES Dashboard homepage](https://citiesdashboard.com) as a preview for project `Air Quality and Weather`. Because CITIES Dashboard is only for NYUAD community, this essentially displays a map of all sensors on NYUAD campus with real-time measurements.

    ![cities-dashboard-homepage](/documentation/cities-dashboard-homepage.png)

- [NYUADbanner](./Embeds/NYUADbanner.jsx): will be used in Students Portal and Intranet to replace the existing air quality banners there.

    ![air-quality-banner-new](/documentation/air-quality-banner-new.png)

  - Old air quality banner (designed with plain HTML):
  
    ![old-air-quality-banner](/documentation/air-quality-banner-old.png)

Both of these pages can use an optional URLparam `themePreference` to de-couple them from CITIESair's `themePreference`. For example, if CITIES Dashboard uses `Dark` mode, its embedded CITIESair's `NYUADmap` should also have `Dark` mode, even if the user's current preference for CITIESair is `Light`. On top of that, `NYUADbanner` will exclusively be used in `Dark` to meet the font contrast requirement for accessibility from NYUAD Web Team; therefore, its `<iframe>` `src` should always be `https://citiesair.com/nyuadBanner?themePreference=Dark`. This feature is implemented in [App.jsx](/src/App.jsx):
```
  useEffect(() => {
    // Use vanilla JS to get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const optionallyPassedThemePreference = queryParams.get('themePreference');
    if (optionallyPassedThemePreference) {
      const previousTheme = themePreference;
      setThemePreference(optionallyPassedThemePreference);

      return () => {
        setThemePreference(previousTheme);
      };
    }
  }, []);
```