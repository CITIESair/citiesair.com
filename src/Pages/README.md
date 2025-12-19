# Pages

### [Home.jsx](./Home/Home.jsx)

![homepage-1](/documentation/home-page.png)

Contains first-impression information on what CITIESair is about:
  - A live view of most important air quality sensors at NYU Abu Dhabi, with the use of the UI component [CurrentAQIGrid](/src/Components/AirQuality/CurrentAQI/CurrentAQIGrid.jsx)
  - A map of all public outdoor air quality sensors of the network, with [AQImap](/src/Components/AirQuality/AirQualityMap/AQImap.jsx)

### [Dashboard.jsx](Dashboard.jsx)
Mostly a logic wrapper for [Project.jsx](Project.jsx). `Dashboard` implements the routing logic for `/dashboard/:school_id` page, while `Project` is the component that displays the content. This seemingly unnecessary setup is explained by legacy code from `CITIES Dashboard` where data visualizations and project information are displayed in `Project` component. Anyway, if it works, don't fix it.

There are a few differences in the behavior of `/dashboard` route depends on if the user is logged in:
- If logged in:
  - If the user only specifies `/dashboard` without the `/:school_id` part, it will automatically `navigate()` to `/dashboard/:school_id` that the user has the privilege to access. The `/:school_id` part is determined from a saved param in `localStorage` from previous visit, or if that does not work: the first school in that user's `allowedSchool` array fetched from `/me` API call.
  - If the user specifies `/dashboard/:school_id` but they don't have the permission to see that school or if that `school_id` doesn't exist, it will `navigate()` to `/404` and display an error notification:

    ![no-permission-for-school](/documentation/no-permission-for-school.png)

- If **NOT** logged in:
  - If the school is public (only `/dashboard/nyuad` for now), it will display the page nicely
  - If the school is not public (most of the other `/:school_id`), it will `navigate()` to `/login/redirect_url=${locationPath}` for the user to log in and on logged in successfully, automatically `navigate()` them back here if they have the privilege to access this school. If not, it will display the same error message as above and `navigate()` to `/404`.

### [Project.jsx](Project.jsx)
![dashboard-page-1](/documentation/dashboard-page-1.png)

As alluded to earlier, `Project` visualizes fetched data for each school:

- Project overview, title, `CustomChip` with metadata for each school
- Current sensor measurements
- Charts and subcharts
- Map (if `schoolMetadata.has_map === true`)
- Explanation of US AQI and  [AirQualityIndexLegendQuickGlance](/src/Components/AirQuality/AirQualityIndexLegendQuickGlance.jsx)
  ![us-aqi-explanation](/documentation/us-aqi-explanation.png)

  ![aqi-at-a-glance](/documentation/aqi-at-a-glance.png)

**Lazy loading charts**
To prioritize loading speed, it will only display the first 2 visualizations specified in the array `ChartAPIEndpointsOrder` in [src/API/APIUtils.tsx](src/API/APIUtils.tsx). Only when `Load More Charts` button in is clicked will it load the rest of the visualizations specified in that array `ChartAPIEndpointsOrder`.

### [404.jsx](404.jsx)

The 404 page is a simple page that is displayed when a user navigates to a page that does not exist. It does so via the following `Router` setup in [App.jsx](../App.jsx):

```jsx
// Route for the 404 page
<Route path="/404" element={<FourOhFour title="Page Not Found | CITIES Dashboard" />} />
// Redirects any paths not specified in the Router to the 404 page
<Route path="*" element={<Navigate replace to="/404" />} /> 
```

Upon rendering, it updates the page title and sets the `currentPage` in [MetadataContext.jsx](/src/ContextProviders/MetadataContext.jsx) to '404' to reflect the error state.

## Embeds

This folder contains 2 pages designed to be embedded in external pages in `<iframe>` components:

### [NYUADmap](./Embeds/NYUADmap.jsx)
Used in [CITIES Dashboard homepage](https://citiesdashboard.com) as a preview for project `Air Quality and Weather`. Because CITIES Dashboard is only for NYUAD community, this essentially displays a map of all sensors on NYUAD campus with real-time measurements.

    ![cities-dashboard-homepage](/documentation/cities-dashboard-homepage.png)

### [NYUADbanner](./Embeds/NYUADbanner.jsx)
Used in Students Portal and Intranet.

![air-quality-banner-new](/documentation/air-quality-banner.png)

### Notes
Both of these pages can use an optional URLparam `themePreference` to de-couple them from CITIESair's `themePreference`. For example, if CITIES Dashboard uses `Dark` mode, its embedded CITIESair's `NYUADmap` should also have `Dark` mode, even if the user's current preference for CITIESair is `Light`. This feature is implemented in [App.jsx](/src/App.jsx):
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