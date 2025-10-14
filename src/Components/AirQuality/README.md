# AirQualityScreen Components: for `screen` page

This folder groups components that are specifically for displaying air quality measurements in CITIESair. They are strictly unique for CITIESair and can not be found in CITIES Dashboard.

### Files

- [**AirQualityIndexLegendQuickGlance.jsx**](./AirQualityIndexLegendQuickGlance.jsx): 

  ![aqi-at-a-glance](/documentation/aqi-at-a-glance.png)

  - This component re-uses `FadeInButtonForSpeedDial` from [SpeedDial folder](/src/Components/SpeedDial/FadeInButtonForSpeedDial.jsx) to have a similar floating button where upon hovering will display a small table summarizing the Air Quality Index (AQI).

  - This aims to help remind the user of the different AQI categories wherever they are on the `dashboard` page

  - Under the hood, it calls component `AirQualityIndexTable` which will be explained next

- [**AirQualityIndexTable.jsx**](./AirQualityIndexTable.jsx): 

  - This is a reusable and versatile table that summarizes different AQI categories. It is used in 2 different places with a few visual differences:

    - (In `AirQualityIndexLegendQuickGlance`) Short summary for AQI quick glance: shorter, more glance-able, only emphasizing on the color schemes and thresholds of each categories
      
    - (In `AQIexplanation`) Full-length explanation of AQI right above the first chart in `/dashboard` page: longer, in addition to the color schemes and thresholds, it contains suggestions on what the user can do in each category
    
- [**AQIexplanation.jsx**](./AQIexplanation.jsx): 

  Utilizes component from [ExpandableSection.jsx](/src/Components/ExpandableSection/ExpandableSection.jsx) to display, with elegance, a short explanation of what the US AQI system is. This can be found in the `/dashboard` page, right above the first chart:

  ![us-aqi-explanation](/documentation/us-aqi-explanation.png)

- [**AQImap.jsx**](./AQImap.jsx): 

  Re-usable map component built upon `react-leaflet` to show geolocations of air quality sensors and their current measurements. It makes use of Leaflet's:

  - `<Marker>`: displays the location of each sensor on the map, formatted as a circle whose background color depends on the current air quality category, with the AQI number displayed on top of the circle

  - `<Popup>`: displays a popup showing more detailed information of the currently selected sensor (such as `PM2.5`, `weather`, `link to IQAir public webpage (for public sensor)`...), if `disableInteraction = false`

    ![aqi-map-popup](/documentation/aqi-map-popup.png)
  
  ### There are 2 use cases:

  - Public air quality map of IQAir sensors operated by CITIESair on the `/` page:

    ![public-air-quality-map-on-home-page](/documentation/home-page-2.png)

      This map uses `jawg.io` free custom tiles (`dark` and `light`). 

      ---

  - Map of 10+ sensors on NYU Abu Dhabi campus on `/dashboard/nyuad`, `/nyuadMap`, and `/nyuadBanner`:

    ![map-of-nyuad-sensors](/documentation/dashboard-page-2.png)

      To comply with `jawg.io` free tier's requirement of no commercialized use (only public use, not behind login), this map uses self-made `.svg` tiles, with also 2 options for `dark` and `light` mode.

  ### `AQImap` provides several props for customization, for example:

  - `displayMinimap`: additionally show a miniMap (`bottom-left`) that provides a bird-eye-view of the entire area covered by NYUAD sensors, useful when the user zooms in a lot and loses sight of the far-away sensor locations. The miniMap's tile theme will always be opposite of the main map to provide enough contrast between the two (`dark` miniMap for `light` main map, and vice versa)

  - `disableInteraction`: as the name suggests, this will disable interactions with the map such as zooming, panning (moving around), clicking on the `<Marker>`

  - `centerCoordinates`, `maxBounds`, `minZoom`, `maxZoom`, `defaultZoom`: props for controlling the initial position of the map, its bounding box, and how much zoom is allowed (and in the beginning)

  - `locationTitle`: `LocationTitles.short` or `LocationTitles.short`

  - ...

- [**CurrentAQIGrid.jsx**](./CurrentAQIGrid.jsx): 

  - A reusable component displaying AQI of sensors for a given school in `BIG` fonts to capture people's attention. It is used across the whole website:
    - `/`: selected 3 sensors at NYU Abu Dhabi to exemplify what kind of data CITIESair provides 

      ![aqi-grid-on-home-page](/documentation/home-page-1.png)

    - `/dashboard/:school_id`, `/nyuadBanner`: all sensors of a school's current measurement

      ![aqi-grid-on-dashboard-page](/documentation/dashboard-page-2.png)

    - `/screen/:school_id/:screen_id`: a pair of sensor to compare them (usually `outdoors` and `indoors`)

      ![aqi-grid-on-screen-page](/documentation/screen-page.png)

  - Apart from the usual `BIG` font grid, this file also contains `SimpleAQIList` that displays the list of sensors in less space, useful for `/dashboard/nyuad` and `/nyuadBanner` where there are 10+ sensors. This strips down unnecessary data from each sensor such as `weather` and `last_seen` and only show the sensor's name with current AQI readings (with color scheme):
    ![simple-aqi-list](/documentation/simple-aqi-list.png)

  - It also makes use of [**CurrentAQIGridSize.jsx**](./CurrentAQIGridSize.jsx)'s enumeration to determine the size of each element depends on each use case:
    - `large`: for `/screen`
    - `medium`: default
    - `small`: for `/nyuadBanner` if the screen size is small (since the [banner](/src/Pages/Embeds/README.md) embedded on Students Portal can be as small as `270px` in width)

- [**SensorStatus.jsx**](./SensorStatus.jsx): 

  Helper file containing enumerations and helper functions to determine the status of a sensor from its `last_seen` timestamp. There are 2 possible statuses:
    - `active`: the sensor is online and provides current measurements
    - `offline`: the sensor's latest recorded measurement was > 6 hours ago
