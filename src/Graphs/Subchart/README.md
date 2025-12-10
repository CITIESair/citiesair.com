# Subchart

The `SubChart` component is an integral part of the CITIES dashboard, designed to dynamically render various subcharts in a chart. Its architecture allows it to support a wide array of chart types, including both Google Charts and Nivo Charts, accommodating the specific requirements of different datasets and visualization preferences. 

### Imports
- **ContextProviders**: `GoogleContext` is used to load the Google Charts library and provide access to Google Charts components and functions. The library can only be loaded once during the entire life cycle of the web app; therefore, it is implemented in a Context Provider.
- **Chart Components and Helpers**: ([Detailed documentation for these functions](../README.md))
  1. **Google Charts Components and Helpers**:
   - `generateRandomID`: Generates unique IDs for Google Charts containers.
   - `returnGenericOptions`: Parses `chartData` (constructed from `temp_database.json` file), together with some other props such as `subchartIndex` and `isSmall` to return the appropriate `options` property for the Google charts.
   - `returnChartControlUI`: Returns formatting options for the appearance of the chart controls
   - `ChartControlType`: Enumerates different types of chart controls available.
   - `addTouchEventListenerForChartControl`: Enhances chart controls with touch event listeners for improved mobile interaction.
   - `GoogleChartStyleWrapper`: A wrapper component for styling Google Charts.
  
  2. **General Utility Functions and Components for Chart Loading and Control**:
   - `LoadingAnimation`: Displays a loading animation while chart data is being fetched or processed.
   - `getCalendarChartMargin`, `yearSpacing`: Utility functions specific to calendar chart layout adjustments.
- **Device Detection**: `isMobile` from `react-device-detect` helps adjust the component's behavior or layout based on the device type, enhancing responsiveness and user experience.

### Props
- `chartData`: The data for the chart to be rendered retrieved from chart API calls. This is the core information that dictates what type of chart and how it is configured.
- `subchartIndex`: Used to locate the specific subchart within the chartData array, ensuring the correct subchart is rendered.
- `windowSize`: Information about the current window size for responsive charts (Google Charts is partially responsive, but not 100%)
- `isSmall`: A boolean indicating if the device width is below breakpoint `md`, influencing chart layout decisions.
- `height`, `maxHeight`: Specify the desired height constraints for the chart.

### Early Return Condition for Nivo Calendar Chart
If the chart type is `Calendar`, it returns early and renders a (Nivo) `CalendarChart` component. This process involves checking if the fetched data exists, transforming it into a format suitable for a Nivo `CalendarChart`, and calculating the chart's height based on the number of years covered by the data. This dynamic height calculation ensures that the calendar chart responsively accommodates all data points across different years.

### NoChartToRender
This component is used with state variables:

```
  const [shouldRenderChart, setShouldRenderChart] = useState(true);
  const [renderChartNow, setRenderChartNow] = useState(false);
```
...to display a no chart placeholder in cases where `dataArray` is not valid (checking with function `isValidArray()`) and would make Google Chart throw an error otherwise. This scenario happens when the user choose a `dataType` that is not supported by a sensor (but might be supported by other sensors in the same school), such as VOC (only supported by indoor sensors) or CO2 (only supported by outdoor sensors).

### Google Charts Rendering and Interactive Features
The component focuses on rendering standard Google Charts and enhancing them with interactive features such as `SeriesSelector` and various Chart Controls. This section delves into the setup, rendering, and interaction management for Google Charts within the `SubChart` component.

#### Setup and Initial Render
- **Google Visualization API**: The component utilizes the Google Visualization API, made accessible through the `GoogleContext`, to dynamically load and render Google Charts based on `chartData`.
- **Dynamic ID and State Management**: A unique ID for each chart instance is generated to prevent DOM conflicts. States for the chart wrapper, data table, and control wrappers are managed to handle the chart's lifecycle and interactions efficiently.
- **Chart Options and Configuration**: Chart options are computed based on the provided `chartData`, `options`, and the application's current theme and orientation, ensuring a responsive and visually consistent rendering.

#### Rendering Process
- **Chart and Dashboard Wrapper Initialization**: Depending on whether the chart includes interactive controls, a dashboard wrapper may be initialized to bind control wrappers to the chart wrapper, facilitating interactive data filtering and manipulation.

#### Interactive Features
- **Series Selector**: Allows users to dynamically select which data series are visible on the chart, enhancing usability for charts with a lot of series. This feature is implemented by manipulating the chart's view columns or toggling series visibility. ([*Detailed documentation for SeriesSelector can be found here*](./SubchartUtils/README.md)).

- `SubChart` contains the logic to implement the actual showing/hiding of the series (while `Series Selector` concerns more with the UI). There are 2 methods as such:
  - `toggleVisibility`: "hide" a series by making it transparent. This is good for situations where we do not want the chart axis scale to change when selecting/deselecting series. The series will still occupying a space in the chart, albeit not seen by the user. This is akin to `visibility: hidden` in CSS.
  - `setViewColumn`: properly hide a series by removing it from the underlying `dataView` inside the chart (using `setView` method, [documentation by Google](https://developers.google.com/chart/interactive/docs/reference#dataview-class)). As this approach completely removes certain series from the `dataView`, it will affect the scaling of axes to fit the displaying series. This is akin to `display: none` in CSS.
  - Whichever method should the `SeriesSelector` uses can be provided in the `temp_database.json` in `seriesSelector.method`.

- **Chart Controls**: Supports the integration of various Google Chart controls (e.g., `CategoryFilter`, `ChartRangeFilter`) to enable dynamic data exploration. Custom UI adjustments and enhancements, such as touch event listeners for mobile responsiveness, are applied to these controls for an improved user experience. These controls can be enabled via the subchart's `options` configuration in `chartData`. ([*Documentation for Google Charts Chart Controls*](https://developers.google.com/chart/interactive/docs/gallery/controls))

- **Tooltip Management for Chart Controls**: Implements logic to display informative tooltips for certain chart controls, guiding users on their functionality. This includes managing tooltip visibility based on user interactions and device type. For instance, tooltips for `ChartRangeFilter` are displayed on hover for desktop users and by default for mobile users under the chart range filter.

#### Lifecycle and Re-render Optimization
- **Memoization and Callbacks**: The component uses `useMemo` and `useCallback` hooks to optimize the computation of chart options and control configurations, preventing unnecessary re-renders and computations.
- **Responsive Adjustments**: Reacts to changes in theme, device orientation, and window size, dynamically adjusting chart options and control configurations to ensure an optimal visual presentation and user experience across devices.