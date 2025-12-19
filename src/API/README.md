# API

> This directory contains files that deal with RestAPI calls to the backend

### [ApiFetch.jsx](ApiFetch.jsx)
  
Contains `fetchDataFromURL` function that is widely used by many other components in the application to fetch data from external sources. 

**Supported formats:**
- `json`: used for most calls to the backend
- `csv`: used for `raw` endpoint (raw dataset download)

**Supported methods:**
- `GET`: used most often, for fetching data from backend
- `POST`, `EDIT`, `DELETE`: only really used to CRUD [alerts](../../API/src/Components/AirQuality/AirQualityAlerts) and [emails](../../API/src/Components/AirQuality/AirQualityAlerts/EmailsInput.jsx) for the alerts. `POST` is also used for `Login`

-  Also contains `fetchAndProcessCurrentSensorsData` which is a special case of `fetchDataFromURL`. It fetches the current sensors data for a given school and process the raw data provided by the backend to calculate extra information, such as:
    - category
    - color scheme
    - last seen duration
    - health suggestion
  
  It is re-used across different components in the application.

### [APIUtils.tsx](APIUtils.tsx)
This file contains enumerations used in the previous two files and several other components in the application to avoid hardcoding variables.

Additionally, it contains `getApiUrl` function:

- **Input**
  - `paths`: `string[]` — optional array of URL path segments
  - `queryParams`: `Record<string, string | number | boolean | null | undefined>` — optional query parameters

- **Behavior**
  - Filters out `null`, `undefined`, and empty string values from paths and query parameters
  - Joins path segments with `VITE_APP_BACKEND_URL`
  - Serializes query parameters using `URLSearchParams`

- **Output**
  - Returns a fully qualified backend API URL as a `string`