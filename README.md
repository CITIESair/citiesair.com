**Last Update:** July 2024

# CITIESair

- [1. Introduction](#1-introduction)
- [2. General Technical Description](#2-general-technical-description)
- [3. Main Files and Directories](#3-main-files-and-directories)
- [4. Development Guide](#4-development-guide)
  - [4.1. Prerequisites](#41-prerequisites)
  - [4.2. Install Dependencies and Run the Application](#42-install-dependencies-and-run-the-application)
  - [4.3 Production Deployment](#43-production-deployment)

**[IMPORTANT] Read Section 4 before running this repo for the first time.**

*More information on the backend can be found in this repo: [CITIESair-server](https://github.com/CITIESair/citiesair-server). This documentation mostly concerns the frontend application.*

# 1. Introduction

CITIESair is a network of heterogeneous air quality sensors across educational institutions in Abu Dhabi, UAE. It consists of 3 layers:
- Infrastructure: physical sensors
- Digital: this CITIESair frontend dashboard and [backend system](https://github.com/CITIESair/citiesair-server)
- Social: partnerships with the educational institutions and surrounding community

This documentation will only concern the CITIESair frontend dashboard.

![homepage-1](/documentation/home-page-1.png)
![homepage-2](/documentation/home-page-2.png)
*The Home page of CITIESair where selected 3 sensors at NYUAD are displayed, together with a map of all public outdoor sensors in the network*

![dashboard-page](/documentation/dashboard-page-1.png)
*The dashboard page showing the current air quality measurements and visualizations for each school*

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

CITIESair frontend communicates with the backend server via RestAPI (api.citiesair.com) for:
- GET: getting current and historical air quality data, getting current user data, getting school metadata, getting email subscribers, getting alerts...
- POST/EDIT/DELETE: CRUD operations for alerts and email subscribers
The full list of API endpoints is documented in [API Documentation](https://docs.google.com/spreadsheets/d/1srj12RDZAM3ibuGwIS6D2_KYA-0ri6S-4nSAxbZKc1k/)

CITIESair frontend is hosted on GitHub Pages. [Section 2.4](#24-deployment-process) explains how the deployment process works.

There are quite a lot of overlapping components between CITIESair and CITIES Dashboard (as Air Quality used to be a dataset within the much bigger CITIES Dashboard). The CITIES Dashboard repo with documentation can be found [here](https://github.com/CITIES-Dashboard/cities-dashboard.github.io).

## 3. Main Files and Directories

- `App.jsx` serves as the root component for CITESair frontend web app, orchestrating the overall layout, routing, and theme management. It leverages React's ecosystem, including hooks and context, alongside Material-UI for styling and theming. Here's a breakdown of its functionality:

  - **React Router Setup**: Utilizes `BrowserRouter` from `react-router-dom` to map URLs to specific pages such as `Home` and `Dashboard`. A `404` page is also set up to handle unmatched routes. These routes are defined within the `Routes` component, which renders the appropriate page based on the current URL path.

  - **Lazy Loading of Pages**: Uses React's `lazy` and `Suspense` utilities to lazy-load `Home` and `Dashboard` pages, improving load times by splitting the code at designated points and only loading the components when needed.

  - **Theme Management**:
    - Uses [PreferenceContext](src/ContextProviders/PreferenceContext.jsx) to get user theme preference, determining whether the app uses a dark or light theme based on user preference or system settings.
    - `useMemo` is applied to generate a theme object using `createTheme` and `getDesignTokens`, which adapts the theme based on the current `themePreference`.
    - Custom themes are defined in [`Themes/CustomThemes.jsx`](src/Themes/CustomThemes.jsx), allowing for a tailored look and feel that aligns with the CITIES Dashboard's aesthetic requirements.

  - **Global Style Adjustments**: Programmatically sets the background color of the `body` element to match the theme, enhancing the visual coherence of the application on devices with landscape orientation.

  - **Context Providers**: Utilizes the `MetadataContext` to share state across components, particularly for managing navigation and dynamically updating the UI based on the current page or section. Documentation on the `MetadataContext` can be found [here](src/ContextProviders/README.md).

  - **Main Application Structure**:
    - Encapsulates the application's main layout within a `Box` component, setting up a flex container that stretches to the viewport's height. This layout includes the `Header`, followed by the main content area (from the specific page based on the current `Route`), with the `Footer` occupying the bottom of the viewport.

  - **Header and Footer**:
    - The `Header` and `Footer` are rendered using `useMemo` to optimize performance, ensuring that they are only recalculated if specific dependencies change.
    - These components provide consistent navigation and information architecture across the dashboard, contributing to a cohesive user experience.

- `Components` directory contains reusable components that are used across multiple pages and sections of CITIESair. These components enable functionalities like raw dataset downloading in CSV format, showing comment section, providing navigational aids like Speed Dial Buttons, etc. *For detailed documentation of all components, click [here](src/Components/README.md)*.
- `Pages` directory contains the main pages of the dashboard, including:
  - `Home`
  - `Dashboard` and `Project`: for each school in the network
  - `Screen`: for glanceable TV air quality screens
  - `NYUADbanner` and `NYUADmap`: for embedding in other external apges
  - `404`: for undefined routes in the application

The `Routes` defined in [`App.jsx`](src/App.jsx) correspond to these pages. *For detailed documentation of all pages, click [here](src/Pages/README.md)*.

- `Graphs` directory contains the components responsible for rendering data visualizations using Google Charts and Nivo Charts. *For detailed documentation of all graph components, click [here](src/Graphs/README.md)*.
- `ContextProviders` directory contains the context providers used to manage global state and share data across components. *For detailed documentation of all context providers, click [here](src/ContextProviders/README.md)*.
- `Themes` directory contains the custom themes and color schemes used by the dashboard. *For detailed documentation of all themes, click [here](src/Themes/README.md)*.
- `Utils` directory contains utility functions and helper methods used throughout the application. These utilities include an HTML-to-MUI parser, Google Analytics Tracker, etc. *For detailed documentation of all utility functions, click [here](src/Utils/README.md)*.

# 4. Development Guide

**IMPORTANT:** The React application is wrapped in `<StrictMode>`, read more [here](https://react.dev/reference/react/StrictMode), which will re-render components an extra time and run `useEffect()` twice. Consequently, this makes most API calls to the backend duplicated if they are called in `useEffect()`. This only happens in development mode (`npm run start`) and not on the build (`npm run build`). In some circumstances, such as Login, this might create some weird bugs on the backend (for example, two user sessions). Therefore, for the most accurate testing that reflects the real deployment production, build the application first before testing it.

## 4.1. Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Python](https://www.python.org/)

## 4.2. Install Dependencies and Run the Application

1. Clone the repository from GitHub.

2. Run the following command to install the dependencies:

    ```
    npm install
    ```

3. Development frontend 
  - If you want this frontend application to make API request to the production backend API (api.citiesair.com)

    ```
    npm run start
    ```

  - Or, if you want this frontend application to make API request to the locally hosted backend API (localhost://3001). This command set `REACT_APP_ENV=local-backend` so that the app can bypass authorization.

    ```
    npm run start-local-backend
    ```

4. If you want to run a stable build (more optimized and faster compared to the dev application in Step 3, but 404 page doesn't work in this case), run the below instead:

    ```
    npm run build && serve -s build
    ```
    
    - Or, if you want this frontend application to make API request to the locally hosted backend API (localhost://3001). This command set `REACT_APP_ENV=local-backend` so that the app can bypass authorization.

    ```
    npm run build-local-backend && serve -s build
    ```

## 4.3. Production Deployment
CITIESair front-end application is deployed on GitHub in this repo. The domain (citiesair.com) is managed in [name.com](https://www.name.com/). To deploy changes to the production website, simply run `npm run deploy` in development environment.