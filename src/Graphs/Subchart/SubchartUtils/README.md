# SubchartUtils

This folder contains the utility functions for the subchart component.

### [`GoogleChartStyleWrapper.jsx`](GoogleChartStyleWrapper.jsx)
This provides a re-usable wrapper container for subcharts to alter its appearance through MUI's styled component. This is necessary, even with Google Chart's default `options` parameter which allows modifications of the chart's appearance, because some advanced stylings were hard-coded in the library and requires being overridden with additional CSS code. For example:
- Styling for the chart's tooltip when the user hovers over a series or a data point in the chart.
- Chart control's appearance, to make them look more consistent with the dashboard's theme, instead of the default Google Chart's look (that looks quite similar to plain HTML)

### [`SeriesSelector.jsx`](SeriesSelector.jsx)
This component is designed to enable users to select / deselect data series in visualizations, providing users with the ability to customize the data displayed according to their preferences. This component is particularly useful in charts with a lot of data series (5+) and where user control over the visibility of these series enhances the analysis experience. **Key features and implementation details are summarized below:**

**Flexible User Selection Mechanism**: 
- Supports both single and multiple selections, allowing users to choose ONLY one at a time or several data series to be displayed. This flexibility is controlled through the `allowMultiple` prop. The same prop can be stored and read out from `seriesSelector.allowMultiple` in `temp_database.json`
- *[Only Desktop]* Supports both a drop down menu and `Chip` for the user to select/deselect series. `Chip` provides at-a-glance information on which series are currently shown and a convenient way to remove series from view. `Chip` is not shown on small screen devices to save space.

**Flexible Implementation Mechanism**: 
- Although the underlying method for showing/hiding a series is implemented in the `Subchart` component (documentation [here](../SubChart.jsx)), it is also worth nothing that there are 2 methods as such:
   - `toggleVisibility`: "hide" a series by making it transparent. This is good for situations where we do not want the chart axis scale to change when selecting/deselecting series. The series will still occupying a space in the chart, albeit not seen by the user. This is akin to `visibility: hidden` in CSS.
   - `setViewColumn`: properly hide a series by removing it from the underlying `dataView` inside the chart (using `setView` method, [documentation by Google](https://developers.google.com/chart/interactive/docs/reference#dataview-class)). As this approach completely removes certain series from the `dataView`, it will affect the scaling of axes to fit the displaying series. This is akin to `display: none` in CSS.
- Whichever method should the `SeriesSelector` uses can be provided in the `temp_database.json` in `seriesSelector.method`.

**Series Population**:
- Series items are dynamically populated from the `itemsFromChart` prop. `Subchart` supplies this prop with its calculated `dataColumn` from Google Charts.

**State Management and Effects**:
- The component maintains internal state for selected items and the `SELECT_ALL` toggle, updating in response to user interactions and external prop changes.
- Uses `useEffect` hooks to react to changes in props and to enforce rules like auto-selecting the first series in single-selection mode.

**Series Selection Callback**:
- Communicates user selections back to the parent component (`Subchart`) via the `onSeriesSelection` callback. This helps `Subchart` to show/hide the series according to the user selection.

**User Interaction**:
- Single selection mode utilizes radio buttons for clear, exclusive choices.
- Multiple selection mode employs checkboxes for each series item and includes a `SELECT_ALL` toggle to quickly select/deselect all series.
- Disables the deselection of the last selected option, ensuring that at least one data series remains visible.
- When the user deselect all series by switching off the `SELECT_ALL` toggle, the drop down menu will deselect all but the first series, ensuring that at least one data series remains visible.
- When the user manually selects all the series, the `SELECT_ALL` toggle will be automatically switched as well to reflect the state of the selector.

**Appearance**:
- Utilizes `MenuProps` to style the dropdown menu, enhancing the user interface with custom heights, overflow behaviors, and background colors derived from the theme context.
- Leverages `useTheme` to apply consistent styling and to adapt visual elements such as checkboxes, radio buttons, and the `SELECT_ALL` switch according to the application's theme.

*The exact props passed to the `SeriesSelector` component can be found in the [`Subchart.jsx`](../SubChart.jsx) file, where the component is integrated into the subchart visualization via subchart options.*