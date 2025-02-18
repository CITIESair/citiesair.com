# Context Providers: Facilitating State Management and Sharing

### App-wide contexts

These are contexts used widely throughout different components in the application. As its nature suggests, these context's providers are found in the root file [index.jsx](/src/index.jsx). In alphabetical order:

[GoogleContext](./GoogleContext.jsx): Manages the loading of the Google Charts library, providing access to Google Charts functionalities throughout the application. It ensures the library is only loaded **once** and is accessible in any component that requires it.

- [MetadataContext](./MetadataContext.jsx): Facilitates the fetching (only once) and sharing of metadata of the whole application, including:
  - Statistics for [At a Glance](/src/Pages/Home/AtAGlance.jsx) section in the `/` page
  - Comment counts from the Hyvor Talk API for the [Comment Section](/src/Components/CommentSection.jsx) (only in `/dashboard/nyuad` page)
  - The current page (`/`, `/login`, or `/dashboard`)
  - A list of all the charts' title in the `dashboard` page

[PreferenceContext](./PreferenceContext.jsx): Sets user preferences based on `localStorage` or user selected values and ensures that user preferences are stored and shared across the application:

  - `themePreference`
  - `temperatureUnitPreference`
  - `hiddenPromos`

[UserContext](./UserContext.jsx): Manages authentication state of CITIESair, used in tandem with [Account](/src/Components/Account/) UI components, contains these keys props:

  - `username`: keep track of the user name of the logged in account to display on the [Header](/src//Components/Header/)
  ![header-user-name](/documentation/logout.png)
  - `authenticated` and `checkedAuthentication`: check if the current session is authenticated or not
  - `allowedSchools`: an array containing the schools that the currently logged in user has the privilege of accessing, used for [SchoolSelector](/src/Components/SchoolSelector.jsx) component

    ![school-selector](/documentation/school-selector.png)

### Component-specific contexts

These are contexts used only by a specific component in the application:

- [AirQualityAlertContext](./AirQualityAlertContext.jsx): Manages the states of alerts , including:

  - `alerts`: an array of all alerts belonging to the selected school
  - `editingAlert`: the alert being edited (CRUD) at the moment
  - `selectedAlert`: a server-ground-truth copy of the currently selected alert for CRUD operations. `selectedAlert` can be compared with `editingAlert` in [AlertModificationDialog](/src/Components/AirQuality/AirQualityAlerts/AlertModificationDialog/AlertModificationDialog.jsx) to see if the user has made ANY edit to it.

[DashboardContext](./DashboardContext.jsx): Provides a centralized store for managing and sharing data relevant to displaying the dashboard:

  - Currently selected school and its metadata
  - Latest sensor measurements of the currently selected school
  - Whether or not to load more charts in the `/dashboard` page beyond the first two charts (`historical` and `dailyAverageAllTime`)
  - Data for all charts in `/dashboard` and a method to update data for **INDIVIDUAL** chart (as the user might interact with only one chart and change its data type, for example, `PM2.5` to `PM10`)

### Chart-specific contexts

These are contexts that are specifically only used by charts in `/dashboard` page:

  - [AxesPickerContext](./AxesPickerContext.jsx):
    - Used by component: [AxesPicker](/src/Components/AxesPicker/AxesPicker.jsx)
    - In chart: `correlationDailyAverage`
    
  - [DateRangePickerContext](./DateRangePickerContext.jsx):
    - Used by component: [CustomDateRangePicker](/src/Components/DateRangePicker/CustomDateRangePicker.jsx)
    - In chart: `historical`

