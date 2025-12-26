**December 2025**

# CITIESair

- [1. Introduction](#1-introduction)
- [2. General Technical Description](#2-general-technical-description)
- [3. Main Files and Directories](#3-main-files-and-directories)
- [4. Development Guide](#4-development-guide)
  - [4.1. Prerequisites](#41-prerequisites)
  - [4.2. Install Dependencies and Run the Application](#42-install-dependencies-and-run-the-application)
  - [4.3 Production Deployment](#43-production-deployment)

**[IMPORTANT] Read Section 4 before running this repo for the first time.**

*More information on the backend can be found in this repo: [CITIESair-node-server](https://github.com/CITIESair/citiesair-node-server). This documentation mostly concerns the frontend application.*

# 1. Introduction

CITIESair is a network of heterogeneous air quality sensors for institutions in the UAE. It consists of 3 layers:
- Infrastructure: physical sensors
- Digital: this CITIESair frontend dashboard and [backend system](https://github.com/CITIESair/citiesair-node-server)
- Social: partnerships with institutions and surrounding community

This documentation will only concern the CITIESair frontend dashboard.

![homepage-1](/documentation/home-page.png)
*Home page: at a glance statistics and map of all public outdoor sensors in the network*

![dashboard-page](/documentation/dashboard-page-1.png)
*Dashboard page: showing for each institution current air quality measurements and visualizations*

![dataset-download-dialog](/documentation/dataset-download-dialog.png)
*Raw dataset download dialog on the Dashboard page*

![alert-dialog](/documentation/alert-dialog.png)
*Alert dialog on the Dashboard page*

![screen-page](/documentation/screen-page.png)
*Dedicated TV Screen page, for displaying at locations such as the Campus Center and Dining Hall at NYU Abu Dhabi*


# 2. General Technical Description

![architecture-overview-of-cities-air](/documentation/architecture-overview.svg)  
[Draw.io File](https://app.diagrams.net/#G14UseXBSi7wS0fH_Pmvbw34cnagGL8UO3#%7B%22pageId%22%3A%22wu-TUgwEtevewkSv1OIf%22%7D)

CITIESair frontend is built with [React.js](https://react.dev/) and [Material UI](https://mui.com/material-ui/all-components/). It utilizes (mostly) [Google Charts](https://developers.google.com/chart/interactive/docs/gallery) and (sometimes) [Nivo Charts](https://nivo.rocks/) for generating interactive data visualizations for air quality datasets.

CITIESair frontend communicates with CITIESair backend server via RestAPI for:
- GET: getting current and historical air quality data, getting current user data, getting school metadata, getting email subscribers, getting alerts...
- POST/EDIT/DELETE: CRUD operations for alerts and email subscribers
The full list of API endpoints is documented in [API Documentation]()

CITIESair frontend is hosted on GitHub Pages. [Section 2.4](#24-deployment-process) explains how the deployment process works.

There are quite a lot of overlapping components between CITIESair and CITIES Dashboard (as Air Quality used to be a dataset within the much bigger CITIES Dashboard). The CITIES Dashboard repo with documentation can be found [here](https://github.com/CITIES-Dashboard/cities-dashboard.github.io).

## 3. Main Directories

- **[App.jsx](src/App.jsx)**: serves as the root component for CITESair frontend web app, orchestrating the overall layout, routing, and theme management. It utilizes `BrowserRouter` from `react-router-dom` to map URLs to specific pages such as `Home` and `Dashboard`. A `404` page is also set up to handle unmatched routes. These routes are defined within the `Routes` component, which renders the appropriate page based on the current URL path.

- **[API](src/API)**: contains metadata for API calls to backend and wrapper functions for API calls

- **[Components](src/Components)**: contains reusable components that are used across multiple pages and sections of CITIESair. These components enable functionalities like raw dataset downloading in CSV format, showing comment section, providing navigational aids like Speed Dial Buttons, etc.

- **[ContextProviders](src/ContextProviders)**: contains providers to share state across components, particularly for:
  - managing navigation and dynamically updating the UI based on the current page or section
  - managing metadata of charts
  - loading Google library
  - and more...

- **[Graphs](src/Graphs)**: contains the specific components responsible for rendering data visualizations using Google Charts and Nivo Charts.

- **[hooks](src/hooks)**: contains all custom React Query hooks used for fetching real-time air quality data, alerts, and metadata from the backend. These hooks use React Query’s caching system (persistent caching in production, no caching in development) and support automatic refetching based on `staleTime`.

- **[Pages](src/Pages)**: contains the main pages of the dashboard, including:
  - `Home`
  - `Dashboard` and `Project`: for each school in the network
  - `Screens`: for glanceable TV air quality screens
  - `Embeds`: for embedding in other external apges
  - `404`: for undefined routes in the application

- **[Themes](src/Themes)**: contains the custom themes and color schemes used by the dashboard.

- **[Utils](src/Utils)**: contains utility functions and helper methods used throughout the application. These utilities include an HTML-to-MUI parser, Google Analytics Tracker, etc.

# 4. Development Guide
> **REMARK:** 
The React application is wrapped in `<StrictMode>`, read more [here](https://react.dev/reference/react/StrictMode), which will **re-render components an extra time and run `useEffect()` twice.** 
> Consequently, this makes most API calls to the backend duplicated if they are called in `useEffect()`. This only happens in development mode (`npm run dev`) and not on the build (`npm run build`). 
> In some circumstances, such as `Login`, this might create some weird bugs on the backend (for example, two user sessions). Therefore, for the most accurate testing that reflects the real deployment production, build the application first before testing it.

## 4.1. Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Python](https://www.python.org/)

## 4.2. Install Dependencies and Run the Application

1. Clone the repository

2. Create two `.env` at the root:
    ```
    .env

    VITE_APP_ENV=development
    VITE_APP_BACKEND_URL=[SERVER DOMAIN]
    # VITE_APP_ENV=production
    # VITE_APP_BACKEND_URL=http://localhost:3001
    ```

    ```
    .env.production

    VITE_APP_ENV=production
    VITE_APP_BACKEND_URL=[SERVER DOMAIN]
    ```
    
    Vite will automatically uses the `.env.production` when building and deploying to Github Page.

3. Install the dependencies:

    ```
    npm install
    ```

## 4.3. Run the Development App
**CITIESair frontend can be run in several configurations, depending on the environment variables:**

To switch configurations, comment/uncomment and choose the desired values in the `.env` file, then run `npm run dev` to apply the new environment settings.

| # | Frontend (`VITE_APP_ENV`) | Backend (`VITE_APP_BACKEND_URL`) | Comment |
|---|---------------------------|----------------------------------|---------|
| 1 | development | [SERVER DOMAIN] | **[DEFAULT]** Best used to avoid caching in frontend while using most up-to-date data from prod backend |
| 2 | development | localhost:3001 | Best used when developing both frontend and backend at the same time |
| 3 | production | localhost:3001 | Not sure when it'll ever be useful |
| 4 | production | [SERVER DOMAIN] | **[ACTUAL PROD]** Best used to verify everything works as intended before deploying to PROD (exact setup used for PROD) |

¹ `development` → no query caching  
² `production` → uses query caching

**If you want to run a stable build, run the below instead:**

  ```
  npm run build && serve -s dist
  ```

The stable build has the following characteristics:
- More optimized and faster compared to the dev application
- Google login works correctly (doesn't throw error when there is no error after a successful login)
- But 404 page doesn't work

## 4.3. Production Deployment
CITIESair front-end application is deployed on GitHub in this repo. The domain (citiesair.com) is managed in [name.com](https://www.name.com/). 

To deploy changes to the production website, double check for bugs and run `npm run deploy` in development environment.