// Get url context for different display's location
const url = new URL(document.location.href);
const searchParamsKeys = url.searchParams;
let locationQuery;
let isFahrenheit = false; // default value
let shouldDisplayHeatIndex = true; // default value
searchParamsKeys.forEach((value, key) => {
  switch (key) {
    case 'isF':
      isFahrenheit = value;
      break;
    case 'heatIndex':
      shouldDisplayHeatIndex = value;
      break;
    // urlParams should be something like this /?nyuad-c2&isF=true&heatIndex=false, with the locationQuery key doesn't have any value
    default:
      if (!value) locationQuery = key;
      break;
  }
});


// Variables to be populated after fetching the right location for the air quality display
let indoorsLocation;
let outdoorsLocation;

let startDate;

// Parameters for the chart
let xTickPeriod = 120; // xAxis ticks every 2 hour
let width, height;
let margin = { top: 30, right: 80, bottom: 0, left: 70 };
let marginText;
let dotRadius = 10;
let xAxisDomain;

$(document).ready(initDashboard);

// Helper function to fetchAQI from outdoor and indoor stations
async function fetchAQI() {
  // 1. Get the current timestamp
  now = new Date();
  // 1.1. Round this up one hour for the xAxisMax
  let xAxisMax = new Date();
  // roundDateToNearestHour(xAxisMax);
  // 1.2. Minus "dashboardParameter.historicalPeriod" hours from now to get xAxisMin
  let xAxisMin = new Date();
  xAxisMin.setHours(xAxisMin.getHours() - dashboardParameter.historicalPeriod);
  // 1.3. Set xAxisDomain
  xAxisDomain = [xAxisMin, xAxisMax];
  // 1.4. Set startDate for ThingSpeak's API call
  startDate =
    xAxisMin.toISOString().split("T")[0] +
    "%20" +
    xAxisMin.toISOString().split("T")[1];

  // 2. Clear previous health suggestions
  let $ul = $("#health-suggestions");
  $ul.html("");

  // 3. Fetch AQI data for each station
  const indoorsHistorical = await fetchAQIforLocation({ locationObject: indoorsLocation, shouldFetchWeather: false });
  const outdoorsHistorical = await fetchAQIforLocation({ locationObject: outdoorsLocation, shouldFetchWeather: true });

  // Helper to fetch AQI data for each station
  // and update relevant fields on the dashboard
  async function fetchAQIforLocation({ locationObject, shouldFetchWeather }) {
    // 1. Form url to fetch
    const pm25Url = `https://api.thingspeak.com/channels/${locationObject.channelID}/field/${locationObject.pm25Field}.json?api_key=${locationObject.api}&offset=${dashboardParameter.offset}&start=${startDate}&round=${dashboardParameter.roundMeasurementTo}&average=${dashboardParameter.average}`;
    let raw_data = await jsonFetcher(pm25Url);

    // 2. Remove NaN values
    let data = raw_data.feeds.filter(function (e) {
      let value = e[["field" + locationObject.pm25Field]];
      if (!isNaN(value) && value != null) {
        return value;
      }
    });

    // 3. If there is data at all, then get the latest measurement
    let current_raw, timestamp, now, lastUpdate;
    if (data.length > 0) {
      current_raw = data[data.length - 1]["field" + locationObject.pm25Field];
      timestamp = new Date(data[data.length - 1].created_at);
      now = new Date();
      lastUpdate = Math.round((now - timestamp) / 1000 / 3600); // get the difference between 2 timestamps in hour(s)
    }

    const thisLocationAQI = {
      isOnline: (current_raw != null) ? true : false, // if there is no measurement whatsoever then the sensor is offline (vice versa)
      isActive: (lastUpdate <= 1) ? true : false, // if the last measurement is more than 1 hour ago, then it's not active at the moment
      lastUpdate: lastUpdate,
      ...convertToAQI(current_raw) // convert the raw measurement to AQI
    };

    const typeID = locationObject.stationType;

    // 4. Fetch weather data, only show weather data if the sensor is active
    if (shouldFetchWeather && thisLocationAQI.isActive) {
      // 4.1. Fetch weather data
      const weather_url =
        `https://api.thingspeak.com/channels/${locationObject.channelID}/feeds/last.json?api_key=${locationObject.api}&offset=${dashboardParameter.offset}&round=${dashboardParameter.roundMeasurementTo}`;
      let weather_data = await jsonFetcher(weather_url);

      var tempC = parseFloat(weather_data["field" + locationObject.temperatureField]);
      var tempF = celsiusToFahrenheit(tempC);
      var humidity = parseFloat(weather_data["field" + locationObject.humidityField]);

      // 4.2. Update weather fields
      $(`#${typeID} .temperature .weather-data`).first().html(isFahrenheit ? tempF.toFixed(0) : tempC.toFixed(0));
      $(`#${typeID} .humidity .weather-data`).first().html(humidity.toFixed(0));
      $(".weather").show();

      // 4.3. Calculate heat index and display it if appropriate
      showHeatIndex();

    }
    else
      $(".weather").hide();

    // 5.1. Update the location's name
    $(`#${typeID} .location`).first()
      .html(locationObject.nameLong);
    // 5.2. Update current AQI fields
    $(`#${typeID} .aqi-index`).first()
      .html(thisLocationAQI.isOnline ? thisLocationAQI.aqi : "--")
      .attr("data-category", thisLocationAQI.isActive ? thisLocationAQI.aqi_object.class : "inactive");
    $(`#${typeID} .aqi-category`).first()
      .html(thisLocationAQI.isOnline ? thisLocationAQI.aqi_object.category : "--")
      .attr("data-category", thisLocationAQI.isActive ? thisLocationAQI.aqi_object.class : "inactive");
    $(`#${typeID} .location`).first()
      .attr("data-category", thisLocationAQI.isActive ? thisLocationAQI.aqi_object.class : "inactive");
    $(`#${typeID} .sensor-status`).first()
      .html(thisLocationAQI.isOnline ? (thisLocationAQI.isActive ? "" : `Last update: ${thisLocationAQI.lastUpdate}h ago`) : "Sensor Offline");

    // Return early if the sensor has no data at the moment
    if (data.length == 0) return [];

    // 5.3. Update heath suggestion fields for the most current measurements
    const healthKey = `${(locationObject.specialLocation) ? locationObject.specialLocation : typeID}Health`;
    let text = thisLocationAQI.aqi_object[healthKey];
    text && $ul.append(`<li ${(thisLocationAQI.aqi > 100) && "class='suggestion-flashing'"}>${text}</li>`);

    // 6. Convert all historical raw PM2.5 measurements to AQI
    // and remove NaN values
    for (let i = data.length - 1; i >= 0; i--) {
      let item = data[i];
      item.aqi = convertToAQI(item["field" + locationObject.pm25Field]).aqi;
      if (isNaN(item.aqi) || item.aqi == null) {
        data.splice(i, 1);
      } else {
        delete item["entry_id"];
        delete item["field" + locationObject.pm25Field];
      }
    }
    return data;

    function showHeatIndex() {
      if (!shouldDisplayHeatIndex) return;

      const heatIndexObject = calculateHeatIndex({ tempF: tempF, humidity: humidity, shouldReturnFahrenheit: isFahrenheit });
      if (heatIndexObject) {
        $(".heat-index").html(Math.round(heatIndexObject.heatIndex));
        $(".heat-index-category").html(heatIndexObject.category ? ` - ${heatIndexObject.category}` : '');
      }
      else {
        $(".heat-index").html($(`#${typeID} .temperature .weather-data`).html());
        $(".heat-index-category").html();
      }
    }
  }

  // 4. Call function to plot the graph
  plotHistorical(indoorsHistorical, outdoorsHistorical);
}

async function initDashboard() {
  // 0. Assign unit to temperature and display/hide heat index
  $(".temperature-unit").html(`${isFahrenheit ? "F" : "C"}`)
  if (!shouldDisplayHeatIndex) $(".heat-index-wrapper").hide();

  // 1. Mitigate burn-in by re-arranging the sections every two months
  arrangeWrapper();

  // 2. Fetch the location of this url, if query is not valid, stop executing dashboard
  const validQuery = await fetchLocation(locationQuery);
  if (!validQuery) return;

  // 3. Initialize the graph area
  width = $("#historical-graph-wrapper").width();
  height = $("#historical-graph-wrapper").height() - margin.top - margin.bottom;
  initGraph();

  // 4.1. Call the first fetch
  fetchAQI();
  // 4.2. Subsequently call fetch every fetchPeriod
  setInterval(function () {
    fetchAQI();
  }, dashboardParameter.fetchPeriod * 1000);
}

// ----------- D3 plotting
let svg;
let layerLine, layerBackground, layerTexts; // layer 1 below layer 2 below layer3
let x, y;
function initGraph() {
  // Create a new graph
  svg = d3
    .select("#historical-graph-wrapper")
    .append("svg")
    .attr("id", "historical-graph")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("g");

  layerBackground = svg.append("g").attr("id", "layerBackground");
  layerTexts = svg.append("g").attr("id", "layerTexts");
  layerXaxisWrapper = svg.append("g").attr("id", "layerXaxisWrapper");
  layerLine = svg.append("g").attr("id", "layerLine");
}

function plotHistorical(indoorsHistorical, outdoorsHistorical) {
  // 1. Clearing the old layers
  $("#layerLine, #layerTexts, #layerBackground, #layerXaxisWrapper").html("");

  // 2. Set up the x and y scales
  x = d3.scaleTime().rangeRound([margin.left, width - margin.right]); // width is inclusive of margin
  y = d3.scaleLinear().range([height + margin.top, margin.top]); // height is already exclusive of margin

  // 3. d3's line generators
  var lineIndoor = d3
    .line()
    .x(function (d) {
      return x(d.created_at);
    }) // set the x values for the line generator
    .y(function (d) {
      return y(d.aqi);
    }) // set the y values for the line generator
    .curve(d3.curveCardinal.tension(0)); // apply smoothing to the line
  var lineOutdoor = d3
    .line()
    .x(function (d) {
      return x(d.created_at);
    })
    .y(function (d) {
      return y(d.aqi);
    })
    .curve(d3.curveMonotoneX);

  // 4. Format the date timestamp (created_at)
  indoorsHistorical.forEach(function (d) {
    d.created_at = new Date(d.created_at);
  });
  outdoorsHistorical.forEach(function (d) {
    d.created_at = new Date(d.created_at);
  });

  // 5. Set the domain of the x Axis (time axis)
  x.domain(xAxisDomain);

  // 6.1. Find the maximum aqi values within the historical period to set the maximum aqi to display on the y scale
  let maxIndoor = d3.max(indoorsHistorical, function (d) {
    return d.aqi;
  });
  if (maxIndoor == null) maxIndoor = 0;
  let maxOutdoor = d3.max(outdoorsHistorical, function (d) {
    return d.aqi;
  });
  if (maxOutdoor == null) maxOutdoor = 0;
  let maxAQIToDisplay = Math.max(maxIndoor, maxOutdoor);
  maxAQIToDisplay = Math.ceil(maxAQIToDisplay / 50) * 50; // round to the nearest 50 points
  // fixed maxAQIToDisplay limit when aqi is low
  if (maxAQIToDisplay <= 200) maxAQIToDisplay = 200;
  // fixed maxAQIToDisplay limit when aqi is low
  else if (maxAQIToDisplay <= 250) maxAQIToDisplay = 300;
  // round to the next 100 for very unhealthy
  else if (maxAQIToDisplay == 350) maxAQIToDisplay = 400; // round to the next 100 for hazardous

  // 6.2. Set domain for y axis
  y.domain([0, maxAQIToDisplay]);

  // 7. Add the background category layer and the AQI levels (rectangles) and the grids
  let font_size;
  // Loop through all the aqi_category and add each category into the graph
  aqi_category.forEach(function (d, i) {
    // Adjust font size for the labels depending on the graph area
    if (font_size == null) {
      font_size = Math.floor((((d[2] - d[1]) / maxAQIToDisplay) * height) / 2);
      marginText = font_size / 4;
    }

    // Add the rectangles
    layerBackground
      .append("rect")
      .attr("class", "category-block-graph")
      .attr("x", 0)
      .attr("y", height - (d[2] / maxAQIToDisplay) * height + margin.top)
      .attr("width", width)
      .attr("height", ((d[2] - d[1]) / maxAQIToDisplay) * height)
      .attr("fill", aqiArray[i].color);

    // Add the horizontal lines
    if (i != aqi_category.length - 1) {
      layerBackground
        .append("line")
        .style("stroke", "#eee")
        .style("stroke-width", 1)
        .attr("x1", 0)
        .attr("y1", height - (d[2] / maxAQIToDisplay) * height + margin.top)
        .attr("x2", width)
        .attr("y2", height - (d[2] / maxAQIToDisplay) * height + margin.top);
    }

    // Add the AQI categories numbers
    layerTexts
      .append("text")
      .attr("class", "category-text-graph")
      .attr("x", marginText)
      .attr(
        "y",
        height -
        (d[1] / maxAQIToDisplay) * height -
        3.5 * marginText +
        margin.top
      )
      .attr("fill", aqiArray[i].color)
      .text(d[1]);

    layerTexts
      .append("text")
      .attr("class", "category-text-graph-sm")
      .attr("x", marginText + 2)
      .attr(
        "y",
        height - (d[1] / maxAQIToDisplay) * height - marginText + margin.top
      )
      .attr("fill", aqiArray[i].color)
      .text(d[0]);

    $(".category-text-graph").css("font-size", font_size + "px");
    $(".category-text-graph-sm").css("font-size", font_size / 2 + "px");
  });

  // 8.1 Add the X Axis Wrapper
  layerXaxisWrapper
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", margin.top)
    .attr("fill", "white");

  // 9.2. Add the X Axis on top of the graph, as well as ticks
  let xAxis = layerXaxisWrapper
    .append("g")
    .attr("transform", "translate(0," + margin.top + ")");
  let formatHour = d3.timeFormat("%H:%M");
  xAxis
    .call(
      d3
        .axisTop(x)
        .tickSize(-height) // negative length to make vertical lines
        .ticks(d3.timeMinute.every(xTickPeriod))
        .tickFormat(function (d) {
          return formatHour(d);
        })
    )
    .attr("class", "x-axis")
    .select(".domain")
    .remove();

  // 11. If there is historical data, add the lineIndoor timeseries path and its data marker
  let indoorsMostRecent;
  if (indoorsHistorical.length != 0) {
    indoorsMostRecent = indoorsHistorical[indoorsHistorical.length - 1];
    // 11.0. Add lineInddor
    layerLine
      .append("path")
      .datum(indoorsHistorical)
      .attr("class", "line")
      .attr("id", "line-indoor")
      .attr("d", lineIndoor);

    // 11.1. Create marker and adjust positions so that they land on the latest measurements of the historical data
    let indoorMarker = layerLine
      .append("g")
      .attr(
        "transform",
        "translate(" +
        x(indoorsMostRecent.created_at) +
        "," +
        y(indoorsMostRecent.aqi) +
        ")"
      );

    // 11.2. Add circles and rings to marker
    indoorMarker
      .append("circle")
      .attr("class", "live-ring") // Assign a class for styling
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("id", "indoor-ring")
      .attr("r", 2.5 * dotRadius)
      .attr("data-category", $("#indoors .aqi-index").attr("data-category"));
    indoorMarker
      .append("circle")
      .attr("class", "live-dot")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("id", "indoor-dot")
      .attr("r", dotRadius)
      .attr("data-category", $("#indoors .aqi-index").attr("data-category"));

    // 11.3. Add location label right next to the markers
    indoorMarker
      .append("text")
      .attr("class", "location-label-graph")
      .attr("x", dotRadius * 1.5)
      .attr("y", 0)
      .attr("fill", "currentColor")
      .text(indoorsLocation.nameShort);
  }

  // 12. Similar for outdoor line
  let outdoorsMostRecent;
  if (outdoorsHistorical.length != 0) {
    outdoorsMostRecent = outdoorsHistorical[outdoorsHistorical.length - 1];
    layerLine
      .append("path")
      .datum(outdoorsHistorical)
      .attr("class", "line")
      .attr("id", "line-outdoor")
      .attr("d", lineOutdoor);

    let outdoorMarker = layerLine
      .append("g")
      .attr(
        "transform",
        "translate(" +
        x(outdoorsMostRecent.created_at) +
        "," +
        y(outdoorsMostRecent.aqi) +
        ")"
      );

    outdoorMarker
      .append("circle")
      .attr("class", "live-ring") // Assign a class for styling
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("id", "outdoor-ring")
      .attr("r", 2.5 * dotRadius)
      .attr("data-category", $("#outdoors .aqi-index").attr("data-category"));
    outdoorMarker
      .append("circle")
      .attr("class", "live-dot")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("id", "outdoor-dot")
      .attr("r", dotRadius)
      .attr("data-category", $("#outdoors .aqi-index").attr("data-category"));

    outdoorMarker
      .append("text")
      .attr("class", "location-label-graph")
      .attr("x", dotRadius * 1.5)
      .attr("y", 0)
      .attr("fill", "currentColor")
      .text(outdoorsLocation.nameShort);
  }

  // 13. Adjust position of indoor and outdoor location label if necessary
  if (indoorsMostRecent && outdoorsMostRecent) {
    let rectIndoors = $(".location-label-graph")[0].getBoundingClientRect();
    let rectOutdoors = $(".location-label-graph")[1].getBoundingClientRect();
    if (areOverlapped(rectIndoors, rectOutdoors)) {
      let adjustPixel = (outdoorsMostRecent.aqi >= indoorsMostRecent.aqi) ? 12 : -12;
      $(".location-label-graph").eq(0).attr("y", adjustPixel);
      $(".location-label-graph").eq(1).attr("y", -adjustPixel);
    }
  }

  // 14. Add indoor - outdoor comparison in health suggestion texts
  // But check if the stations are active or not first
  if ($(".aqi-index").get().every(function (elem) { return elem.getAttribute("data-category") != "inactive"; })) {
    if (outdoorsMostRecent.aqi <= 50) return; // don't display comparison if outdoor air is good
    let ratio = outdoorsMostRecent.aqi / indoorsMostRecent.aqi;
    let comparison;
    if (ratio >= 2) comparison = `${parseFloat(ratio).toFixed(1)} times`;
    else if (ratio > 1.2) comparison = `${Math.round(100 * ((outdoorsMostRecent.aqi - indoorsMostRecent.aqi) / indoorsMostRecent.aqi))}%`;
    else return;
    $("#health-suggestions").prepend(`<li>Indoors is <span data-category="good">${comparison} better</span> than outdoors</li>`)
  }
}

function areOverlapped(rect1, rect2) {
  return !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);
}

// ----------- Helper functions

async function fetchLocation(locationQuery) {
  let json = await jsonFetcher('/locations.json');

  // Get the air quality display in the JSON, if found return true, if not return false
  if (locationQuery in json.airQualityDisplay) {
    const indoorsID = json.airQualityDisplay[locationQuery].indoorsID;
    const outdoorsID = json.airQualityDisplay[locationQuery].outdoorsID;

    indoorsLocation = json.stations[indoorsID];
    outdoorsLocation = json.stations[outdoorsID];

    // Update the QR code for historical data dashboard
    updateQRcode(json.airQualityDisplay[locationQuery].historical);

    return true;
  }

  console.log("Invalid query for air quality display");
  return false;
}

// Helper function to change layout of the dashbaord based on current's month
// (arrange the left and right sections of the screen)
// to mitigate burn-in if the same static image is displayed over a long period of time
function arrangeWrapper() {
  let months = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]; // 12 months of a year, change the layout every two months
  let now = new Date();
  let thisMonthIndex = now.getMonth(); // get the index of this Month (0-11)

  // Update the current layout of the screen based on this month's value
  // Layout 1: left-wrapper on the left, right-wrapper on the right
  if (months[thisMonthIndex] == 0) {
    $("#left-wrapper").css("order", "0");
    $("#cities-logo").addClass("cities-logo-anchor-right");
  }
  // Layout 2: reversed (left-wrapper on the right, right-wrapper on the left)
  else {
    $("#left-wrapper").css("order", "1");
    $("#cities-logo").addClass("cities-logo-anchor-left");
  }
}

// Helper function to dynamically center the QR code and set labels for the indoor location
function updateQRcode(query) {
  new QRCode(document.getElementById("qr-code"), `${window.location.host}/historical?${query}`);

  // Vertically center the QR code wrapper
  $("#qr-wrapper").height(
    $("#right-upper-wrapper").height() -
    ($("#right-wrapper h2, #right-wrapper h3").position().top +
      $("#right-wrapper h2, #right-wrapper h3").outerHeight(true))
  );
}

// Helper function to round to the nearest hour
// function roundDateToNearestHour(date) {
//   date.setMinutes(date.getMinutes() + 30);
//   date.setMinutes(0, 0, 0);
//   return date;
// }