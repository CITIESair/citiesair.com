import { calculateSensorStatus } from "../Components/AirQuality/SensorStatus";
import { AQI_Database } from "../Utils/AirQuality/AirQualityIndexHelper";
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
