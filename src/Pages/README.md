# Pages

The application has three main pages:
- [Home](#home): The landing page of the application, which provides an overview of CITIESair, its reach among educational institutions in Abu Dhabi, its goals, and its contact details.
- [Dashboard](#dashboard): Each project has its own page, which displays the visualizations and data relevant to that project.
- [Project](#project): Each project has its own page, which displays the visualizations and data relevant to that project.
- [404 Page](#404-page): A simple page that is displayed when a user navigates to a page that does not exist.
- [Embeds](#embeds): Each project has its own page, which displays the visualizations and data relevant to that project.

## Home

![homepage-1](/documentation/home-page-1.png)

- [Home.jsx](./Home/Home.jsx): Contains first-impression information on what CITIESair is about:
  - A live view of 3 most important air quality sensors at NYU Abu Dhabi, with the use of the UI component [CurrentAQIGrid](/src/Components/AirQuality/CurrentAQIGrid.jsx)
  - A map of all public outdoor air quality sensors of the network, with [AQImap](/src/Components/AirQuality/AQImap.jsx)

- [About.jsx]('./Home/About.jsx'): Presents an overview of the project, sourcing its content from `section_data.json`. It uses Material-UI's `Stack`, `Typography`, and `Paper` for layout and styling, and our custom utility functions (defined in [src/Utils](../Utils)) for text formatting and HTML to MUI conversion.

- [AtAGlance.jsx](./Home/AtAGlance.jsx): Offers a quick overview of some statistics relevant to the dashboard, using icons and a grid layout for a clear and responsive presentation.

- [GetInTouch.jsx](./Home/GetInTouch.jsx): Facilitates user engagement

## Dashboard

[Dashboard.jsx](Dashboard.jsx) is mostly a logic wrapper for [Project.jsx](Project.jsx). `Dashboard` implements the routing logic for `/dashboard/:school_id` page, while `Project` is the component that displays the content. This seemingly unnecessary setup is explained by legacy code from `CITIES Dashboard` where data visualizations and project information are displayed in `Project` component. Anyway, if it works, don't fix it.

Below are some explanations for the behaviors of `Dashboard`:

### Routing
There are a few differences in the behavior of `/dashboard` route depends on if the user is logged in:
- If logged in:
  - If the user only specifies `/dashboard` without the `/:school_id` part, it will automatically `navigate()` to `/dashboard/:school_id` that the user has the privilege to access. The `/:school_id` part is determined from a saved param in `localStorage` from previous visit, or if that does not work: the first school in that user's `allowedSchool` array fetched from `/me` API call.
  - If the user specifies `/dashboard/:school_id` but they don't have the permission to see that school or if that `school_id` doesn't exist, it will `navigate()` to `/404` and display an error notification:

    ![no-permission-for-school](/documentation/no-permission-for-school.png)

- If **NOT** logged in:
  - If the school is public (only `/dashboard/nyuad` for now), it will display the page nicely
  - If the school is not public (most of the other `/:school_id`), it will `navigate()` to `/login/redirect_url=${locationPath}` for the user to log in and on logged in successfully, automatically `navigate()` them back here if they have the privilege to access this school. If not, it will display the same error message as above and `navigate()` to `/404`.

### Data Fetch
`Dashboard` also takes care of fetching all necessary data for `Project` to render, such as:
- Project metadata
- School metadata
- Current sensor measurements
- Data visualizations (charts)

It saves those data to [DashboardContext.jsx](/src/ContextProviders/DashboardContext.jsx).

To prioritize loading speed, it will only fetch data for the first 2 visualizations specified in the array `ChartAPIendpointsOrder` in [src/API/Utils.jsx](src/API/Utils.jsx). Only when `Load More Charts` button in [Project.jsx](Project.jsx) is clicked will it load the rest of the visualizations specified in that array `ChartAPIendpointsOrder`.

## Project
![dashboard-page-2](/documentation/dashboard-page-2.png)

![dashboard-page-1](/documentation/dashboard-page-1.png)

As alluded to earlier, `Project` visualizes fetched data for each school:

- Project overview, title, `CustomChip` with metadata for each school
- Current sensor measurements
- Charts and subcharts
- Map of `nyuad`
- Explanation of US AQI and  [AirQualityIndexLegendQuickGlance](/src/Components/AirQuality/AirQualityIndexLegendQuickGlance.jsx)
  ![us-aqi-explanation](/documentation/us-aqi-explanation.png)

  ![aqi-at-a-glance](/documentation/aqi-at-a-glance.png)

## 404 Page

The 404 page is a simple page that is displayed when a user navigates to a page that does not exist. It does so via the following `Router` setup in [App.jsx](../App.jsx):

```jsx
// Route for the 404 page
<Route path="/404" element={<FourOhFour title="Page Not Found | CITIES Dashboard" />} />
// Redirects any paths not specified in the Router to the 404 page
<Route path="*" element={<Navigate replace to="/404" />} /> 
```

Upon rendering, it updates the page title and sets the `currentPage` in [MetadataContext.jsx](/src/ContextProviders/MetadataContext.jsx) to '404' to reflect the error state.

## Embeds

See Embeds' [README.md](./Embeds/README.md)