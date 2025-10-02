// disable eslint for this file
/* eslint-disable */
import { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { AQI_Database } from '../../../Utils/AirQuality/AirQualityIndexHelper';
import { SensorStatus } from '../SensorStatus';
import { Box } from '@mui/material';

import { areDOMOverlapped } from './ScreenUtils';

import { capitalizePhrase, getTranslation } from '../../../Utils/UtilFunctions';
import { INACTIVE_SENSOR_COLORS } from '../../../Themes/CustomColors';
import { useTheme } from '@mui/material';
import { PreferenceContext } from '../../../ContextProviders/PreferenceContext';
import AggregationType from '../../DateRangePicker/AggregationType';

const numberOfHoursForHistoricalData = 6;

const RecentHistoricalGraph = (props) => {
  const { data } = props;
  const { language } = useContext(PreferenceContext);
  const theme = useTheme();

  const graphContainer = useRef();
  const layerBackground = useRef();
  const layerTexts = useRef();
  const layerXaxisWrapper = useRef();
  const layerLines = useRef();

  let width, height, xAxis, yAxis;
  let maxAQItoDisplay = 200;
  const dotRadius = 10;
  const margin = { top: 30, right: 80, bottom: 0, left: 70 };

  // Set up D3's line generator
  const lineGenerator = d3
    .line()
    .x(function (d) {
      return xAxis(d.timestamp);
    }) // set the x values for the line generator
    .y(function (d) {
      return yAxis(d.aqi.val);
    }) // set the y values for the line generator
    .curve(d3.curveCardinal.tension(0)); // apply smoothing to the line

  useEffect(() => {
    if (!data) return;
    if (!graphContainer.current) return;
    if (!layerBackground.current) return;
    if (!layerTexts.current) return;
    if (!layerXaxisWrapper.current) return;
    if (!layerLines.current) return;

    const viewHours = data?.[0]?.metadata?.viewHours || numberOfHoursForHistoricalData;
    const aggregationType = data?.[0]?.metadata?.aggregationType;
    const xTickInterval = aggregationType === AggregationType.hour ? 4 : 1; // every 4 hours for .hour and 1 hour otherwise

    width = graphContainer.current.clientWidth;
    height = graphContainer.current.clientHeight - margin.top;

    // Clear all previous drawings
    d3.select(layerBackground.current).selectAll("*").remove();
    d3.select(layerTexts.current).selectAll("*").remove();
    d3.select(layerXaxisWrapper.current).selectAll("*").remove();
    d3.select(layerLines.current).selectAll("*").remove();

    d3.select(layerBackground.current)
      .attr("opacity", 0.5);
    d3.select(layerTexts.current)
      .attr("filter", "brightness(0.8) contrast(1.2) saturate(1.2)");

    Object.entries(data).forEach(([key, sensorData]) => {
      // Create the JS date object and calculate AQI from raw measurements
      sensorData.historical?.forEach(function (d) {
        d.timestamp = new Date(d.timestamp)
      });

      // Calculate the maximum value AQI of this sensor
      if (sensorData.historical && Array.isArray(sensorData.historical)) {
        const max = d3.max(sensorData.historical, function (d) {
          return d.aqi.val;
        });
        if (max > maxAQItoDisplay) maxAQItoDisplay = max;
      }
    });

    // Calculate the maximum AQI for the y-axis to display
    maxAQItoDisplay = Math.ceil(maxAQItoDisplay / 50) * 50; // round to the nearest 50 points

    for (let category of AQI_Database) {
      if (maxAQItoDisplay >= category.aqiUS.low && maxAQItoDisplay <= category.aqiUS.high) {
        maxAQItoDisplay = category.aqiUS.high === Infinity ? maxAQItoDisplay : category.aqiUS.high;
        break;
      }
    };

    // 1. Set up the xAxis domain and range
    let xAxisMax = new Date();
    let xAxisMin = new Date();
    xAxisMin.setHours(xAxisMin.getHours() - viewHours);
    xAxis = d3.scaleTime().domain([xAxisMin, xAxisMax]).rangeRound([margin.left, width - margin.right]); // width is inclusive of margin

    // 2. Set up the yAxis domain and range
    yAxis = d3.scaleLinear().domain([0, maxAQItoDisplay]).range([height + margin.top, margin.top]); // height is already exclusive of margin

    // 3. Add the background category layer and the AQI levels (rectangles) and the grids
    let font_size = Math.max(
      Math.floor(((AQI_Database[1].aqiUS.high - AQI_Database[0].aqiUS.high) / maxAQItoDisplay) * height / 2),
      20);

    let marginText = Math.floor(font_size / 5);
    // 4. Loop through all the aqi_category and add each category into the graph
    for (let i = 0; i < AQI_Database.length; i++) {
      const element = AQI_Database[i];
      const upper = element.aqiUS.high === Infinity ? maxAQItoDisplay : element.aqiUS.high;
      const lower = element.aqiUS.low;

      if (maxAQItoDisplay <= lower) break;

      // Add the rectangles
      const aqiRange = Math.ceil((upper - lower) / 50) * 50;
      d3.select(layerBackground.current)
        .append("rect")
        .attr("x", 0)
        .attr("y", height - (upper / maxAQItoDisplay) * height + margin.top)
        .attr("width", width)
        .attr("height", aqiRange / maxAQItoDisplay * height)
        .attr("fill", element.color.Light);

      // Add the AQI categories numbers
      d3.select(layerTexts.current)
        .append("text")
        .attr("x", marginText)
        .attr(
          "y",
          height -
          (element.aqiUS.low / maxAQItoDisplay) * height -
          3.5 * marginText + margin.top
        )
        .attr("fill", element.color.Light)
        .attr("font-size", font_size)
        .text(Math.floor(element.aqiUS.low / 50) * 50);

      d3.select(layerTexts.current)
        .append("text")
        .attr("class", "category-text-graph-sm")
        .attr("x", marginText + 2)
        .attr(
          "y",
          height - (element.aqiUS.low / maxAQItoDisplay) * height - marginText + margin.top
        )
        .attr("fill", element.color.Light)
        .attr("font-size", font_size / 2)
        .text(getTranslation(element.category, language));
    };

    // 5. Add the xAxisWrapper and its texts
    d3.select(layerXaxisWrapper.current)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", margin.top)
      .attr("fill", "white");

    // 6. Add the X Axis on top of the graph, as well as ticks
    // Floor xAxisMax to the top of the hour (e.g. 11:34 → 11:00)
    xAxisMax.setMinutes(0, 0, 0);
    // Generate tick array starting from floored max
    const ticks = [];
    for (let t = new Date(xAxisMax); t >= xAxisMin; t.setHours(t.getHours() - xTickInterval)) {
      ticks.push(new Date(t));
    }
    ticks.reverse(); // earliest → latest
    // Now apply these ticks to the axis
    d3.select(layerXaxisWrapper.current)
      .append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(
        d3.axisTop(xAxis)
          .tickSize(-height)
          .tickValues(ticks)
          .tickFormat(d3.timeFormat("%H:%M"))
      )
      .attr("font-size", height / 20)
      .attr("color", INACTIVE_SENSOR_COLORS.screen)
      .select(".domain")
      .remove();

    d3.select(layerXaxisWrapper.current)
      .selectAll('line')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', 0.5);

    Object.entries(data).forEach(([key, sensorData]) => {
      // 7.1. Append the line chart for this location
      d3.select(layerLines.current)
        .append("path")
        .datum(sensorData.historical || [])
        .attr("x", margin.left)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "transparent")
        .attr("stroke", "black")
        .attr("stroke-width", "5px")
        .attr("opacity", sensorData.sensor?.location_type === "outdoors" ? 1 : 0.5);

      // 7.2. Append the circle marker at the end of this line chart to denote its liveness
      const mostRecentData = sensorData.historical?.length > 0 ? sensorData.historical?.[0] : null;
      if (
        mostRecentData &&
        mostRecentData.aqi &&
        mostRecentData.aqi.val !== undefined &&
        mostRecentData.aqi.val !== null &&
        mostRecentData.timestamp
      ) {
        const markerWrapper = d3.select(layerLines.current)
          .append("g")
          .attr(
            "transform",
            "translate(" +
            xAxis(mostRecentData.timestamp) +
            "," +
            yAxis(mostRecentData.aqi.val) +
            ")"
          )
          .attr("fill",
            sensorData?.current?.aqi?.categoryIndex !== null ?
              theme.palette.text.aqi[sensorData.current.aqi.categoryIndex] :
              INACTIVE_SENSOR_COLORS.screen
          )
          ;

        sensorData.sensor?.sensor_status === SensorStatus.active &&
          markerWrapper.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("filter", "brightness(0.5)")
            .attr("class", "pulse-ring")
            .attr("r", 2.5 * dotRadius);

        markerWrapper.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("stroke", "#666")
          .attr("class", sensorData.sensor?.sensor_status === SensorStatus.active && "pulse-dot")
          .attr("r", dotRadius);

        markerWrapper.append("text")
          .attr("class", "location-label")
          .attr("x", dotRadius * 1.5)
          .attr("y", 0)
          .attr("fill", "black")
          .attr("alignment-baseline", "middle")
          .attr("text-anchor", "left")
          .attr("font-size", height / 25)
          .text(capitalizePhrase(sensorData.sensor?.location_short));

        const locationLabels = document.getElementsByClassName("location-label");
        for (let i = 1; i < locationLabels.length; i++) {
          const locationLabel_1 = locationLabels[i - 1];
          const locationLabel_2 = locationLabels[i];
          const overlapped = areDOMOverlapped(locationLabel_1.getBoundingClientRect(), locationLabel_2.getBoundingClientRect());

          if (overlapped !== 0) {
            locationLabel_1.setAttribute("y", overlapped * dotRadius);
            locationLabel_2.setAttribute("y", - overlapped * dotRadius);
          }
        }
      }
    });

  }, [data, language])

  return (
    <Box
      sx={{
        '& .pulse-ring': {
          animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
          '@keyframes pulse-ring': {
            '0%': {
              transform: 'scale(0.2)'
            },
            '80%': {},
            '100%': {
              opacity: 0
            }
          }
        },
        '& .pulse-dot': {
          animation: 'pulse-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
          '@keyframes pulse-dot': {
            '0%': {
              transform: 'scale(0.5)'
            },
            '50%': {
              transform: 'scale(1)',
              filter: 'brightness(1.2) contrast(1.2) saturate(1.2)'
            },
            '100%': {
              transform: 'scale(0.5)'
            }
          }
        }
      }}
      width="100%"
      height="100%"
    >
      <svg
        id="recent-historical-graph"
        width="100%"
        height="100%"
        ref={graphContainer}
      >
        <g ref={layerBackground} />
        <g ref={layerXaxisWrapper} />
        <g ref={layerTexts} />
        <g ref={layerLines} />
      </svg>
    </Box>

  );
}

export default RecentHistoricalGraph;