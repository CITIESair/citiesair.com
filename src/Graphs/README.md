# Graphs

The components in `src/Graphs` are the heart and soul of CITIESair. They provide re-usable components to draw different kinds of charts, as well as interactive components to switch between different subcharts or filter and modify the appearance of the charts.

### [GoogleChartHelper.jsx](GoogleChartHelper.jsx):

This file contains helper functions for Google Charts. It also contains a function to add touch event listeners to the chart control `ChartRangeFilter`, as Google Charts do not natively support touch events for that particular control.

Some notable sub-components / functions in this file include:

1. `returnGenericOptions`
   This function parses `chartData` received from backend API, together with some other props such as `subchartIndex`, and `isPortrait` to return the appropriate `options` property for the Google Charts. `options` mainly concerns the appearance of the charts, and not the underlying data. Therefore, this function can be understood to "format" the charts to the desired appearance.
   
   As `chartData` is structured in such a way that for charts with subcharts, any properties in the subcharts `options` object will override duplicate properties in the main charts `options`, the function makes multiple modifications to `options` to arrive at the final, most complete one. It also supplies `options` with default properties which are shared among all charts, such as `theme: 'material'`. It also parses properties stored in `chartData` which are not native to Google Charts, such as `serie.color = 'default'`, to match the React's application theme, avoiding hard-coding such values in the database, making the entire project more modular.

   As Google Charts is inherently not 100% responsive, it also invokes other functions defined in this file `GoogleChartHelper.jsx`, such as `returnResponsiveFontSizeInPixels`, to make the charts more readable in mobile devices.

2. `returnChartControlUI`:
   The objective of this function is to return formatting options for the appearance of the chart controls, similar to the previous `returnGenericOptions` for the main charts. It tries to keep the appearance between the main chart and certain chart control, such as `ChartRangeFilter`, consistent. For example, if the main chart is a bar graph with a certain color scheme and `vAxis` range, its `ChartRangeFilter` will also look like that, albeit with some hard-coded changes to make it more legible given the small height it has.

3. `ChartControlType`:
   An object literal to centrally store some customized metadata for the chart control, such as the position with respect to the actual chart, depending on the chart control's type, for better user experience.

4. `addTouchEventListenerForChartControl`:
   As mentioned, as Google Charts do not natively support touch events for `ChartRangeFilter` control, this function is implemented as a work-around to allow touch interaction with this control. It listens to the various touch interactions (`touchstart`, `touchmove`, `touchend`), map them to equivalences in mouse events (`mousedown`, `mousemove`, `mouseup`), and simulate these mouse events so it works with Google Charts' native control logic.


### [`ChartComponentWrapper.jsx`](ChartComponentWrapper.jsx)
This is the wrapper component to display a visualization in the dashboard. 

#### Tabs for subcharts
This wrapper container also implements `Tabs` as a way to quickly navigate between different subcharts of the same chart, provided that they are available. For CITIESair, subcharts are used to switch between different sensor location for the same kind of visualization:

![subcharts-tabs](/documentation/subcharts-tabs.png)

If subcharts are available, `Tabs` are shown and their navigation logic is implemented inside this component. By default, the first subchart is shown after the user loads the page; tab positions do not persist between page loads as they are only saved in memory. If there are more subcharts than `maxTabsToDisplay`, it will display the rest of the `Tabs` in a dropdown menu to avoid cluttering the user experience. For now, only `nyuad` has enough sensor locations to trigger this behavior:

![subcharts-tabs-dropdown-menu](/documentation/subcharts-tabs-dropdown-menu.png)

If subcharts are not available, one single chart is displayed instead, without any `Tabs`.

#### Switching between different data types
One key difference of CITIESair from CITIES Dashboard is the addition of `dataType` switching for each chart:

![data-type-switching](/documentation/data-type-switching.png)

`ChartComponentWrapper` takes care of the logic implementation of this feature with:
- A dropdown menu whose button is `inline` with the title of the chart, saving space and catching user's attention. The actual UI component for the drop down is implemented in [DataTypeDropDown.jsx](./DataTypeDropDown.jsx). 
- `fetchChartDataType` is called whenever `dataType` is switched so that it can call the appropriate API to the backend and re-draw the chart with the new data

#### Subtitles and references
While at first glance it makes more sense to put subtitles for each (sub)chart in [Subchart.jsx](./Subchart/SubChart.jsx), the subtitles and references displayed in this component because it combines the general subtitles for the entire chart (all subcharts) and any specific subchart subtitles. This is feature made possible by the nested structure of `chartData`. 

### Handle window size to optimize chart responsiveness
- `handleWindowResize`: added to a `resize` event listener, together with a debounce of `100ms`, to resize the chart container upon window resize. This is due to the fact that Google Charts are not 100% responsive out of the box, and requires further customization, such as determining if the current window is portrait or not, to improve the charts' readability in small screen devices.