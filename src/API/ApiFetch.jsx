import { calculateSensorStatus } from "../Components/AirQuality/SensorStatus";
import { AQI_Database } from "../Utils/AirQuality/AirQualityIndexHelper";
import parse from 'html-react-parser';
import { SupportedFetchExtensions, RESTmethods } from "./Utils";

const genericErrorMessage = 'Network response was not OK';

export const fetchDataFromURL = async ({
  url,
  extension = SupportedFetchExtensions.json,
  needsAuthorization = true,
  restMethod = RESTmethods.GET,
  body = null,
  includesContentTypeHeader = true
}) => {
  try {
    const fetchOptions = {
      method: restMethod,
      credentials: needsAuthorization ? 'include' : 'omit',
      ...(body && { body: JSON.stringify(body) }),
      headers: {}
    };

    if (includesContentTypeHeader) {
      switch (extension) {
        case SupportedFetchExtensions.json:
          fetchOptions.headers["Content-Type"] = "application/json; charset=UTF-8";
          break;
        case SupportedFetchExtensions.csv:
          fetchOptions.headers["Content-Type"] = "text/csv; charset=UTF-8";
          break;
        default:
          break;
      }
    }

    const response = await fetch(url, fetchOptions);

    // Case: 500
    if (response.status === 500) {
      return Promise.reject(new Error('The server encountered an error. Please try again later.'));
    }

    // Proceed with case OK 204
    if (response.status === 204) {
      return true;
    }

    // All other errors
    if (!response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        return Promise.reject(new Error(errorData.message || genericErrorMessage));
      } else {
        const errorText = await response.text();
        return Promise.reject(new Error(errorText || genericErrorMessage));
      }
    }

    // OK
    switch (extension) {
      case SupportedFetchExtensions.json:
        return await response.json();
      case SupportedFetchExtensions.csv:
        return await response.text();
      default:
        return response;
    }
  } catch (error) {
    // Check if it's a network error
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }

    // For other errors, preserve the original message
    throw new Error(error.message);
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
        const lastSeenTimestamp = new Date(sensorData.sensor?.last_seen || sensorData.current?.timestamp);
        const lastSeenInMinutes = Math.round((now - lastSeenTimestamp) / 1000 / 60);
        const sensor_status = calculateSensorStatus(lastSeenInMinutes);

        // Update current data
        if (sensorData.current) {
          const aqi = sensorData.current.aqi;
          if (typeof aqi?.categoryIndex === 'number' && !isNaN(aqi?.categoryIndex)) {
            const { category, healthSuggestions } = AQI_Database[aqi.categoryIndex];
            const healthSuggestion = parse(healthSuggestions[sensorData.sensor?.location_type] || "");

            sensorData.current = {
              ...sensorData.current,
              category,
              healthSuggestion
            }
          }
        }

        // Update sensor metadata
        sensorData.sensor = {
          ...sensorData.sensor,
          lastSeenInMinutes,
          sensor_status
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
