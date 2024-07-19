# ApiFunctions

### Overview

This directory contains files that deal with RestAPI calls to the backend (api.citiesair.com)

### Files

- **ApiCalls.jsx**
  
	- Contains `fetchDataFromURL` function that is widely used by many other components in the application to fetch data from external sources.

  - Supported formats:
    - `json`: used for most calls to the backend
    - `csv`: used for `raw` endpoint (raw dataset download)

  - Supports all common RestAPI methods:
    - `GET`: used most often, for fetching data from backend
    - `POST`
    - `EDIT`
    - `DELETE`

      The later 3 methods are only really used to CRUD [alerts](src/Components/AirQuality/AirQualityAlerts) and [emails](src/Components/AirQuality/AirQualityAlerts/EmailsInput.jsx) for the alerts.

      `POST` is also used for Login

  -  Also contains `fetchAndProcessCurrentSensorsData` which is a special case of `fetchDataFromURL`. It fetches the current sensors data for a given school and process the raw data provided by the backend to calculate extra information, such as:
      - category
      - color scheme
      - last seen duration
      - health suggestion
    
      It is re-used across different components in the application.

- **ApiUrls.jsx**

  This file contains enumerations and functions to return the correct `url` for all API calls to the backend, such as getting chart data, TV screen data, and so on.