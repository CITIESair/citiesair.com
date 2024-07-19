import { calculateSensorStatus } from "../Components/AirQuality/AirQualityScreen/ScreenUtils";
import AQIdatabase from "../Utils/AirQuality/AirQualityIndexHelper";
import parse from 'html-react-parser';
import { SupportedFetchExtensions, RESTmethods } from "./Utils";

export const fetchDataFromURL = async ({
  url,
  extension = SupportedFetchExtensions.json,
  needsAuthorization = true,
  restMethod = RESTmethods.GET,
  body = null,
  includesHeadersJSON = true
}) => {
  try {
    // overrides needsAuthorization if developing locally on local backend
    if (process.env.REACT_APP_ENV === 'local-backend') {
      needsAuthorization = false;
    }

    const fetchOptions = {
      method: restMethod,
      credentials: needsAuthorization ? 'include' : 'omit',
      ...(body && { body: JSON.stringify(body) }),
      ...(SupportedFetchExtensions.json && includesHeadersJSON && {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (response.status === 204) {
      return true;
    }

    switch (extension) {
      case SupportedFetchExtensions.json:
        return await response.json();
      case SupportedFetchExtensions.csv:
        return await response.text();
      default:
        return response;
    }
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const fetchAndProcessCurrentSensorsData = async (apiUrl) => {
  try {
    const data = await fetchDataFromURL({ url: apiUrl });

    if (!data) {
      throw new Error('Returned data is empty');
    }

    try {
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

    } catch (error) {
      // Handle the case where data is not an iterable object
      console.error("Error: data is not iterable", error);
    }
  }
  catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
