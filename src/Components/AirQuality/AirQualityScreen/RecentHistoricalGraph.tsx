import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Line, ScaleTime, ScaleLinear } from 'd3';
import { AQI_Database } from '../../../business-domain/air-quality/air-quality.database';
import { Box, useTheme } from '@mui/material';

import { areDOMOverlapped, TypesOfScreen } from './ScreenUtils';

import { capitalizePhrase, getTranslation, isValidArray } from '../../../Utils/UtilFunctions';
import { INACTIVE_SENSOR_COLORS } from '../../../Themes/CustomColors';
import { usePreferences } from '../../../ContextProviders/PreferenceContext';
import { DataTypeKeys } from '../../../business-domain/data-types/data-type.types';
import { ScreenSensorData, ScreenSensorsData } from '../../../Pages/Screens/SensorPairScreen';
import { SensorStatus } from '../SensorStatus';

type ScreenHistoricalMeasurement = ScreenSensorData["historical"][number];

const numberOfHoursForHistoricalData = 6;

interface RecentHistoricalGraphProps {
  typeOfScreen: TypesOfScreen;
  data: ScreenSensorsData | undefined;
}

const RecentHistoricalGraph = ({ typeOfScreen, data: sensorData }: RecentHistoricalGraphProps) => {
  const { language } = usePreferences();
  const theme = useTheme();

  const graphContainer = useRef<SVGSVGElement>(null);
  const layerBackground = useRef<SVGGElement>(null);
  const layerTexts = useRef<SVGGElement>(null);
  const layerXaxisWrapper = useRef<SVGGElement>(null);
  const layerLines = useRef<SVGGElement>(null);

  let width: number, height: number;
  let xAxis: ScaleTime<number, number>;
  let yAxis: ScaleLinear<number, number>;
  let maxAQItoDisplay = 200;
  const dotRadius = 10;
  const margin = { top: 30, right: 80, bottom: 0, left: 70 };

  // Historical data with Date timestamp (instead of string)
  type HistoricalWithDate = Omit<ScreenHistoricalMeasurement, 'timestamp'> & { timestamp: Date };

  // Set up D3's line generator - using parsed data with Date timestamps
  const lineGenerator: Line<HistoricalWithDate> = d3
    .line<HistoricalWithDate>()
    .x(function (d) {
      return xAxis(d.timestamp);
    }) // set the x values for the line generator
    .y(function (d) {
      return yAxis(d.aqi?.val || 0);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

  useEffect(() => {
    if (!sensorData) return;
    if (!graphContainer.current) return;
    if (!layerBackground.current) return;
    if (!layerTexts.current) return;
    if (!layerXaxisWrapper.current) return;
    if (!layerLines.current) return;

    // Type guard to check if sensor has data
    const hasData = (sensorData: ScreenSensorData) => {
      return isValidArray(sensorData.historical);
    };

    const firstSensorWithData = sensorData.find(hasData);
    const viewHours = firstSensorWithData?.metadata?.viewHours || numberOfHoursForHistoricalData;
    const xTickInterval = Math.floor(viewHours / 6);

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

    sensorData.forEach((sensorData) => {
      if (!hasData(sensorData)) return;

      // Calculate the maximum value AQI of this sensor
      if (sensorData.historical && Array.isArray(sensorData.historical)) {
        const max = d3.max(sensorData.historical, function (d) {
          return d.aqi?.val || 0;
        });
        if (max && max > maxAQItoDisplay) maxAQItoDisplay = max;
      }
    });

    // Calculate the maximum AQI for the y-axis to display
    maxAQItoDisplay = Math.ceil(maxAQItoDisplay / 50) * 50; // round to the nearest 50 points

    for (let category of AQI_Database) {
      if (maxAQItoDisplay >= category[DataTypeKeys.aqi].low && maxAQItoDisplay <= category[DataTypeKeys.aqi].high) {
        maxAQItoDisplay = category[DataTypeKeys.aqi].high === Infinity ? maxAQItoDisplay : category[DataTypeKeys.aqi].high;
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
      Math.floor(((AQI_Database[1][DataTypeKeys.aqi].high - AQI_Database[0][DataTypeKeys.aqi].high) / maxAQItoDisplay) * height / 2),
      20);

    let marginText = Math.floor(font_size / 5);
    // 4. Loop through all the aqi_category and add each category into the graph
    for (let i = 0; i < AQI_Database.length; i++) {
      const element = AQI_Database[i];
      const upper = element[DataTypeKeys.aqi].high === Infinity ? maxAQItoDisplay : element[DataTypeKeys.aqi].high;
      const lower = element[DataTypeKeys.aqi].low;

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
          (element[DataTypeKeys.aqi].low / maxAQItoDisplay) * height -
          3.5 * marginText + margin.top
        )
        .attr("fill", element.color.Light)
        .attr("font-size", font_size)
        .text(Math.floor(element[DataTypeKeys.aqi].low / 50) * 50);

      const categoryText = getTranslation(element.category, language);
      d3.select(layerTexts.current)
        .append("text")
        .attr("class", "category-text-graph-sm")
        .attr("x", marginText + 2)
        .attr(
          "y",
          height - (element[DataTypeKeys.aqi].low / maxAQItoDisplay) * height - marginText + margin.top
        )
        .attr("fill", element.color.Light)
        .attr("font-size", font_size / 2)
        .text(typeof categoryText === 'string' ? categoryText : String(categoryText));
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
    const ticks: Date[] = [];
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

    sensorData.forEach((sensorData, index) => {
      if (!hasData(sensorData)) return;

      // Transform historical data to have Date timestamps for d3
      const historicalWithDates: HistoricalWithDate[] = sensorData.historical?.map(d => ({
        ...d,
        timestamp: new Date(d.timestamp)
      })) || [];

      // 7.1. Append the line chart for this location
      const path = d3.select(layerLines.current!)
        .append("path")
        .datum(historicalWithDates)
        .attr("x", margin.left)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "transparent")
        .attr("stroke", "black")
        .attr("stroke-width", "5px");
      if (typeOfScreen === "indoorsVsOutdoors") {
        path.attr("opacity", sensorData.sensor?.location_type === "outdoors" ? 1 : 0.5);
      } else {
        path.attr("opacity", index % 2 === 0 ? 1 : 0.5);
      }

      // 7.2. Append the circle marker at the end of this line chart to denote its liveness
      const mostRecentData = historicalWithDates.length > 0 ? historicalWithDates[0] : null;
      if (
        mostRecentData &&
        mostRecentData.aqi &&
        mostRecentData.aqi.val !== undefined &&
        mostRecentData.aqi.val !== null &&
        mostRecentData.timestamp
      ) {
        const markerWrapper = d3.select(layerLines.current!)
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
            sensorData?.current?.aqi?.categoryIndex !== null && sensorData?.current?.aqi?.categoryIndex !== undefined ?
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
          .attr("class", sensorData.sensor?.sensor_status === SensorStatus.active ? "pulse-dot" : "")
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
            locationLabel_1.setAttribute("y", String(overlapped * dotRadius));
            locationLabel_2.setAttribute("y", String(- overlapped * dotRadius));
          }
        }
      }
    });

  }, [sensorData, language])

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
