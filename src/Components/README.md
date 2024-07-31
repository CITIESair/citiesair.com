# Components

The `Components` directory contains reusable components that are used across multiple pages and sections of the dashboard. These components are designed to be modular and flexible, allowing for easy integration and customization.

- [Dataset Download README.md](DatasetDownload/README.md)

- [Header README.md](Header/README.md)

- [SpeedDial README.md](SpeedDial/README.md)

- [ExpandableSection README.md](ExpandableSection/README.md)

Other UI components include:

[CollapsibleSubtitle.jsx](CollapsibleSubtitle.jsx) - Optimizes long text display, such as dataset descriptions, by showing a shortened version with **"See more"** on mobile devices. It expands to reveal the full text upon user interaction and collapses when the element or its associated visualization is tapped away from, or when toggled again.

- Utilizes `useState` for managing text expansion state and `useRef` for targeting the text container and the associated visualization.
- Incorporates click-away logic to maintain expanded state when interacting with related elements, like charts, and collapsing again when tapping away from the text or the associated visualization.
- Adapts to screen size with `useMediaQuery`, activating the collapsible feature only on mobile screens.

[CommentSection.jsx](CommentSection.jsx) - Integrates Hyvor Talk for adding an interactive comment section to each page, allowing users to engage in discussions related to the content. It dynamically loads and displays comments based on the `pageID` passed as a prop, ensuring discussions are relevant to the specific content being viewed.

- Configures Hyvor Talk comments with a `WEBSITE_ID` to identify the specific website within the Hyvor Talk system.
- Uses `styled` from `@mui/material/styles` to customize the appearance of the Hyvor Talk comment widget to match the application's theme.

[CustomLink.jsx](CustomLink.jsx) - Creates a stylized hyperlink component, applying application-wide theme consistency to external links.

- Accepts `href` and `text` props to dynamically generate links, allowing for flexible use across different parts of the application.
- Configures links to open in a new tab (`target="_blank"`) with `rel="noreferrer"` for security.

[Footer.jsx](Footer.jsx) - Provides a uniform footer across the application, featuring the CITIES Dashboard's branding, current year, and social media links.

- Displays the dashboard title and the Center for Interacting Urban Networks (CITIES) mention, updating the year dynamically with `getYear()`.
- Includes social media icons for Twitter, LinkedIn, Facebook, and Instagram, each wrapped in a `CustomLink` component for direct navigation.

[FullWidthBox.jsx](FullWidthBox.jsx) - Creates a styled `Box` that automatically adjusts its padding to respect the device's safe area insets while expanding to the full width of the viewport.

- Notably, it utilizes CSS environment variables `safe-area-inset-left` and `safe-area-inset-right` for dynamic padding adjustment, accommodating notches (`iOS`) and other interface elements on modern devices.

[LoadingAnimation.jsx](LoadingAnimation.jsx) - Presents a loading spinner animation to indicate that content is being fetched or processed.

![loading-spinner](/documentation/loading.png)

[SnackbarNotifications.jsx](SnackbarNotifications.jsx) - Leverages MUI components to present a dismissible Snackbar notification to alert `success` / `error` messages.

![snackbar-notification-alert](/documentation/snackbar-notification.png)

[SpeedDialButton.jsx](SpeedDialButton.jsx) - Implements a dynamic floating action button (FAB) that offers quick navigation options within a page, adapting its functionality based on the availability of charts.

- Uses `PopupState` from `material-ui-popup-state` to manage hover and focus states for displaying a navigation menu.

- On homepage, it simply display a `Scroll to Top` button:
  ![speed-dial-button-home-page](/documentation/speed-dial-button-home-page.png)

- On `/dashboard` page, it dynamically generates menu items based on `chartsTitlesList`, allowing for direct navigation to individual charts:
  ![speed-dial-button-dashboard-page](/documentation/speed-dial-button-dashboard-page.png)

[SchoolSelector.jsx](SchoolSelector.jsx) - 
- If there is only 1 school in `allowedSchools` fetched from `/me` API call, it will only display a `CustomChip` of the name of the ONLY school that this user is permitted to see
- If there are more than 1 school, it will combine `CustomChip` and `Menu` to make a dropdown school selector for the user to choose which school they want to see measurements and charts for
  ![school-selector](/documentation/school-selector.png)

- It also takes care of the logic of saving the newly selected school preference into `localStorage` 

[StyledTabs.jsx](StyledTabs.jsx) - styled component of MUI's `Tabs`, to be re-used in:
- [ChartComponentWrapper](src/Graphs/ChartComponentWrapper.jsx): switch between different subchart for a given chart
  ![styled-tabs-for-subcharts](/documentation/styled-tabs-for-subcharts.png)

- [AlertTabs](src/Components/AirQuality/AirQualityAlerts/AlertsTabs.jsx): switch between `THRESHOLD ALERT` and `DAILY ALERT`
  ![alerts-different-types](/documentation/alerts-different-types.png)

[UppercaseTitle.jsx](UppercaseTitle.jsx) - Renders text titles in uppercase using Material-UI's `Typography` component, styled to emphasize section headers or important titles within the application. It customizes the appearance with a medium weight, inline-block display, and adjusted line height for visual clarity.