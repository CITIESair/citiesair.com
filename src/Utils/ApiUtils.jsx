import { fetchDataFromURL } from "../Components/DatasetDownload/DatasetFetcher";
import { calculateSensorStatus } from "../Components/AirQuality/AirQualityScreen/ScreenUtils";
import { SensorStatus } from "../Components/AirQuality/SensorStatus";
import convertToAQI from "./AirQuality/AirQualityIndexCalculator";
import AQIdatabase from "./AirQuality/AirQualityIndexHelper";
import parse from 'html-react-parser';

const apiDomain = 'https://api.citiesair.com';

export const EndPoints = {
  me: "me",
  current: "current",
  raw: "raw",
  schoolmetadata: "schoolmetadata",
  chartdata: "chartdata",
  historicalAQI: "historicalAQI",
  screen: "screen",
  login: "login",
  logout: "logout",
  map: "map_public_outdoors_stations"
}

export const RawDatasetType = {
  daily: "daily",
  hourly: "hourly"
}

export const getApiUrl = ({
  endpoint,
  school_id,
  aggregationType = null,
  startDate = null,
  endDate = null
}) => {
  if ([EndPoints.current, EndPoints.schoolmetadata, EndPoints.chartdata].includes(endpoint)) {
    return `${apiDomain}/${endpoint}/${school_id}`;
  }

  else if (endpoint === EndPoints.historicalAQI) {
    if (!(aggregationType && startDate && endDate)) return;

    return `${apiDomain}/${endpoint}/${school_id}?aggregationType=${aggregationType}&startDate=${startDate}&endDate=${endDate}`;
  }

  else if (endpoint === EndPoints.screen) {
    const currentUrl = window.location.href;
    const regex = /\/screen\/(.+)/;
    const match = currentUrl.match(regex);

    if (match && match.length > 1) return `${apiDomain}/${endpoint}/${match[1]}`
    else return;
  }
  else return `${apiDomain}/${endpoint}`;
}

export const getRawDatasetUrl = ({ school_id, sensor_location_short, datasetType, isSample }) => {
  return `${apiDomain}/${EndPoints.raw}/${school_id}/${sensor_location_short}/${datasetType}?isSample=${isSample === true ? true : false}`;
}

export const fetchAndProcessCurrentSensorsData = async (apiUrl) => {
  try {
    const data = await fetchDataFromURL({ url: apiUrl, extension: 'json', needsAuthorization: true });

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
    }

    // Calculate AQI from raw measurements
    if (sensorData.current?.["pm2.5"]) {
      const aqiObject = convertToAQI(sensorData.current["pm2.5"]);
      if (aqiObject) {
        const aqiCategory = AQIdatabase[aqiObject.aqi_category_index];
        sensorData.current.aqi = aqiObject.aqi;
        sensorData.current.category = aqiCategory.category;

        // Only add color and healthSuggestion if the sensor is active
        if (sensorData.current.sensor_status === SensorStatus.active) {
          sensorData.current = {
            ...sensorData.current,
            color: aqiCategory.lightThemeColor,
            healthSuggestion: aqiCategory.healthSuggestions[sensorData.sensor?.location_type] && parse(aqiCategory.healthSuggestions[sensorData.sensor?.location_type])
          };
        }
      }
    }
  });
  return data;
}