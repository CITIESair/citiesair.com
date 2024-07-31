# AirQuality

### Files

- **TemperatureUtils.jsx**
  
  - `convertTemperature`: converts between Celsius and Fahrenheit 
  - `getFormattedTemperature`: returns formatted temperature value with the appropriate unit
  - `calculateHeatIndex`: calculates heat index from temperature and relative humidity measurements. Celsius temperatures must be converted to Fahrenheit first, as the [formula](https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml) to calculate heat index is based on Fahrenheit

    ![heat-index](/documentation/heat-index.png)