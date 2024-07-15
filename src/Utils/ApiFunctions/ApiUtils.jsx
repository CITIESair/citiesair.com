import { fetchDataFromURL } from "./ApiCalls";
import { calculateSensorStatus } from "../../Components/AirQuality/AirQualityScreen/ScreenUtils";
import AQIdatabase from "../AirQuality/AirQualityIndexHelper";
import parse from 'html-react-parser';
import AggregationType from "../../Components/DateRangePicker/AggregationType";
import { API_CITIESair_URL } from "../GlobalVariables";

export const GeneralEndpoints = {
  me: "me",
  current: "current",
  raw: "raw",
  schoolmetadata: "schoolmetadata",
  chartdata: "chartdata",
  screen: "screen",
  login: "login",
  logout: "logout",
  map: "map_public_outdoors_stations",
  alerts: "alerts",
  alertsEmails: "alerts/emails"
}

export const ChartEndpoints = {
  historical: "chart/historicalAQI",
  dailyAverageAllTime: "chart/dailyAverageAllTime",
  percentageByMonth: "chart/percentageByMonth",
  yearlyAverageByDoW: "chart/yearlyAverageByDoW",
  hourlyAverageByMonth: "chart/hourlyAverageByMonth",
  correlationDailyAverage: "chart/correlationDailyAverage"
}

export const ChartEndpointsOrder = [
  ChartEndpoints.historical,
  ChartEndpoints.dailyAverageAllTime,
  ChartEndpoints.percentageByMonth,
  ChartEndpoints.yearlyAverageByDoW,
  ChartEndpoints.hourlyAverageByMonth,
  ChartEndpoints.correlationDailyAverage
]

export const RawDatasetType = {
  daily: "daily",
  hourly: "hourly"
}

export const getAlertsApiUrl = ({
  endpoint,
  school_id,
  alert_id
}) => {
  if (endpoint !== GeneralEndpoints.alerts) return;

  return `${API_CITIESair_URL}/${endpoint}/${school_id}${alert_id ? `/${alert_id}` : ''}`;
}

export const getApiUrl = ({
  endpoint,
  school_id
}) => {

  switch (endpoint) {
    case GeneralEndpoints.current:
    case GeneralEndpoints.schoolmetadata:
    case GeneralEndpoints.chartdata:
    case GeneralEndpoints.alertsEmails:
      return `${API_CITIESair_URL}/${endpoint}/${school_id}`;

    case GeneralEndpoints.screen:
      const currentUrl = window.location.href;
      const regex = /\/screen\/(.+)/;
      const match = currentUrl.match(regex);
      if (match && match.length > 1) return `${API_CITIESair_URL}/${endpoint}/${match[1]}`
      else return;

    default:
      return `${API_CITIESair_URL}/${endpoint}`;
  }
}

export const getHistoricalChartApiUrl = ({ endpoint, school_id, aggregationType = AggregationType.hourly, startDate, endDate, dataType }) => {
  let baseUrl = `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}&aggregationType=${aggregationType}`;

  if (startDate && endDate) {
    baseUrl = `${baseUrl}&startDate=${startDate}&endDate=${endDate}`;
  }

  return baseUrl;
};

export const getChartApiUrl = ({ endpoint, school_id, dataType }) => {
  return `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}`;
}

export const getCorrelationChartApiUrl = ({ endpoint, school_id, dataType, sensorX, sensorY }) => {
  return `${API_CITIESair_URL}/${endpoint}/${school_id}?dataType=${dataType}&sensorX=${sensorX}&sensorY=${sensorY}`;
}

export const getRawDatasetUrl = ({ school_id, sensor_location_short, datasetType, isSample }) => {
  return `${API_CITIESair_URL}/${GeneralEndpoints.raw}/${school_id}/${sensor_location_short}/${datasetType}?isSample=${isSample === true ? true : false}`;
}

export const fetchAndProcessCurrentSensorsData = async (apiUrl) => {
  try {
    const data = await fetchDataFromURL({ url: apiUrl });

    if (!data) {
      throw new Error('Returned data is empty');
    }

    try {
      return processCurrentSensorsData(data);
    } catch (error) {
      // Handle the case where data is not an iterable object
      console.error("Error: data is not iterable", error);
    }
  }
  catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}

export const processCurrentSensorsData = (data) => {
  Object.entries(data).forEach(([_, sensorData]) => {
    // Calculate if the sensor is currently active or not
    const now = new Date();
    const currentTimestamp = new Date(sensorData.current?.timestamp);
    const lastSeenInHours = Math.round((now - currentTimestamp) / 1000 / 3600);
    if (sensorData.current) {
      sensorData.current.lastSeenInHours = lastSeenInHours;
      sensorData.current.sensor_status = calculateSensorStatus(lastSeenInHours);

      const aqi = sensorData.current.aqi;
      if (typeof aqi?.categoryIndex === 'number' && !isNaN(aqi?.categoryIndex)) {
        const { color, category, healthSuggestions } = AQIdatabase[aqi.categoryIndex];
        const healthSuggestion = parse(healthSuggestions[sensorData.sensor?.location_type] || "");

        sensorData.current = {
          ...sensorData.current,
          color,
          category,
          healthSuggestion
        }
      }
    }
  });
  return data;
}