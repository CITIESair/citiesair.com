# AirQualityScreen

![screen-page](/documentation/screen-page.png)

### [RecentHistoricalGraph.jsx](./RecentHistoricalGraph.jsx): 
  
  This component wraps a `d3.js` chart that shows raw historical data comparison between a pair of sensors during the past X hours (depends on what is returned from backend, but default is `6 hours`). `d3.js` is used instead of Google Charts or NivoCharts because of:
    - Legacy reason (the original screen was designed with Vanilla HTML, Javascript, and d3.js)
    - Complex visualization, especially for the colored background and the pulsating dots

### [ScreenDropDownMenu.jsx](./ScreenDropDownMenu.jsx): 

  A dropdown menu for the user to choose from different `screen` available for a given school. Behavior:

  - If there is only ONE `screen` for this school, pressing this button will direct the user to the `screen/:school_id` page immediately. Most of the time, that would be between `outdoors` and `indoors` sensors of that school, as most schools only have ONE pair of outdoor-indoor sensor

  - If there are more than ONE `screen` for this screen, pressing this button will reveal a drop down menu that the user can choose from different `screen/:school_id/:screen_id` routes

      ![screen-drop-down-menu](/documentation/screen-drop-down-menu.png)
