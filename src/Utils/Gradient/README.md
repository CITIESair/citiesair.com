# Gradient Utils

### Overview

These utils help create different kinds of gradients (or also just an array of solid colors) to display air quality categories for different purposes listed in Subsection [Use Cases](#use-cases). Implementation details for each use case differs because they use slightly different ways to achieve gradients, such as `fill in <svg>` or `background-gradient: ... in css`.

While the final gradients vary between use cases, they share similar building blocks, such as `normalizeColorStops` and `normalizeColorStopOffsets`, to normalize either:
- An array of colors strings `string[]`: the offsets are automatically divided equally between colors. For example: `["red", "green", "blue"]` will output a gradient of 33.33% distance between each color. 
- OR, an array of colors objects:
  ```
  [
    {
      color: string, // must be HEX
      offset: float // usually is the cut-off value of this air quality category
      },
    ...
  ]
  ```
  In the case of an array of colors objects above, these helper function will normalize them from 0 to 1 and clamp them if necessary (if `optionalMinValue` or `optionalMaxValue` are provided).

### Use Cases

- For the first chart `historical`: function `BackgroundGradient` and `generateSvgFillGradient` are used

  ![dashboard-page-chart-1](/documentation/dashboard-page-1.png)


- For [NivoCalendarChart](src/Graphs/Subchart/NivoCharts/NivoCalendarChart.jsx) for chart `dailyAverageAllTime`:

  ![daily-average-calendar-chart](/documentation/daily-average-calendar-chart.png)

  - For the legend `ValueRangeBox`: function `generateCssBackgroundGradient` is used

  - For the cells: `generateDiscreteColorGradientArray` is used. `Discrete` might sound odd, because we are talking about gradients anyway. And it's true, this function will return a string array `string[]` of `N (steps)` number of discrete colors interpolated from the colors and stops provided. 
  
    This is because `NivoChart` only works with `string[]` in its `colors` array AND assume these colors are equally spaced. For example, if we want to display this gradient in 10 steps:
    ```
    [
      {
        color: "red",
        offset: 0
      },
      {
        color: "red",
        offset: 0.5
      },
      {
        color: "blue",
        offset: 0.5
      }
      {
        color: "blue",
        offset: 1
      }
    ]
    ```
    ...this function will output:
    ```
    ["red", "red", "red", "red", "red", "blue", "blue", "blue", "blue", "blue"]
    ```

- For the alert's [ThresholdSlider.jsx](src/Components/AirQuality/AirQualityAlerts/AlertModificationDialog/ThresholdSlider.jsx): function `generateCssBackgroundGradient` is used

  ![alert-dialog-with-gradient-threshold-slider](/documentation/alert-dialog.png)



